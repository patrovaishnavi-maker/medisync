-- ====================================================================
-- MEDISYNC SYNTHETIC HEALTHCARE SEED DATA
-- All identities and health records are synthetic demonstration data
-- ====================================================================

-- 1. Insert Hospital Facility
INSERT INTO organizations (
    id, name, facility_code, abdm_facility_id, facility_type,
    address, city, state, pincode, contact_phone, contact_email, is_verified
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'MediSync Apex Multi-Specialty Hospital',
    'FAC-MS-HYD-01',
    'IN3610001234',
    'Multi-Specialty Tertiary Hospital',
    'Plot 42, Health City, HITEC City',
    'Hyderabad',
    'Telangana',
    '500081',
    '+91-40-23456789',
    'operations@medisync-hospital.in',
    TRUE
) ON CONFLICT (facility_code) DO NOTHING;

-- 2. Insert User Profiles for Roles
-- Staff Profiles
INSERT INTO profiles (id, email, full_name, phone, role, is_active) VALUES
('b0000000-0000-0000-0000-000000000001', 'dr.sharma@medisync.in', 'Dr. Rajesh Sharma', '+91-9876543210', 'doctor', TRUE),
('b0000000-0000-0000-0000-000000000002', 'dr.priya@medisync.in', 'Dr. Priya Nambiar', '+91-9876543211', 'doctor', TRUE),
('b0000000-0000-0000-0000-000000000003', 'nurse.ananya@medisync.in', 'Staff Nurse Ananya Roy', '+91-9876543212', 'nurse', TRUE),
('b0000000-0000-0000-0000-000000000004', 'admin.vikram@medisync.in', 'Vikram Malhotra', '+91-9876543213', 'hospital_admin', TRUE),
('b0000000-0000-0000-0000-000000000005', 'pharma.farhan@medisync.in', 'Farhan Akhtar (Pharmacist)', '+91-9876543214', 'pharmacy', TRUE),
('b0000000-0000-0000-0000-000000000006', 'lab.sunita@medisync.in', 'Dr. Sunita Kulkarni (Lab Head)', '+91-9876543215', 'laboratory', TRUE),
('b0000000-0000-0000-0000-000000000007', 'family.sunita@example.in', 'Sunita Kumar (Guardian)', '+91-9876543216', 'family_member', TRUE),
('b0000000-0000-0000-0000-000000000010', 'rohan.verma@example.in', 'Rohan Verma', '+91-9876543220', 'patient', TRUE),
('b0000000-0000-0000-0000-000000000011', 'anita.desai@example.in', 'Anita Desai', '+91-9876543221', 'patient', TRUE),
('b0000000-0000-0000-0000-000000000012', 'meera.nair@example.in', 'Meera Nair', '+91-9876543222', 'patient', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Practitioner Details
INSERT INTO practitioner_profiles (
    id, profile_id, registration_number, qualification, specialization, hpr_id, department, experience_years
) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'MCI-48921-A', 'MBBS, MD (Cardiology)', 'Cardiology', 'dr.sharma@hpr.abdm', 'Cardiology & Heart Care', 14),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'MCI-52119-B', 'MBBS, MD (Pulmonology)', 'Pulmonology', 'dr.priya@hpr.abdm', 'Pulmonary Medicine', 9)
ON CONFLICT (registration_number) DO NOTHING;

-- 4. Patient Profiles
INSERT INTO patient_profiles (
    id, profile_id, internal_patient_id, full_name, dob, gender, blood_group, phone, email,
    address, allergies, chronic_conditions, emergency_contact_name, emergency_contact_phone, emergency_contact_relation
) VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000010',
    'MS-PAT-2026-0001',
    'Rohan Verma',
    '1992-04-15',
    'Male',
    'B+',
    '+91-9876543220',
    'rohan.verma@example.in',
    'Flat 302, Green Meadows, Madhapur, Hyderabad',
    ARRAY['Penicillin', 'Sulfa drugs']::TEXT[],
    ARRAY['Hypertension', 'Mild Dyslipidemia']::TEXT[],
    'Kavita Verma',
    '+91-9876543299',
    'Spouse'
),
(
    'd0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000011',
    'MS-PAT-2026-0002',
    'Anita Desai',
    '1984-11-28',
    'Female',
    'O+',
    '+91-9876543221',
    'anita.desai@example.in',
    'House 12, Lake View Colony, Banjara Hills, Hyderabad',
    ARRAY['Aspirin']::TEXT[],
    ARRAY['Type 2 Diabetes', 'Hypothyroidism']::TEXT[],
    'Sanjay Desai',
    '+91-9876543288',
    'Brother'
),
(
    'd0000000-0000-0000-0000-000000000003',
    NULL,
    'MS-PAT-2026-0003',
    'Aarav Sharma (Child)',
    '2018-08-10',
    'Male',
    'A+',
    '+91-9876543216',
    'family.sunita@example.in',
    'Tower 4, Sunshine Apts, Gachibowli, Hyderabad',
    ARRAY['Peanuts']::TEXT[],
    ARRAY['Allergic Rhinitis']::TEXT[],
    'Sunita Kumar',
    '+91-9876543216',
    'Mother'
),
(
    'd0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000012',
    'MS-PAT-2026-0004',
    'Meera Nair',
    '1966-02-03',
    'Female',
    'AB+',
    '+91-9876543222',
    'meera.nair@example.in',
    'Villa 9, Jubilee Ridge, Hyderabad',
    ARRAY[]::TEXT[],
    ARRAY['Osteoarthritis']::TEXT[],
    'Arjun Nair',
    '+91-9876543277',
    'Son'
)
ON CONFLICT (internal_patient_id) DO NOTHING;

-- 5. ABHA Identity Links (Milestone 1)
INSERT INTO patient_abha_links (
    id, patient_id, abha_number_masked, abha_address, link_status,
    verification_method, verified_at, last_synced_at
) VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    '91-4521-8932-1144',
    'rohan.verma@abdm',
    'LINKED',
    'AADHAAR_OTP',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '2 hours'
),
(
    'e0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002',
    '91-7890-1234-5678',
    'anita.desai@abdm',
    'CARE_CONTEXT_LINK_PENDING',
    'MOBILE_OTP',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
),
(
    'e0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000004',
    NULL,
    NULL,
    'NOT_CONNECTED',
    NULL,
    NULL,
    NULL
)
ON CONFLICT (patient_id) DO NOTHING;

-- 6. Encounters
INSERT INTO encounters (
    id, encounter_number, patient_id, practitioner_id, org_id,
    encounter_type, status, chief_complaint, provisional_diagnosis, final_diagnosis, start_time, end_time
) VALUES
(
    'f0000000-0000-0000-0000-000000000001',
    'ENC-2026-00101',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'OP_CONSULTATION',
    'COMPLETED',
    'Occasional chest tightness and shortness of breath upon exertion',
    'Essential Hypertension with Stage 1 Dyslipidemia',
    'Mild Exertional Angina, Well Controlled',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days' + INTERVAL '30 minutes'
),
(
    'f0000000-0000-0000-0000-000000000002',
    'ENC-2026-00102',
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'IP_ADMISSION',
    'IN_PROGRESS',
    'Persistent cough, fever spikes for 4 days, low pulse ox on room air',
    'Community-Acquired Lower Respiratory Tract Infection',
    'Bacterial Bronchopneumonia (Under Active Inpatient Therapy)',
    NOW() - INTERVAL '2 days',
    NULL
)
ON CONFLICT (encounter_number) DO NOTHING;

-- 7. Care Contexts (Milestone 2 HIP)
INSERT INTO care_contexts (
    id, internal_context_id, patient_id, abha_link_id, org_id, encounter_id,
    display_label, record_category, link_status, correlation_ref, linked_at
) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'CC-MS-ENC-00101',
    'd0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    'Cardiology OP Consultation (09 Oct 2026)',
    'OPConsultation',
    'LINKED',
    'ABDM-REQ-TXN-98214',
    NOW() - INTERVAL '9 days'
),
(
    '10000000-0000-0000-0000-000000000002',
    'CC-MS-RX-0044',
    'd0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    'Cardiology Prescription - Dr. Sharma',
    'Prescription',
    'LINKED',
    'ABDM-REQ-TXN-98215',
    NOW() - INTERVAL '9 days'
),
(
    '10000000-0000-0000-0000-000000000003',
    'CC-MS-ENC-00102',
    'd0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000002',
    'Pulmonology Ward Admission (07 Oct 2026)',
    'DischargeSummary',
    'LINK_PENDING',
    'ABDM-REQ-TXN-99104',
    NULL
)
ON CONFLICT (internal_context_id) DO NOTHING;

-- 8. Prescriptions & Prescription Items
INSERT INTO prescriptions (
    id, prescription_number, encounter_id, patient_id, practitioner_id,
    issue_date, status, diagnosis, instructions, is_shared_with_abdm
) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    'RX-2026-0044',
    'f0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    CURRENT_DATE - INTERVAL '10 days',
    'DISPENSED',
    'Hypertension & Dyslipidemia',
    'Take with food. Regular monitoring of blood pressure recommended.',
    TRUE
),
(
    '20000000-0000-0000-0000-000000000002',
    'RX-2026-0045',
    'f0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002',
    CURRENT_DATE - INTERVAL '2 days',
    'ACTIVE',
    'Bacterial Bronchopneumonia',
    'Complete full course of antibiotics. Maintain adequate hydration.',
    FALSE
)
ON CONFLICT (prescription_number) DO NOTHING;

INSERT INTO prescription_items (
    prescription_id, medication_name, strength, dosage_form, dosage_instructions, frequency, duration, quantity, special_instructions
) VALUES
('20000000-0000-0000-0000-000000000001', 'Telmisartan', '40 mg', 'Tablet', '1 tablet orally in morning', 'Once daily (OD)', '30 days', 30, 'Monitor morning BP'),
('20000000-0000-0000-0000-000000000001', 'Atorvastatin', '10 mg', 'Tablet', '1 tablet orally at bedtime', 'Once daily (HS)', '30 days', 30, 'Take post dinner'),
('20000000-0000-0000-0000-000000000002', 'Amoxicillin + Clavulanic Acid', '625 mg', 'Tablet', '1 tablet after meals', 'Twice daily (BD)', '7 days', 14, 'Do not skip doses'),
('20000000-0000-0000-0000-000000000002', 'N-Acetylcysteine', '600 mg', 'Effervescent Tablet', 'Dissolve in 100ml water', 'Once daily (OD)', '5 days', 5, 'Mucolytic support');

-- 9. Lab Orders & Reports
INSERT INTO lab_orders (
    id, order_number, encounter_id, patient_id, practitioner_id,
    test_name, category, priority, status, sample_type, sample_collected_at
) VALUES
(
    '30000000-0000-0000-0000-000000000001',
    'LAB-2026-0089',
    'f0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Comprehensive Lipid Profile & Serum Creatinine',
    'Biochemistry',
    'ROUTINE',
    'COMPLETED',
    'Venous Blood (Serum)',
    NOW() - INTERVAL '10 days' + INTERVAL '1 hour'
),
(
    '30000000-0000-0000-0000-000000000002',
    'LAB-2026-0090',
    'f0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002',
    'Complete Blood Count (CBC) with CRP',
    'Hematology',
    'STAT',
    'COMPLETED',
    'Whole Blood (EDTA)',
    NOW() - INTERVAL '2 days' + INTERVAL '30 minutes'
)
ON CONFLICT (order_number) DO NOTHING;

INSERT INTO lab_reports (
    id, lab_order_id, patient_id, technician_id, reviewed_by_doctor_id,
    test_results, conclusion, status, released_at, is_shared_with_abdm
) VALUES
(
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000001',
    '[
        {"parameter": "Total Cholesterol", "value": "218", "unit": "mg/dL", "reference": "< 200", "flag": "HIGH"},
        {"parameter": "LDL Cholesterol", "value": "136", "unit": "mg/dL", "reference": "< 100", "flag": "HIGH"},
        {"parameter": "HDL Cholesterol", "value": "46", "unit": "mg/dL", "reference": "> 40", "flag": "NORMAL"},
        {"parameter": "Triglycerides", "value": "168", "unit": "mg/dL", "reference": "< 150", "flag": "HIGH"},
        {"parameter": "Serum Creatinine", "value": "0.92", "unit": "mg/dL", "reference": "0.7 - 1.2", "flag": "NORMAL"}
    ]'::JSONB,
    'Mild borderline hyperlipidemia. Renal function markers within normal baseline.',
    'RELEASED',
    NOW() - INTERVAL '9 days',
    TRUE
),
(
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000002',
    '[
        {"parameter": "Hemoglobin", "value": "12.8", "unit": "g/dL", "reference": "12.0 - 15.5", "flag": "NORMAL"},
        {"parameter": "Total Leukocyte Count (TLC)", "value": "13800", "unit": "/uL", "reference": "4000 - 11000", "flag": "HIGH"},
        {"parameter": "Neutrophils", "value": "78", "unit": "%", "reference": "40 - 70", "flag": "HIGH"},
        {"parameter": "Platelet Count", "value": "2.4", "unit": "Lakh/uL", "reference": "1.5 - 4.5", "flag": "NORMAL"},
        {"parameter": "C-Reactive Protein (CRP)", "value": "24.5", "unit": "mg/L", "reference": "< 5.0", "flag": "HIGH"}
    ]'::JSONB,
    'Elevated leukocyte count and elevated CRP indicate active bacterial inflammatory response.',
    'RELEASED',
    NOW() - INTERVAL '1 day',
    FALSE
)
ON CONFLICT (id) DO NOTHING;

-- 10. Vital Observations (Ward / Nurse monitoring)
INSERT INTO vital_observations (
    patient_id, encounter_id, recorded_by, heart_rate, systolic_bp, diastolic_bp,
    respiratory_rate, spo2, temperature, blood_glucose, pain_score, notes, is_synthetic_demo, recorded_at
) VALUES
('d0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 96, 128, 82, 22, 94, 38.3, 134, 3, 'Patient placed on 2L nasal prongs oxygen', TRUE, NOW() - INTERVAL '36 hours'),
('d0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 88, 122, 78, 19, 97, 37.6, 120, 2, 'SpO2 improved post nebulization and antibiotics', TRUE, NOW() - INTERVAL '18 hours'),
('d0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 78, 118, 76, 16, 98, 36.9, 112, 1, 'Afebrile, chest clear on auscultation, stable', TRUE, NOW() - INTERVAL '2 hours');

-- 11. Care Tasks
INSERT INTO care_tasks (
    patient_id, encounter_id, assigned_role, assigned_user_id, task_title, description, priority, due_time, status
) VALUES
('d0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'nurse', 'b0000000-0000-0000-0000-000000000003', 'Administer IV Antibiotic dose', 'Augmentin 1.2g IV in 100ml Normal Saline over 30 min', 'HIGH', NOW() + INTERVAL '2 hours', 'PENDING'),
('d0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'nurse', 'b0000000-0000-0000-0000-000000000003', 'Monitor 4-hourly SpO2 and Temp', 'Check vital signs and log in MediSync ward flow sheet', 'MEDIUM', NOW() + INTERVAL '4 hours', 'PENDING');

-- 12. Patient Consents (Milestone 3 HIU/HIP)
INSERT INTO patient_consents (
    id, consent_id, patient_id, purpose_code, purpose_text, hiu_id, hip_id,
    hi_types, date_range_from, date_range_to, expiry_date, status, artefact_id, granted_at
) VALUES
(
    '50000000-0000-0000-0000-000000000001',
    'CR-ABDM-2026-9041',
    'd0000000-0000-0000-0000-000000000001',
    'CAREMGT',
    'Longitudinal Cardiology Care Management',
    'MEDISYNC_HOSPITAL_HIU_01',
    'APOLLO_HOSP_HYD_HIP',
    ARRAY['Prescription', 'DiagnosticReport', 'OPConsultation']::TEXT[],
    CURRENT_DATE - INTERVAL '365 days',
    CURRENT_DATE,
    NOW() + INTERVAL '30 days',
    'GRANTED',
    'ART-ABDM-2026-104992',
    NOW() - INTERVAL '5 days'
),
(
    '50000000-0000-0000-0000-000000000002',
    'CR-ABDM-2026-9042',
    'd0000000-0000-0000-0000-000000000002',
    'CAREMGT',
    'Cross-hospital Inpatient Records Discovery',
    'MEDISYNC_HOSPITAL_HIU_01',
    'YASHODA_HOSP_HIP',
    ARRAY['DiagnosticReport', 'DischargeSummary']::TEXT[],
    CURRENT_DATE - INTERVAL '180 days',
    CURRENT_DATE,
    NOW() + INTERVAL '7 days',
    'CONSENT_PENDING',
    NULL,
    NULL
)
ON CONFLICT (consent_id) DO NOTHING;

-- 13. Integration Configuration
INSERT INTO abdm_integration_config (
    environment, gateway_url, client_id_masked, hip_id, hiu_id, is_active, status_notes
) VALUES (
    'SANDBOX',
    'https://dev.abdm.gov.in/gateway',
    'SBX_CL_98421***_PROD',
    'MEDISYNC_HOSPITAL_HIP_01',
    'MEDISYNC_HOSPITAL_HIU_01',
    TRUE,
    'Connected to NHA Sandbox Gateway v0.5. Mock fallback active when network token unavailable.'
) ON CONFLICT DO NOTHING;
