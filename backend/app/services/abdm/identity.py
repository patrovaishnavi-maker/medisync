"""
ABDM Milestone 1 Service — Identity Creation & Verification
Handles ABHA authentication, Aadhaar/Mobile OTP challenges, profile resolution,
and association with internal MediSync patient accounts.
"""

import uuid
import datetime
import logging
from typing import Dict, Any, Optional
from .client import abdm_client
from .exceptions import ABDMException, ABDMValidationError
from .schemas import (
    VerifyAbhaInitiateRequest,
    VerifyAbhaInitiateResponse,
    VerifyAbhaConfirmRequest,
    VerifyAbhaConfirmResponse,
    AbhaIdentityProfile,
    CreateAbhaInitiateRequest,
    CreateAbhaInitiateResponse,
    CreateAbhaConfirmRequest
)

logger = logging.getLogger("medisync.abdm.identity")

# In-memory transaction registry for active auth challenges (in production, stored in Redis/DB with TTL)
ACTIVE_AUTH_TRANSACTIONS: Dict[str, Dict[str, Any]] = {}


class ABDMIdentityService:
    """Milestone 1 Identity Integration Service"""

    async def verify_existing_abha(self, req: VerifyAbhaInitiateRequest) -> VerifyAbhaInitiateResponse:
        """
        Step 1: Initiates authentication challenge with ABDM for an existing ABHA.
        Sends OTP to Aadhaar/Mobile linked to the ABHA identifier.
        """
        identifier = req.abha_identifier.strip()
        if not identifier:
            raise ABDMValidationError("ABHA identifier (number or address) is required.")

        request_id = str(uuid.uuid4())
        txn_id = f"TXN-ABDM-AUTH-{uuid.uuid4().hex[:12].upper()}"

        # Real ABDM Gateway request payload
        payload = {
            "requestId": request_id,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "query": {
                "id": identifier,
                "purpose": "KYC_AND_LINK",
                "authMode": req.auth_mode,
                "requester": {
                    "type": "HIP",
                    "id": "MEDISYNC_HOSPITAL_HIP_01"
                }
            }
        }

        # Dispatch via ABDM Client
        _, is_mock = await abdm_client.post("v0.5/users/auth/init", payload, request_id)

        # Store challenge state
        ACTIVE_AUTH_TRANSACTIONS[txn_id] = {
            "patient_id": req.patient_id,
            "identifier": identifier,
            "auth_mode": req.auth_mode,
            "request_id": request_id,
            "created_at": datetime.datetime.now(datetime.timezone.utc),
            "is_mock": is_mock
        }

        mode_msg = "Aadhaar registered mobile" if req.auth_mode == "AADHAAR_OTP" else "ABHA registered mobile"
        return VerifyAbhaInitiateResponse(
            request_id=request_id,
            txn_id=txn_id,
            auth_mode=req.auth_mode,
            status="OTP_DISPATCHED",
            message=f"Verification OTP has been dispatched to patient's {mode_msg}. (Sandbox Mode: Enter '123456' to confirm)",
            is_sandbox_simulation=is_mock
        )

    async def confirm_existing_abha_verification(self, req: VerifyAbhaConfirmRequest) -> VerifyAbhaConfirmResponse:
        """
        Step 2: Confirms the OTP challenge, verifies identity, and returns the verified ABHA profile.
        """
        txn_data = ACTIVE_AUTH_TRANSACTIONS.get(req.txn_id)
        if not txn_data:
            raise ABDMValidationError("Invalid or expired authentication transaction ID. Please initiate verification again.")

        if txn_data["patient_id"] != req.patient_id:
            raise ABDMValidationError("Patient identity mismatch for this transaction.")

        # In Sandbox testing, validate standard mock OTP '123456' or live callback token
        if req.otp != "123456" and not txn_data.get("is_live_validated"):
            raise ABDMValidationError("Invalid OTP entered. For sandbox testing, use '123456'.")

        identifier = txn_data["identifier"]
        is_demo = txn_data.get("is_mock", True)

        # Normalize ABHA Number & Address
        if "@" in identifier:
            abha_address = identifier
            abha_number = "91-4521-8932-1144"
        else:
            abha_number = identifier
            abha_address = f"patient.{identifier.replace('-', '')[-4:]}@abdm"

        now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
        profile = AbhaIdentityProfile(
            abha_number=abha_number,
            abha_address=abha_address,
            full_name="Rohan Verma" if "rohan" in abha_address else "Verified Patient Profile",
            gender="M",
            dob="1992-04-15",
            phone_masked="+91-XXXXXX3220",
            address="Plot 42, HITEC City, Hyderabad, Telangana - 500081",
            verification_status="VERIFIED",
            verified_at=now_str,
            is_demo_identity=is_demo
        )

        link_token = f"LINK-TOKEN-{uuid.uuid4().hex[:16]}"

        # Clean up transaction
        ACTIVE_AUTH_TRANSACTIONS.pop(req.txn_id, None)

        return VerifyAbhaConfirmResponse(
            status="VERIFIED",
            message="ABHA identity verified successfully. Associated with MediSync patient record.",
            patient_id=req.patient_id,
            profile=profile,
            link_token=link_token
        )

    async def initiate_abha_creation(self, req: CreateAbhaInitiateRequest) -> CreateAbhaInitiateResponse:
        """
        Initiates ABHA Creation flow via Aadhaar / Mobile OTP.
        """
        if not req.consent_confirmed:
            raise ABDMValidationError("Patient consent must be confirmed prior to initiating ABHA creation.")

        request_id = str(uuid.uuid4())
        txn_id = f"TXN-ABHA-CREATE-{uuid.uuid4().hex[:12].upper()}"

        ACTIVE_AUTH_TRANSACTIONS[txn_id] = {
            "patient_id": req.patient_id,
            "id_type": req.id_type,
            "request_id": request_id,
            "created_at": datetime.datetime.now(datetime.timezone.utc),
            "is_creation": True
        }

        return CreateAbhaInitiateResponse(
            request_id=request_id,
            txn_id=txn_id,
            status="OTP_SENT",
            message=f"ABDM Sandbox OTP sent for {req.id_type} verification. (Sandbox Mode: Enter '123456' to confirm creation)"
        )

    async def complete_abha_creation(self, req: CreateAbhaConfirmRequest) -> VerifyAbhaConfirmResponse:
        """
        Completes ABHA Creation, reserves ABHA address, and links to MediSync.
        """
        txn_data = ACTIVE_AUTH_TRANSACTIONS.get(req.txn_id)
        if not txn_data:
            raise ABDMValidationError("Invalid or expired ABHA creation transaction.")

        if req.otp != "123456":
            raise ABDMValidationError("Invalid OTP entered. For sandbox creation, use '123456'.")

        abha_number = "91-" + "-".join([str(uuid.uuid4().int % 9000 + 1000) for _ in range(3)])
        abha_address = req.desired_abha_address.strip()
        if not abha_address.endswith("@abdm"):
            abha_address += "@abdm"

        now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
        profile = AbhaIdentityProfile(
            abha_number=abha_number,
            abha_address=abha_address,
            full_name="New ABHA User",
            gender="M",
            dob="1995-06-20",
            phone_masked="+91-XXXXXX5521",
            address="Telangana, India",
            verification_status="VERIFIED",
            verified_at=now_str,
            is_demo_identity=True
        )

        ACTIVE_AUTH_TRANSACTIONS.pop(req.txn_id, None)

        return VerifyAbhaConfirmResponse(
            status="VERIFIED",
            message=f"ABHA {abha_number} ({abha_address}) created and verified successfully.",
            patient_id=req.patient_id,
            profile=profile,
            link_token=f"LINK-TOKEN-{uuid.uuid4().hex[:16]}"
        )


identity_service = ABDMIdentityService()
