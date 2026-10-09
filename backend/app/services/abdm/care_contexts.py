"""
ABDM Milestone 2 Service — Health Information Provider (HIP) Care Context Linking
Links hospital encounters, prescriptions, and lab reports to patient's verified ABHA.
"""

import uuid
import datetime
import logging
from typing import Dict, Any, List
from .client import abdm_client
from .exceptions import ABDMException, ABDMValidationError
from .schemas import (
    DiscoverContextsRequest,
    DiscoverContextsResponse,
    CareContextReference,
    InitiateLinkRequest,
    InitiateLinkResponse,
    ConfirmLinkRequest,
    ConfirmLinkResponse,
)

logger = logging.getLogger("medisync.abdm.care_contexts")

ACTIVE_LINK_TRANSACTIONS: Dict[str, Dict[str, Any]] = {}


class ABDMCareContextService:
    """Milestone 2 HIP Care Context Linking Service"""

    async def discover_contexts(self, req: DiscoverContextsRequest) -> DiscoverContextsResponse:
        """
        Discovers unlinked and linkable care contexts for a patient within MediSync hospital.
        """
        # In a real environment, queries encounters and prescriptions from database
        sample_contexts = [
            CareContextReference(
                care_context_reference="CC-MS-ENC-00101",
                display="Cardiology OP Consultation - Dr. Rajesh Sharma",
                record_category="OPConsultation",
                date="2026-10-01"
            ),
            CareContextReference(
                care_context_reference="CC-MS-RX-0044",
                display="Cardiology Prescription (Telmisartan, Atorvastatin)",
                record_category="Prescription",
                date="2026-10-01"
            ),
            CareContextReference(
                care_context_reference="CC-MS-LAB-0089",
                display="Comprehensive Lipid Panel & Serum Creatinine Report",
                record_category="DiagnosticReport",
                date="2026-10-02"
            ),
            CareContextReference(
                care_context_reference="CC-MS-ENC-00102",
                display="Pulmonology Inpatient Admission & Ward Observation",
                record_category="DischargeSummary",
                date="2026-10-07"
            )
        ]

        return DiscoverContextsResponse(
            patient_reference=req.patient_id,
            matched_contexts=sample_contexts
        )

    async def initiate_link(self, req: InitiateLinkRequest) -> InitiateLinkResponse:
        """
        Initiates ABDM Care Context Linking via NHA Gateway (/v0.5/links/link/init).
        Generates an OTP challenge to confirm patient's authorization to link hospital records.
        """
        if not req.care_context_ids:
            raise ABDMValidationError("At least one Care Context must be selected for linking.")

        request_id = str(uuid.uuid4())
        txn_id = f"TXN-ABDM-LINK-{uuid.uuid4().hex[:12].upper()}"

        payload = {
            "requestId": request_id,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "transactionId": txn_id,
            "patient": {
                "id": req.abha_address,
                "careContexts": [
                    {"referenceNumber": cc_id, "display": f"Care Record {cc_id}"}
                    for cc_id in req.care_context_ids
                ]
            }
        }

        _, is_mock = await abdm_client.post("v0.5/links/link/init", payload, request_id)

        ACTIVE_LINK_TRANSACTIONS[txn_id] = {
            "patient_id": req.patient_id,
            "abha_address": req.abha_address,
            "care_context_ids": req.care_context_ids,
            "request_id": request_id,
            "created_at": datetime.datetime.now(datetime.timezone.utc),
            "is_mock": is_mock
        }

        return InitiateLinkResponse(
            request_id=request_id,
            txn_id=txn_id,
            status="OTP_SENT",
            message=f"ABDM linking challenge generated. Enter OTP to link {len(req.care_context_ids)} care context(s) to ABHA. (Sandbox: Enter '123456')",
            communication_medium="MOBILE_SMS"
        )

    async def confirm_link(self, req: ConfirmLinkRequest) -> ConfirmLinkResponse:
        """
        Confirms OTP, associates care contexts to patient's ABHA, and notifies Gateway (/v0.5/links/link/on-add-contexts).
        """
        txn_data = ACTIVE_LINK_TRANSACTIONS.get(req.txn_id)
        if not txn_data:
            raise ABDMValidationError("Invalid or expired link transaction ID.")

        if req.token_or_otp != "123456":
            raise ABDMValidationError("Invalid linking OTP. For sandbox testing, enter '123456'.")

        linked_ids = txn_data["care_context_ids"]
        now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Notify Gateway
        request_id = str(uuid.uuid4())
        notify_payload = {
            "requestId": request_id,
            "timestamp": now_str,
            "acknowledgement": {
                "status": "SUCCESS"
            },
            "patient": {
                "referenceNumber": req.patient_id,
                "careContexts": [
                    {"referenceNumber": cc_id, "display": f"Record {cc_id}"}
                    for cc_id in linked_ids
                ]
            }
        }
        await abdm_client.post("v0.5/links/link/on-add-contexts", notify_payload, request_id)

        ACTIVE_LINK_TRANSACTIONS.pop(req.txn_id, None)

        return ConfirmLinkResponse(
            status="LINKED",
            message=f"Successfully linked {len(linked_ids)} care context(s) with ABHA {txn_data['abha_address']}.",
            linked_contexts=linked_ids,
            linked_at=now_str
        )


care_context_service = ABDMCareContextService()
