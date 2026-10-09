"""
ABDM Milestone 3 Service — Health Information User (HIU) Consent Management
Enables doctors and care providers to request patient consent and track approval lifecycle.
"""

import uuid
import datetime
import logging
from typing import Dict, Any, Optional
from .client import abdm_client
from .exceptions import ABDMException, ABDMValidationError
from .schemas import (
    ConsentCreateRequest,
    ConsentCreateResponse,
    ConsentStatusResponse
)

logger = logging.getLogger("medisync.abdm.consent")

# Active Consent Store
STORED_CONSENTS: Dict[str, Dict[str, Any]] = {
    "CR-ABDM-2026-9041": {
        "status": "GRANTED",
        "patient_id": "d0000000-0000-0000-0000-000000000001",
        "artefact_id": "ART-ABDM-2026-104992",
        "granted_at": "2026-10-04T10:30:00Z",
        "purpose": "CAREMGT",
        "expiry_date": "2026-11-04T00:00:00Z"
    },
    "CR-ABDM-2026-9042": {
        "status": "CONSENT_PENDING",
        "patient_id": "d0000000-0000-0000-0000-000000000002",
        "artefact_id": None,
        "granted_at": None,
        "purpose": "CAREMGT",
        "expiry_date": "2026-10-16T00:00:00Z"
    }
}


class ABDMConsentService:
    """Milestone 3 HIU Consent Management Service"""

    async def create_consent_request(self, req: ConsentCreateRequest) -> ConsentCreateResponse:
        """
        Creates an ABDM Consent Request (/v0.5/consent-requests/init).
        Notifies patient's ABHA app (e.g. ABHA App / Aarogya Setu) for approval.
        """
        request_id = str(uuid.uuid4())
        consent_request_id = f"CR-ABDM-2026-{uuid.uuid4().int % 9000 + 1000}"

        payload = {
            "requestId": request_id,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "consent": {
                "purpose": {
                    "text": "Care Management and Consultation",
                    "code": req.purpose_code,
                    "refUri": "https://abdm.gov.in"
                },
                "patient": {
                    "id": req.patient_abha_address
                },
                "hiu": {
                    "id": "MEDISYNC_HOSPITAL_HIU_01"
                },
                "requester": {
                    "name": "Dr. Rajesh Sharma, MD",
                    "identifier": {
                        "type": "REGNO",
                        "value": "MCI-48921-A",
                        "system": "https://www.nmc.org.in"
                    }
                },
                "hiTypes": req.hi_types,
                "permission": {
                    "accessMode": "VIEW",
                    "dateRange": {
                        "from": req.date_range_from,
                        "to": req.date_range_to
                    },
                    "dataEraseAt": req.expiry_date,
                    "frequency": {
                        "unit": "HOUR",
                        "value": 1,
                        "repeats": 0
                    }
                }
            }
        }

        await abdm_client.post("v0.5/consent-requests/init", payload, request_id)

        STORED_CONSENTS[consent_request_id] = {
            "status": "CONSENT_PENDING",
            "patient_id": req.patient_id,
            "abha_address": req.patient_abha_address,
            "purpose": req.purpose_code,
            "hi_types": req.hi_types,
            "date_range": [req.date_range_from, req.date_range_to],
            "expiry_date": req.expiry_date,
            "requested_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "artefact_id": None
        }

        return ConsentCreateResponse(
            consent_request_id=consent_request_id,
            status="CONSENT_PENDING",
            requested_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            message=f"ABDM consent request dispatched to {req.patient_abha_address}. Patient can approve or deny in their ABHA app."
        )

    async def get_consent_status(self, consent_request_id: str) -> ConsentStatusResponse:
        """
        Polls or resolves the status of a consent request.
        """
        consent = STORED_CONSENTS.get(consent_request_id)
        if not consent:
            raise ABDMValidationError(f"Consent request ID {consent_request_id} not found.")

        return ConsentStatusResponse(
            consent_request_id=consent_request_id,
            status=consent["status"],
            artefact_id=consent.get("artefact_id"),
            granted_at=consent.get("granted_at"),
            revoked_at=consent.get("revoked_at"),
            message=f"Consent status: {consent['status']}"
        )

    async def grant_simulation_consent(self, consent_request_id: str) -> ConsentStatusResponse:
        """
        For Sandbox demonstration: Simulates patient approving the consent on their personal ABHA mobile app.
        """
        consent = STORED_CONSENTS.get(consent_request_id)
        if not consent:
            raise ABDMValidationError(f"Consent request ID {consent_request_id} not found.")

        artefact_id = f"ART-ABDM-2026-{uuid.uuid4().hex[:8].upper()}"
        now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()

        consent["status"] = "GRANTED"
        consent["artefact_id"] = artefact_id
        consent["granted_at"] = now_str

        return ConsentStatusResponse(
            consent_request_id=consent_request_id,
            status="GRANTED",
            artefact_id=artefact_id,
            granted_at=now_str,
            message="Consent granted by patient via ABHA. Health information query is now authorized."
        )

    async def revoke_consent(self, consent_request_id: str) -> ConsentStatusResponse:
        """
        Patient revokes an active consent.
        """
        consent = STORED_CONSENTS.get(consent_request_id)
        if not consent:
            raise ABDMValidationError(f"Consent request ID {consent_request_id} not found.")

        now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
        consent["status"] = "REVOKED"
        consent["revoked_at"] = now_str

        return ConsentStatusResponse(
            consent_request_id=consent_request_id,
            status="REVOKED",
            artefact_id=consent.get("artefact_id"),
            revoked_at=now_str,
            message="Consent successfully revoked by patient. Future external data queries halted."
        )


consent_service = ABDMConsentService()
