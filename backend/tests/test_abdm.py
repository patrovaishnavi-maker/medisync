"""
Automated Integration Tests for MediSync ABDM Service and AI Summaries
Tests M1, M2, M3 workflows and AI Clinical Engine
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "HEALTHY"


@pytest.mark.asyncio
async def test_abdm_integration_status():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/abdm/status")
        assert res.status_code == 200
        data = res.json()
        assert data["milestone_m1_active"] is True
        assert data["milestone_m2_active"] is True
        assert data["milestone_m3_active"] is True


@pytest.mark.asyncio
async def test_m1_existing_abha_verification():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Step 1: Initiate
        init_res = await client.post("/api/abdm/m1/verify/initiate", json={
            "patient_id": "test-pat-001",
            "abha_identifier": "rohan.verma@abdm",
            "auth_mode": "AADHAAR_OTP"
        })
        assert init_res.status_code == 200
        init_data = init_res.json()
        assert "txn_id" in init_data
        assert init_data["status"] == "OTP_DISPATCHED"

        txn_id = init_data["txn_id"]

        # Step 2: Confirm OTP
        confirm_res = await client.post("/api/abdm/m1/verify/confirm", json={
            "patient_id": "test-pat-001",
            "txn_id": txn_id,
            "otp": "123456"
        })
        assert confirm_res.status_code == 200
        confirm_data = confirm_res.json()
        assert confirm_data["status"] == "VERIFIED"
        assert confirm_data["profile"]["abha_address"] == "rohan.verma@abdm"


@pytest.mark.asyncio
async def test_m2_care_context_linking():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Step 1: Discover
        disc_res = await client.post("/api/abdm/m2/contexts/discover", json={
            "patient_id": "test-pat-001",
            "abha_address": "rohan.verma@abdm"
        })
        assert disc_res.status_code == 200
        disc_data = disc_res.json()
        assert len(disc_data["matched_contexts"]) > 0

        # Step 2: Initiate Link
        link_init = await client.post("/api/abdm/m2/link/initiate", json={
            "patient_id": "test-pat-001",
            "abha_address": "rohan.verma@abdm",
            "care_context_ids": ["CC-MS-ENC-00101", "CC-MS-RX-0044"]
        })
        assert link_init.status_code == 200
        init_data = link_init.json()
        txn_id = init_data["txn_id"]

        # Step 3: Confirm Link
        link_confirm = await client.post("/api/abdm/m2/link/confirm", json={
            "patient_id": "test-pat-001",
            "txn_id": txn_id,
            "token_or_otp": "123456"
        })
        assert link_confirm.status_code == 200
        confirm_data = link_confirm.json()
        assert confirm_data["status"] == "LINKED"
        assert len(confirm_data["linked_contexts"]) == 2


@pytest.mark.asyncio
async def test_m3_consent_and_record_exchange():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Step 1: Create Consent Request
        req_res = await client.post("/api/abdm/m3/consent/request", json={
            "patient_id": "test-pat-001",
            "patient_abha_address": "rohan.verma@abdm",
            "purpose_code": "CAREMGT",
            "hi_types": ["Prescription", "DiagnosticReport"],
            "date_range_from": "2025-01-01",
            "date_range_to": "2026-10-09",
            "expiry_date": "2026-11-09"
        })
        assert req_res.status_code == 200
        req_data = req_res.json()
        consent_id = req_data["consent_request_id"]

        # Step 2: Check status
        status_res = await client.get(f"/api/abdm/m3/consent/status/{consent_id}")
        assert status_res.status_code == 200
        assert status_res.json()["status"] == "CONSENT_PENDING"

        # Step 3: Simulate Patient Approval
        grant_res = await client.post(f"/api/abdm/m3/consent/simulate-grant/{consent_id}")
        assert grant_res.status_code == 200
        grant_data = grant_res.json()
        assert grant_data["status"] == "GRANTED"
        artefact_id = grant_data["artefact_id"]

        # Step 4: Fetch External Records
        fetch_res = await client.post("/api/abdm/m3/records/fetch", json={
            "patient_id": "test-pat-001",
            "consent_artefact_id": artefact_id
        })
        assert fetch_res.status_code == 200
        fetch_data = fetch_res.json()
        assert fetch_data["status"] == "FETCH_COMPLETED"
        assert fetch_data["records_count"] >= 2


@pytest.mark.asyncio
async def test_ai_clinical_summary():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        ai_res = await client.post("/api/ai/summarize", json={
            "patient_id": "test-pat-001",
            "requester_role": "doctor",
            "clinical_records": [
                {
                    "record_id": "REC-01",
                    "record_type": "Encounter",
                    "date": "2026-10-01",
                    "facility": "MediSync Apex Hospital",
                    "summary": "Cardiology OP Consultation for Hypertension. Blood Pressure 142/88 mmHg. Prescribed Telmisartan 40mg."
                },
                {
                    "record_id": "REC-02",
                    "record_type": "Diagnostic",
                    "date": "2026-10-02",
                    "facility": "MediSync Apex Hospital",
                    "summary": "Lipid Profile shows Total Cholesterol 218 mg/dL (HIGH), LDL 136 mg/dL (HIGH)."
                }
            ]
        })
        assert ai_res.status_code == 200
        data = ai_res.json()
        assert data["is_ai_generated"] is True
        assert len(data["citations"]) == 2
        assert len(data["active_medications"]) >= 1
        assert "disclaimer" in data
