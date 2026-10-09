"""
FastAPI Router for ABDM Ecosystem Endpoints
Exposes Milestones M1, M2, M3 APIs and NHA Gateway Webhook Handlers.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from ..services.abdm.config import abdm_settings
from ..services.abdm.schemas import (
    IntegrationStatusResponse,
    VerifyAbhaInitiateRequest,
    VerifyAbhaInitiateResponse,
    VerifyAbhaConfirmRequest,
    VerifyAbhaConfirmResponse,
    CreateAbhaInitiateRequest,
    CreateAbhaInitiateResponse,
    CreateAbhaConfirmRequest,
    DiscoverContextsRequest,
    DiscoverContextsResponse,
    InitiateLinkRequest,
    InitiateLinkResponse,
    ConfirmLinkRequest,
    ConfirmLinkResponse,
    ConsentCreateRequest,
    ConsentCreateResponse,
    ConsentStatusResponse,
    HealthDataFetchRequest,
    HealthDataFetchResponse,
    ABDMCallbackPayload
)
from ..services.abdm.identity import identity_service
from ..services.abdm.care_contexts import care_context_service
from ..services.abdm.consent import consent_service
from ..services.abdm.health_information import health_information_service
from ..services.abdm.callbacks import callback_manager
from ..services.abdm.exceptions import ABDMException, ABDMValidationError

router = APIRouter(prefix="/api/abdm", tags=["ABDM Integration"])


# --------------------------------------------------------------------
# Status & Integration Diagnostics
# --------------------------------------------------------------------
@router.get("/status", response_model=IntegrationStatusResponse)
async def get_integration_status():
    """Returns current ABDM integration state, active milestones, and sandbox diagnostics"""
    is_live_configured = (
        bool(abdm_settings.ABDM_CLIENT_ID)
        and "DEMO" not in abdm_settings.ABDM_CLIENT_ID
        and bool(abdm_settings.ABDM_CLIENT_SECRET)
    )

    return IntegrationStatusResponse(
        environment=abdm_settings.ABDM_ENVIRONMENT,
        is_configured=is_live_configured,
        gateway_url=abdm_settings.ABDM_BASE_URL,
        hip_id=abdm_settings.ABDM_HIP_ID,
        hiu_id=abdm_settings.ABDM_HIU_ID,
        milestone_m1_active=True,
        milestone_m2_active=True,
        milestone_m3_active=True,
        mode_label="Live Sandbox" if is_live_configured else "Sandbox Simulation / Mock Fallback",
        notice="ABDM v0.5 Adapter active. Mock fallback enabled for demonstration."
    )


# --------------------------------------------------------------------
# Milestone 1: Identity Endpoints
# --------------------------------------------------------------------
@router.post("/m1/verify/initiate", response_model=VerifyAbhaInitiateResponse)
async def verify_existing_abha_init(req: VerifyAbhaInitiateRequest):
    try:
        return await identity_service.verify_existing_abha(req)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


@router.post("/m1/verify/confirm", response_model=VerifyAbhaConfirmResponse)
async def verify_existing_abha_confirm(req: VerifyAbhaConfirmRequest):
    try:
        return await identity_service.confirm_existing_abha_verification(req)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


@router.post("/m1/create/initiate", response_model=CreateAbhaInitiateResponse)
async def create_abha_init(req: CreateAbhaInitiateRequest):
    try:
        return await identity_service.initiate_abha_creation(req)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


@router.post("/m1/create/confirm", response_model=VerifyAbhaConfirmResponse)
async def create_abha_confirm(req: CreateAbhaConfirmRequest):
    try:
        return await identity_service.complete_abha_creation(req)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


# --------------------------------------------------------------------
# Milestone 2: Care Contexts Endpoints (HIP)
# --------------------------------------------------------------------
@router.post("/m2/contexts/discover", response_model=DiscoverContextsResponse)
async def discover_care_contexts(req: DiscoverContextsRequest):
    try:
        return await care_context_service.discover_contexts(req)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


@router.post("/m2/link/initiate", response_model=InitiateLinkResponse)
async def initiate_care_context_link(req: InitiateLinkRequest):
    try:
        return await care_context_service.initiate_link(req)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


@router.post("/m2/link/confirm", response_model=ConfirmLinkResponse)
async def confirm_care_context_link(req: ConfirmLinkRequest):
    try:
        return await care_context_service.confirm_link(req)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


# --------------------------------------------------------------------
# Milestone 3: Consent & Exchange Endpoints (HIU)
# --------------------------------------------------------------------
@router.post("/m3/consent/request", response_model=ConsentCreateResponse)
async def request_consent(req: ConsentCreateRequest):
    try:
        return await consent_service.create_consent_request(req)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


@router.get("/m3/consent/status/{consent_id}", response_model=ConsentStatusResponse)
async def get_consent_status(consent_id: str):
    try:
        return await consent_service.get_consent_status(consent_id)
    except ABDMException as e:
        raise HTTPException(status_code=404, detail={"code": e.code, "message": str(e)})


@router.post("/m3/consent/simulate-grant/{consent_id}", response_model=ConsentStatusResponse)
async def simulate_grant_consent(consent_id: str):
    """Sandbox demonstration endpoint: Simulates patient approving consent on their ABHA App"""
    try:
        return await consent_service.grant_simulation_consent(consent_id)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


@router.post("/m3/consent/revoke/{consent_id}", response_model=ConsentStatusResponse)
async def revoke_consent(consent_id: str):
    try:
        return await consent_service.revoke_consent(consent_id)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


@router.post("/m3/records/fetch", response_model=HealthDataFetchResponse)
async def fetch_consented_records(req: HealthDataFetchRequest):
    try:
        return await health_information_service.fetch_consented_records(req)
    except ABDMException as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": str(e)})


# --------------------------------------------------------------------
# Gateway Webhook Callback Endpoints (Asynchronous NHA responses)
# --------------------------------------------------------------------
callback_router = APIRouter(prefix="/v0.5", tags=["ABDM Gateway Callbacks"])


@callback_router.post("/users/auth/on-init")
async def callback_auth_on_init(payload: Dict[str, Any]):
    return await callback_manager.handle_incoming_callback("AUTH_ON_INIT", payload)


@callback_router.post("/links/link/on-init")
async def callback_link_on_init(payload: Dict[str, Any]):
    return await callback_manager.handle_incoming_callback("LINK_ON_INIT", payload)


@callback_router.post("/consent-requests/on-init")
async def callback_consent_on_init(payload: Dict[str, Any]):
    return await callback_manager.handle_incoming_callback("CONSENT_ON_INIT", payload)


@callback_router.get("/callbacks/recent")
async def get_recent_callbacks():
    return callback_manager.get_recent_callbacks()
