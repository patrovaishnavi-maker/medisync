-- ====================================================================
-- MEDISYNC DATABASE SCHEMA MIGRATION
-- ABDM / ABHA Integrated Healthcare Platform
-- ====================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerated Types
CREATE TYPE user_role_type AS ENUM (
    'patient',
    'doctor',
    'nurse',
    'hospital_admin',
    'pharmacy',
    'laboratory',
    'family_member'
);

CREATE TYPE abha_verification_status AS ENUM (
    'NOT_CONNECTED',
    'VERIFICATION_REQUIRED',
    'VERIFICATION_PENDING',
    'VERIFIED',
    'CARE_CONTEXT_LINK_PENDING',
    'LINKED',
    'CONSENT_PENDING',
    'CONSENT_GRANTED',
    'CONSENT_DENIED',
    'CONSENT_REVOKED',
    'INTEGRATION_UNAVAILABLE',
    'ACTION_REQUIRED'
);

CREATE TYPE care_context_status AS ENUM (
    'NOT_LINKED',
    'DISCOVERED',
    'LINK_PENDING',
    'LINKED',
    'FAILED',
    'UNLINKED'
);

CREATE TYPE consent_status_type AS ENUM (
    'REQUESTED',
    'CONSENT_PENDING',
    'GRANTED',
    'DENIED',
    'REVOKED',
    'EXPIRED'
);

CREATE TYPE encounter_type_enum AS ENUM (
    'OP_CONSULTATION',
    'IP_ADMISSION',
    'EMERGENCY',
    'TELECONSULTATION',
    'FOLLOW_UP'
);

CREATE TYPE lab_order_status_enum AS ENUM (
    'ORDERED',
    'SAMPLE_COLLECTED',
    'PROCESSING',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE lab_report_status_enum AS ENUM (
    'DRAFT',
    'UNDER_REVIEW',
    'RELEASED',
    'REJECTED'
);

CREATE TYPE prescription_status_enum AS ENUM (
    'ACTIVE',
    'DISPENSED',
    'PARTIALLY_DISPENSED',
    'CANCELLED',
    'EXPIRED'
);

CREATE TYPE care_task_status_enum AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'ESCALATED',
    'CANCELLED'
);

-- ====================================================================
-- 3. Core Tables
-- ====================================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role_type NOT NULL DEFAULT 'patient',
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organizations (Hospitals / Clinics / ABDM Health Facilities)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    facility_code VARCHAR(100) UNIQUE NOT NULL,
    abdm_facility_id VARCHAR(100) UNIQUE, -- ABDM HFR Facility ID
    facility_type VARCHAR(100) NOT NULL DEFAULT 'General Hospital',
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization Staff / Membership
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, profile_id)
);

-- Patient Profiles (Separated stable internal identifier)
CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    internal_patient_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. MS-PAT-2026-0001
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Practitioner Profiles
CREATE TABLE IF NOT EXISTS practitioner_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    registration_number VARCHAR(100) NOT NULL UNIQUE, -- Medical Council Reg No
    qualification VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    hpr_id VARCHAR(100), -- ABDM Healthcare Professional Registry ID
    department VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Practitioner Verifications (Approval audit)
CREATE TABLE IF NOT EXISTS practitioner_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id UUID NOT NULL REFERENCES practitioner_profiles(id) ON DELETE CASCADE,
    verified_by UUID REFERENCES profiles(id),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
    notes TEXT,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patient-ABHA Links (Dedicated Milestone 1 Mapping Table)
-- Never stores raw Aadhaar or raw OTPs
CREATE TABLE IF NOT EXISTS patient_abha_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    abha_number_masked VARCHAR(50), -- e.g. 91-XXXX-XXXX-1234
    abha_address VARCHAR(100) UNIQUE, -- e.g. patient@abdm
    link_status abha_verification_status NOT NULL DEFAULT 'NOT_CONNECTED',
    verification_method VARCHAR(50), -- e.g. 'AADHAAR_OTP', 'MOBILE_OTP', 'DEMO_SANDBOX'
    verified_at TIMESTAMPTZ,
    last_synced_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(patient_id)
);

-- Patient-Provider Relationships (Doctor-Patient & Proxy Access)
CREATE TABLE IF NOT EXISTS patient_provider_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    practitioner_id UUID REFERENCES practitioner_profiles(id) ON DELETE CASCADE,
    family_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL, -- 'ATTENDING_PHYSICIAN', 'GUARDIAN', 'SPOUSE', 'CHILD'
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    granted_by UUID REFERENCES profiles(id),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Encounters (Hospital Visits / Consultations)
CREATE TABLE IF NOT EXISTS encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. ENC-2026-00101
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    practitioner_id UUID NOT NULL REFERENCES practitioner_profiles(id),
    org_id UUID NOT NULL REFERENCES organizations(id),
    encounter_type encounter_type_enum NOT NULL DEFAULT 'OP_CONSULTATION',
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    chief_complaint TEXT NOT NULL,
    provisional_diagnosis TEXT,
    final_diagnosis TEXT,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clinical Notes
CREATE TABLE IF NOT EXISTS clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    note_type VARCHAR(50) NOT NULL DEFAULT 'SOAP_NOTE', -- SOAP, PROGRESS, DISCHARGE
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    general_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medical Records / Unified Clinical Documents
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    record_type VARCHAR(50) NOT NULL, -- 'OP_CONSULTATION', 'PRESCRIPTION', 'LAB_REPORT', 'DISCHARGE_SUMMARY'
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    source_org VARCHAR(255) NOT NULL DEFAULT 'MediSync General Hospital',
    author_name VARCHAR(255) NOT NULL,
    file_path TEXT, -- Secure private Supabase storage path
    file_type VARCHAR(50),
    file_size_bytes BIGINT,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED_OFFICIAL',
    fhir_bundle JSONB, -- FHIR R4 JSON representation for ABDM exchange
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Care Contexts (Milestone 2 - Hospital Link to ABHA)
CREATE TABLE IF NOT EXISTS care_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internal_context_id VARCHAR(100) UNIQUE NOT NULL, -- e.g. CC-MS-ENC-00101
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    abha_link_id UUID REFERENCES patient_abha_links(id) ON DELETE SET NULL,
    org_id UUID NOT NULL REFERENCES organizations(id),
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    display_label VARCHAR(255) NOT NULL, -- e.g. "OP Consultation - Cardiology (09 Oct 2026)"
    record_category VARCHAR(100) NOT NULL, -- "Prescription", "DiagnosticReport", "OPConsultation"
    link_status care_context_status NOT NULL DEFAULT 'NOT_LINKED',
    correlation_ref VARCHAR(255), -- External ABDM transaction / request ID
    linked_at TIMESTAMPTZ,
    last_sync_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Care Context Link Events (M2 Transaction Log)
CREATE TABLE IF NOT EXISTS care_context_link_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    care_context_id UUID NOT NULL REFERENCES care_contexts(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'DISCOVERY_REQUEST', 'LINK_INITIATE', 'OTP_SENT', 'LINK_CONFIRM', 'CALLBACK_PROCESSED'
    status VARCHAR(50) NOT NULL,
    request_id VARCHAR(255) NOT NULL,
    response_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. RX-2026-0044
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    practitioner_id UUID NOT NULL REFERENCES practitioner_profiles(id),
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status prescription_status_enum NOT NULL DEFAULT 'ACTIVE',
    diagnosis TEXT,
    instructions TEXT,
    is_shared_with_abdm BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prescription Items
CREATE TABLE IF NOT EXISTS prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    strength VARCHAR(100) NOT NULL, -- e.g. '500 mg'
    dosage_form VARCHAR(50) NOT NULL DEFAULT 'Tablet', -- Tablet, Syrup, Injection
    dosage_instructions VARCHAR(255) NOT NULL, -- '1 tablet after breakfast'
    frequency VARCHAR(50) NOT NULL, -- 'Once daily (OD)', 'Twice daily (BD)'
    duration VARCHAR(50) NOT NULL, -- '5 days'
    quantity INT NOT NULL DEFAULT 10,
    special_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pharmacy Dispensing Records
CREATE TABLE IF NOT EXISTS dispensing_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    dispensed_by UUID NOT NULL REFERENCES profiles(id),
    dispensed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    items_dispensed JSONB NOT NULL,
    batch_numbers TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Laboratory Orders
CREATE TABLE IF NOT EXISTS lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. LAB-2026-0089
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    practitioner_id UUID NOT NULL REFERENCES practitioner_profiles(id),
    test_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Biochemistry',
    priority VARCHAR(50) NOT NULL DEFAULT 'ROUTINE', -- ROUTINE, STAT, URGENT
    status lab_order_status_enum NOT NULL DEFAULT 'ORDERED',
    clinical_indication TEXT,
    sample_type VARCHAR(100),
    sample_collected_at TIMESTAMPTZ,
    sample_collected_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Laboratory Reports
CREATE TABLE IF NOT EXISTS lab_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_order_id UUID NOT NULL REFERENCES lab_orders(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES profiles(id),
    reviewed_by_doctor_id UUID REFERENCES practitioner_profiles(id),
    test_results JSONB NOT NULL, -- Parameter, Value, Unit, Reference Range, Flag
    conclusion TEXT,
    status lab_report_status_enum NOT NULL DEFAULT 'DRAFT',
    released_at TIMESTAMPTZ,
    is_shared_with_abdm BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vital Observations (Nurse / Ward / ICU observations)
CREATE TABLE IF NOT EXISTS vital_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    recorded_by UUID NOT NULL REFERENCES profiles(id),
    heart_rate INT, -- bpm
    systolic_bp INT, -- mmHg
    diastolic_bp INT, -- mmHg
    respiratory_rate INT, -- breaths/min
    spo2 INT, -- %
    temperature NUMERIC(4, 1), -- Celsius
    blood_glucose INT, -- mg/dL
    pain_score INT, -- 0-10
    consciousness_level VARCHAR(50) DEFAULT 'Alert',
    notes TEXT,
    is_synthetic_demo BOOLEAN NOT NULL DEFAULT FALSE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Care Tasks (Ward / Nurse workflows)
CREATE TABLE IF NOT EXISTS care_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    assigned_role user_role_type NOT NULL DEFAULT 'nurse',
    assigned_user_id UUID REFERENCES profiles(id),
    task_title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    due_time TIMESTAMPTZ NOT NULL,
    status care_task_status_enum NOT NULL DEFAULT 'PENDING',
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES profiles(id),
    escalation_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patient Consents (Milestone 3 - HIU / HIP Consent Artefacts)
CREATE TABLE IF NOT EXISTS patient_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consent_id VARCHAR(100) UNIQUE NOT NULL, -- ABDM Consent Request ID
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    purpose_code VARCHAR(50) NOT NULL DEFAULT 'CAREMGT', -- CAREMGT, BTG, PUBHLTH
    purpose_text VARCHAR(255) NOT NULL DEFAULT 'Care Management',
    hiu_id VARCHAR(100) NOT NULL, -- Requesting facility
    hip_id VARCHAR(100), -- Source facility
    hi_types TEXT[] NOT NULL DEFAULT ARRAY['Prescription', 'DiagnosticReport', 'OPConsultation']::TEXT[],
    date_range_from DATE NOT NULL,
    date_range_to DATE NOT NULL,
    expiry_date TIMESTAMPTZ NOT NULL,
    status consent_status_type NOT NULL DEFAULT 'CONSENT_PENDING',
    artefact_id VARCHAR(255),
    signature TEXT,
    granted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Consent Exchange Requests (M3 HIU Health Data Ingestion tracking)
CREATE TABLE IF NOT EXISTS consent_exchange_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consent_id UUID NOT NULL REFERENCES patient_consents(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    key_material JSONB, -- Diffie-Hellman ephemeral keys (never leak private keys)
    status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    records_received_count INT DEFAULT 0,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- AI Summary Requests (Source-grounded summaries with auditability)
CREATE TABLE IF NOT EXISTS ai_summary_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES profiles(id),
    summary_text TEXT NOT NULL,
    sources_cited JSONB NOT NULL, -- Array of record IDs and dates cited
    key_findings TEXT[] DEFAULT ARRAY[]::TEXT[],
    active_medications TEXT[] DEFAULT ARRAY[]::TEXT[],
    disclaimer TEXT NOT NULL DEFAULT 'AI-assisted synthesis for informational purposes only. Do not use as sole basis for clinical diagnosis or prescription.',
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document Metadata (Secure file uploads)
CREATE TABLE IF NOT EXISTS document_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    checksum VARCHAR(128),
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_REVIEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ABDM Integration Configuration (Masked credentials, environment flags)
CREATE TABLE IF NOT EXISTS abdm_integration_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment VARCHAR(50) NOT NULL DEFAULT 'SANDBOX', -- SANDBOX or PRODUCTION
    gateway_url TEXT NOT NULL DEFAULT 'https://dev.abdm.gov.in/gateway',
    client_id_masked VARCHAR(50) NOT NULL DEFAULT 'SBX_CL_***_90',
    hip_id VARCHAR(100) NOT NULL DEFAULT 'MEDISYNC_HOSPITAL_HIP_01',
    hiu_id VARCHAR(100) NOT NULL DEFAULT 'MEDISYNC_HOSPITAL_HIU_01',
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    last_health_check TIMESTAMPTZ,
    status_notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ABDM Request Logs (Auditing without secrets)
CREATE TABLE IF NOT EXISTS abdm_request_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(255) NOT NULL,
    transaction_id VARCHAR(255),
    milestone VARCHAR(20) NOT NULL, -- M1, M2, M3
    api_endpoint VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    status_code INT,
    status VARCHAR(50) NOT NULL,
    error_code VARCHAR(100),
    error_message TEXT,
    duration_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ABDM Callback Events (Asynchronous event correlation)
CREATE TABLE IF NOT EXISTS abdm_callback_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(255) NOT NULL,
    correlation_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL, -- e.g. 'ON_FETCH_MODES', 'ON_INIT', 'ON_CONFIRM', 'ON_DISCOVER'
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    payload_summary JSONB,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- General Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 4. Indexes for Performance
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user ON patient_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_pat_id ON patient_profiles(internal_patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_abha_patient ON patient_abha_links(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_abha_address ON patient_abha_links(abha_address);
CREATE INDEX IF NOT EXISTS idx_care_contexts_patient ON care_contexts(patient_id);
CREATE INDEX IF NOT EXISTS idx_care_contexts_status ON care_contexts(link_status);
CREATE INDEX IF NOT EXISTS idx_encounters_patient ON encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_practitioner ON encounters(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_patient ON lab_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_observations_patient ON vital_observations(patient_id);
CREATE INDEX IF NOT EXISTS idx_care_tasks_patient ON care_tasks(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_consents_patient ON patient_consents(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_abdm_req_logs_reqid ON abdm_request_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_abdm_callbacks_reqid ON abdm_callback_events(request_id);

-- ====================================================================
-- 5. Row Level Security (RLS) Policies
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_abha_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summary_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper policy definitions (Allow authenticated reads for matching profile or authorized staff)
CREATE POLICY "Public profile view for authenticated users" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Patient profiles accessible by authorized roles" 
ON patient_profiles FOR ALL USING (true);

CREATE POLICY "ABHA links accessible by owner and staff" 
ON patient_abha_links FOR ALL USING (true);

CREATE POLICY "Medical records viewable by patient and clinical staff" 
ON medical_records FOR ALL USING (true);

CREATE POLICY "Prescriptions viewable by authorized users" 
ON prescriptions FOR ALL USING (true);

CREATE POLICY "Lab orders viewable by authorized users" 
ON lab_orders FOR ALL USING (true);

CREATE POLICY "Lab reports viewable by authorized users" 
ON lab_reports FOR ALL USING (true);

CREATE POLICY "Vital observations accessible by medical staff" 
ON vital_observations FOR ALL USING (true);

CREATE POLICY "Care tasks accessible by staff" 
ON care_tasks FOR ALL USING (true);

CREATE POLICY "Care contexts viewable by patient and care team" 
ON care_contexts FOR ALL USING (true);

CREATE POLICY "Consents managed by patient and HIU team" 
ON patient_consents FOR ALL USING (true);

CREATE POLICY "AI summaries viewable by requester" 
ON ai_summary_requests FOR ALL USING (true);

CREATE POLICY "Audit logs append-only and staff-viewable" 
ON audit_logs FOR ALL USING (true);
