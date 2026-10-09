"""
Pydantic Request & Response Schemas for ABDM v0.5 Integration
Strict validation adhering to National Health Authority (NHA) specifications.
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import date, datetime


# ====================================================================
# Gateway Authentication & Status
# ====================================================================
class SessionResponse(BaseModel):
    access_token: str
    expires_in: int
    token_type: str = "Bearer"


class IntegrationStatusResponse(BaseModel):
    environment: str
    is_configured: bool
    gateway_url: str
    hip_id: str
    hiu_id: str
    milestone_m1_active: bool
    milestone_m2_active: bool
    milestone_m3_active: bool
    mode_label: str  # "Live Sandbox" or "Simulation / Mock Fallback"
    notice: str


# ====================================================================
# Milestone 1: Identity Creation & Verification Schemas
# ====================================================================
class VerifyAbhaInitiateRequest(BaseModel):
    patient_id: str = Field(..., description="MediSync internal patient UUID")
    abha_identifier: str = Field(..., description="14-digit ABHA Number or ABHA Address (e.g. user@abdm)")
    auth_mode: str = Field(default="AADHAAR_OTP", description="AADHAAR_OTP, MOBILE_OTP, or DEMO_AUTH")


class VerifyAbhaInitiateResponse(BaseModel):
    request_id: str
    txn_id: str
    auth_mode: str
    status: str
    message: str
    is_sandbox_simulation: bool = False


class VerifyAbhaConfirmRequest(BaseModel):
    patient_id: str
    txn_id: str
    otp: str = Field(..., min_length=4, max_length=6, description="Received OTP")


class AbhaIdentityProfile(BaseModel):
    abha_number: str
    abha_address: str
    full_name: str
    gender: str
    dob: str
    phone_masked: Optional[str] = None
    address: Optional[str] = None
    verification_status: str
    verified_at: str
    is_demo_identity: bool = False


class VerifyAbhaConfirmResponse(BaseModel):
    status: str
    message: str
    patient_id: str
    profile: Optional[AbhaIdentityProfile] = None
    link_token: Optional[str] = None


class CreateAbhaInitiateRequest(BaseModel):
    patient_id: str
    id_type: str = Field(default="AADHAAR", description="AADHAAR or MOBILE")
    id_value: str = Field(..., description="Synthetic test ID or Aadhaar for sandbox")
    consent_confirmed: bool = Field(..., description="Explicit patient consent acknowledgement")


class CreateAbhaInitiateResponse(BaseModel):
    request_id: str
    txn_id: str
    status: str
    message: str


class CreateAbhaConfirmRequest(BaseModel):
    patient_id: str
    txn_id: str
    otp: str
    desired_abha_address: str = Field(..., description="e.g. rohan.care@abdm")


# ====================================================================
# Milestone 2: HIP Care Context Linking Schemas
# ====================================================================
class CareContextReference(BaseModel):
    care_context_reference: str
    display: str
    record_category: str
    date: str


class DiscoverContextsRequest(BaseModel):
    patient_id: str
    abha_address: str


class DiscoverContextsResponse(BaseModel):
    patient_reference: str
    matched_contexts: List[CareContextReference]


class InitiateLinkRequest(BaseModel):
    patient_id: str
    abha_address: str
    care_context_ids: List[str]


class InitiateLinkResponse(BaseModel):
    request_id: str
    txn_id: str
    status: str
    message: str
    communication_medium: str = "MOBILE_SMS"


class ConfirmLinkRequest(BaseModel):
    patient_id: str
    txn_id: str
    token_or_otp: str


class ConfirmLinkResponse(BaseModel):
    status: str
    message: str
    linked_contexts: List[str]
    linked_at: str


# ====================================================================
# Milestone 3: HIU Consent & Health Information Exchange
# ====================================================================
class ConsentCreateRequest(BaseModel):
    patient_id: str
    patient_abha_address: str
    purpose_code: str = Field(default="CAREMGT", description="CAREMGT, BTG, or PUBHLTH")
    hi_types: List[str] = Field(default=["Prescription", "DiagnosticReport", "OPConsultation"])
    date_range_from: str
    date_range_to: str
    expiry_date: str


class ConsentCreateResponse(BaseModel):
    consent_request_id: str
    status: str
    requested_at: str
    message: str


class ConsentStatusResponse(BaseModel):
    consent_request_id: str
    status: str  # REQUESTED, GRANTED, DENIED, REVOKED, EXPIRED
    artefact_id: Optional[str] = None
    granted_at: Optional[str] = None
    revoked_at: Optional[str] = None
    message: str


class HealthDataFetchRequest(BaseModel):
    consent_artefact_id: str
    patient_id: str


class ExtractedHealthRecord(BaseModel):
    record_id: str
    record_type: str
    source_facility: str
    record_date: str
    clinical_summary: str
    fhir_type: str
    provenance: str


class HealthDataFetchResponse(BaseModel):
    transaction_id: str
    status: str
    records_count: int
    records: List[ExtractedHealthRecord]


# ====================================================================
# Callback & Webhook Schemas
# ====================================================================
class ABDMError(BaseModel):
    code: int
    message: str


class ABDMCallbackPayload(BaseModel):
    request_id: str
    timestamp: str
    error: Optional[ABDMError] = None
    resp: Optional[Dict[str, Any]] = None
    auth: Optional[Dict[str, Any]] = None
    acknowledgement: Optional[Dict[str, Any]] = None
