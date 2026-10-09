export type UserRole =
  | 'patient'
  | 'doctor'
  | 'nurse'
  | 'hospital_admin'
  | 'pharmacy'
  | 'laboratory'
  | 'family_member';

export type AbhaStatus =
  | 'NOT_CONNECTED'
  | 'VERIFICATION_REQUIRED'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED'
  | 'CARE_CONTEXT_LINK_PENDING'
  | 'LINKED'
  | 'CONSENT_PENDING'
  | 'CONSENT_GRANTED'
  | 'CONSENT_DENIED'
  | 'CONSENT_REVOKED'
  | 'INTEGRATION_UNAVAILABLE'
  | 'ACTION_REQUIRED';

export type CareContextStatus =
  | 'NOT_LINKED'
  | 'DISCOVERED'
  | 'LINK_PENDING'
  | 'LINKED'
  | 'FAILED';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
}

export interface PatientProfile {
  id: string;
  profileId?: string;
  internalPatientId: string; // e.g. MS-PAT-2026-0001
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email?: string;
  address?: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  abhaLink?: PatientAbhaLink;
}

export interface PatientAbhaLink {
  id: string;
  patientId: string;
  abhaNumberMasked?: string;
  abhaAddress?: string;
  linkStatus: AbhaStatus;
  verificationMethod?: string;
  verifiedAt?: string;
  lastSyncedAt?: string;
  errorMessage?: string;
}

export interface PractitionerProfile {
  id: string;
  profileId: string;
  fullName: string;
  registrationNumber: string;
  qualification: string;
  specialization: string;
  hprId?: string;
  department: string;
  experienceYears: number;
}

export interface Encounter {
  id: string;
  encounterNumber: string;
  patientId: string;
  practitionerId: string;
  practitionerName: string;
  encounterType: 'OP_CONSULTATION' | 'IP_ADMISSION' | 'EMERGENCY' | 'TELECONSULTATION';
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  chiefComplaint: string;
  provisionalDiagnosis?: string;
  finalDiagnosis?: string;
  startTime: string;
  endTime?: string;
}

export interface MedicalRecord {
  id: string;
  recordNumber: string;
  patientId: string;
  encounterId?: string;
  recordType: 'OP_CONSULTATION' | 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY';
  title: string;
  summary: string;
  sourceOrg: string;
  authorName: string;
  recordDate: string;
  verificationStatus: string;
  abhaCareContextStatus?: CareContextStatus;
  fhirType?: string;
}

export interface CareContext {
  id: string;
  internalContextId: string;
  patientId: string;
  encounterId?: string;
  displayLabel: string;
  recordCategory: 'OPConsultation' | 'Prescription' | 'DiagnosticReport' | 'DischargeSummary';
  linkStatus: CareContextStatus;
  correlationRef?: string;
  linkedAt?: string;
  lastSyncAt?: string;
}

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicationName: string;
  strength: string;
  dosageForm: string;
  dosageInstructions: string;
  frequency: string;
  duration: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  encounterId?: string;
  patientId: string;
  patientName: string;
  practitionerId: string;
  practitionerName: string;
  issueDate: string;
  status: 'ACTIVE' | 'DISPENSED' | 'PARTIALLY_DISPENSED' | 'CANCELLED';
  diagnosis?: string;
  instructions?: string;
  isSharedWithAbdm: boolean;
  items: PrescriptionItem[];
}

export interface TestResultItem {
  parameter: string;
  value: string;
  unit: string;
  reference: string;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  practitionerId: string;
  practitionerName: string;
  testName: string;
  category: string;
  priority: 'ROUTINE' | 'STAT' | 'URGENT';
  status: 'ORDERED' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  clinicalIndication?: string;
  sampleType?: string;
  orderedAt: string;
}

export interface LabReport {
  id: string;
  labOrderId: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  testName: string;
  technicianName: string;
  reviewedByDoctorName?: string;
  results: TestResultItem[];
  conclusion: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'RELEASED' | 'REJECTED';
  releasedAt?: string;
  isSharedWithAbdm: boolean;
}

export interface VitalObservation {
  id: string;
  patientId: string;
  patientName: string;
  recordedBy: string;
  heartRate: number;
  systolicBp: number;
  diastolicBp: number;
  respiratoryRate: number;
  spo2: number;
  temperature: number;
  bloodGlucose?: number;
  painScore: number;
  consciousnessLevel: string;
  notes?: string;
  recordedAt: string;
  isSyntheticDemo: boolean;
}

export interface CareTask {
  id: string;
  patientId: string;
  patientName: string;
  assignedRole: UserRole;
  assignedUserName: string;
  taskTitle: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueTime: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED';
  escalationNotes?: string;
}

export interface PatientConsent {
  id: string;
  consentId: string;
  patientId: string;
  purposeCode: string;
  purposeText: string;
  hiuId: string;
  hipId?: string;
  hiTypes: string[];
  dateRangeFrom: string;
  dateRangeTo: string;
  expiryDate: string;
  status: 'REQUESTED' | 'CONSENT_PENDING' | 'GRANTED' | 'DENIED' | 'REVOKED' | 'EXPIRED';
  artefactId?: string;
  grantedAt?: string;
  revokedAt?: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  timestamp: string;
}
