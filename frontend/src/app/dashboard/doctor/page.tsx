'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  INITIAL_PATIENTS,
  INITIAL_RECORDS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_CONSENTS,
} from '@/lib/mockData';
import {
  requestConsent,
  fetchConsentedRecords,
  generateAiSummary,
} from '@/lib/abdmClient';
import {
  Stethoscope,
  Activity,
  User,
  Search,
  FileText,
  Pill,
  FlaskConical,
  Sparkles,
  Share2,
  CheckCircle2,
  Plus,
  Send,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function DoctorDashboard() {
  const [patients] = useState(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState(INITIAL_PATIENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'encounter' | 'prescription' | 'abdm_records' | 'ai'>('encounter');

  // Encounter form state
  const [chiefComplaint, setChiefComplaint] = useState(
    'Patient presents for 3-month follow-up on essential hypertension management.'
  );
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('Essential (primary) hypertension - Stage 1');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Blood pressure measured at 138/84 mmHg. Normal heart sounds. No peripheral edema. Patient reports consistent compliance with Telmisartan.'
  );

  // Digital Prescription form state
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [rxItems, setRxItems] = useState([
    {
      medicationName: 'Telmisartan',
      strength: '40 mg',
      dosageForm: 'Tablet',
      frequency: 'Once daily (OD)',
      duration: '30 days',
      quantity: 30,
      dosageInstructions: '1 tablet in the morning after breakfast',
    },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedStrength, setNewMedStrength] = useState('');

  // ABDM HIU Records state
  const [consentedRecords, setConsentedRecords] = useState<any[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [consentRequestNotice, setConsentRequestNotice] = useState<string | null>(null);

  // AI Assistant state
  const [aiSummary, setAiSummary] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Notice helper
  const [notice, setNotice] = useState<string | null>(null);
  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 5000);
  };

  // Filter patients
  const filteredPatients = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.internalPatientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add prescription item
  const handleAddMedication = () => {
    if (!newMedName) return;
    setRxItems([
      ...rxItems,
      {
        medicationName: newMedName,
        strength: newMedStrength || '10 mg',
        dosageForm: 'Tablet',
        frequency: 'Once daily (OD)',
        duration: '30 days',
        quantity: 30,
        dosageInstructions: '1 tablet with water',
      },
    ]);
    setNewMedName('');
    setNewMedStrength('');
  };

  // Issue digital prescription
  const handleIssuePrescription = () => {
    const newRx = {
      id: 'rx-new-' + Math.random().toString(36).substring(2, 9),
      prescriptionNumber: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      practitionerId: 'c0000000-0000-0000-0000-000000000001',
      practitionerName: 'Dr. Rajesh Sharma, MD',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE' as const,
      diagnosis: provisionalDiagnosis,
      instructions: 'Take medications on time as directed.',
      isSharedWithAbdm: true,
      items: rxItems.map((item, idx) => ({
        id: `item-${idx}`,
        prescriptionId: 'new',
        ...item,
      })),
    };
    setPrescriptions([newRx, ...prescriptions]);
    triggerNotice(`Digital Prescription ${newRx.prescriptionNumber} created and queued for pharmacy dispensing.`);
  };

  // Request ABDM Consent
  const handleRequestConsent = async () => {
    if (!selectedPatient.abhaLink?.abhaAddress) {
      alert('Patient does not have an active ABHA address associated.');
      return;
    }
    try {
      const res = await requestConsent({
        patient_id: selectedPatient.id,
        patient_abha_address: selectedPatient.abhaLink.abhaAddress,
        purpose_code: 'CAREMGT',
        hi_types: ['Prescription', 'DiagnosticReport', 'OPConsultation'],
        date_range_from: '2025-01-01',
        date_range_to: '2026-10-09',
        expiry_date: '2026-11-09',
      });
      setConsentRequestNotice(res.message);
      triggerNotice(`ABDM Consent Request dispatched to ${selectedPatient.abhaLink.abhaAddress}`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Fetch Consented External Records
  const handleFetchExternalRecords = async () => {
    setRecordsLoading(true);
    try {
      const res = await fetchConsentedRecords(selectedPatient.id, 'ART-ABDM-2026-104992');
      setConsentedRecords(res.records);
      triggerNotice(`Retrieved ${res.records_count} external FHIR records via active ABDM consent.`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setRecordsLoading(false);
    }
  };

  // Generate AI Summary
  const handleDoctorAiSummary = async () => {
    setAiLoading(true);
    try {
      const res = await generateAiSummary(selectedPatient.id, 'doctor', INITIAL_RECORDS);
      setAiSummary(res);
      triggerNotice('Clinical synthesis generated from verified hospital records.');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <DashboardLayout
      activeRole="doctor"
      userName="Dr. Rajesh Sharma, MD"
      userSubtitle="Reg: MCI-48921-A | HPR: dr.sharma@hpr.abdm"
    >
      <div className="space-y-6">
        {notice && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-primary flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Doctor Header & Patient Search Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient Roster Column */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-border shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>Patient Queue</span>
              </h2>
              <span className="text-xs font-semibold text-typography-secondary bg-surface-muted px-2 py-0.5 rounded-full">
                {patients.length} Registered
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-typography-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border focus:outline-none focus:border-primary"
              />
            </div>

            {/* Patient List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredPatients.map((p) => {
                const isSelected = selectedPatient.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      setConsentedRecords([]);
                      setAiSummary(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-primary bg-primary-50 text-navy shadow-xs'
                        : 'border-border hover:bg-surface-subtle text-typography-main'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-navy">{p.fullName}</span>
                      <span className="font-mono text-[10px] text-typography-secondary font-semibold">
                        {p.internalPatientId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-typography-secondary">
                      <span>Age 34 &bull; {p.bloodGroup}</span>
                      <StatusBadge status={p.abhaLink?.linkStatus || 'NOT_CONNECTED'} size="sm" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Patient Clinical Desk */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-border shadow-card p-6 space-y-6">
            {/* Patient Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-navy">{selectedPatient.fullName}</h2>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-muted border border-border text-navy">
                    {selectedPatient.internalPatientId}
                  </span>
                </div>
                <div className="text-xs text-typography-secondary flex items-center gap-3 pt-1">
                  <span>DOB: {selectedPatient.dob}</span>
                  <span>&bull;</span>
                  <span>Blood: <strong className="text-navy">{selectedPatient.bloodGroup}</strong></span>
                  <span>&bull;</span>
                  <span>ABHA: <strong className="text-primary">{selectedPatient.abhaLink?.abhaAddress || 'Not linked'}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={selectedPatient.abhaLink?.linkStatus || 'NOT_CONNECTED'} size="md" />
              </div>
            </div>

            {/* Clinical Tabs */}
            <div className="border-b border-border flex items-center gap-6 text-xs font-semibold text-typography-secondary">
              <button
                onClick={() => setActiveTab('encounter')}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'encounter' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-navy'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Consultation Encounter</span>
              </button>

              <button
                onClick={() => setActiveTab('prescription')}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'prescription' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-navy'
                }`}
              >
                <Pill className="w-4 h-4" />
                <span>Digital Prescription</span>
              </button>

              <button
                onClick={() => setActiveTab('abdm_records')}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'abdm_records' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-navy'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>ABDM Health Exchange (HIU)</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'ai' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-navy'
                }`}
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>AI Clinical Assistant</span>
              </button>
            </div>

            {/* TAB 1: CONSULTATION ENCOUNTER */}
            {activeTab === 'encounter' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-navy">Chief Complaint</label>
                  <textarea
                    rows={2}
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-navy">Provisional / Final ICD-10 Diagnosis</label>
                  <input
                    type="text"
                    value={provisionalDiagnosis}
                    onChange={(e) => setProvisionalDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-xs font-semibold text-navy"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-navy">Clinical Examination & Assessment Notes</label>
                  <textarea
                    rows={4}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => triggerNotice('Consultation encounter saved and logged into hospital EMR.')}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-600 transition-colors shadow-xs"
                  >
                    Save & Sign Encounter Note
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: DIGITAL PRESCRIPTION WRITER */}
            {activeTab === 'prescription' && (
              <div className="space-y-5 text-xs">
                {/* Active Items */}
                <div className="space-y-2">
                  <span className="font-bold text-navy uppercase text-[11px] tracking-wider block">
                    Prescribed Medication List:
                  </span>
                  <div className="space-y-2">
                    {rxItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-surface-muted rounded-xl border border-border flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-navy">
                            {item.medicationName}{' '}
                            <span className="font-mono text-primary font-normal">({item.strength})</span>
                          </div>
                          <div className="text-[11px] text-typography-secondary">
                            {item.dosageInstructions} &bull; {item.frequency} &bull; {item.duration}
                          </div>
                        </div>
                        <button
                          onClick={() => setRxItems(rxItems.filter((_, i) => i !== idx))}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Item Row */}
                <div className="p-3.5 bg-surface-muted rounded-xl border border-border space-y-3">
                  <span className="font-bold text-navy block text-[11px]">Add Medication Item:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Medication (e.g. Atorvastatin)"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-primary text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Strength (e.g. 10 mg)"
                      value={newMedStrength}
                      onChange={(e) => setNewMedStrength(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-primary text-xs bg-white"
                    />
                    <button
                      onClick={handleAddMedication}
                      className="px-3 py-2 rounded-lg bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Medication</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[11px] text-typography-secondary">
                    Dispensing destination: MediSync Outpatient Pharmacy
                  </span>
                  <button
                    onClick={handleIssuePrescription}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-600 transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Issue Digital Prescription</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ABDM HEALTH EXCHANGE (HIU) */}
            {activeTab === 'abdm_records' && (
              <div className="space-y-5 text-xs">
                <div className="p-4 bg-surface-muted rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-bold text-navy text-sm">Cross-Hospital Longitudinal History</div>
                    <p className="text-typography-secondary text-[11px]">
                      Access records from other participating ABDM hospital nodes under active patient consent.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleRequestConsent}
                      className="px-3 py-2 rounded-xl bg-white border border-border text-navy hover:bg-surface-subtle font-semibold text-xs transition-colors"
                    >
                      Request ABDM Consent
                    </button>
                    <button
                      onClick={handleFetchExternalRecords}
                      disabled={recordsLoading}
                      className="px-3.5 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-600 shadow-xs transition-colors"
                    >
                      {recordsLoading ? 'Fetching Records...' : 'Fetch Consented Records'}
                    </button>
                  </div>
                </div>

                {consentRequestNotice && (
                  <div className="p-3 bg-blue-50 text-primary border border-blue-200 rounded-lg text-[11px]">
                    {consentRequestNotice}
                  </div>
                )}

                {/* External Records List */}
                <div className="space-y-3">
                  {consentedRecords.length > 0 ? (
                    consentedRecords.map((rec) => (
                      <div
                        key={rec.record_id}
                        className="p-4 rounded-xl border border-border bg-white shadow-xs space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-navy">{rec.record_type}</span>
                          <span className="text-typography-muted">{rec.record_date}</span>
                        </div>
                        <p className="text-typography-secondary leading-relaxed">{rec.clinical_summary}</p>
                        <div className="pt-2 border-t border-border flex justify-between items-center text-[10px] text-typography-muted">
                          <span>Source: <strong className="text-navy">{rec.source_facility}</strong></span>
                          <span>FHIR: {rec.fhir_type}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-typography-secondary text-xs">
                      No external records loaded. Click &ldquo;Fetch Consented Records&rdquo; to retrieve authorized
                      bundles.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: AI CLINICAL ASSISTANT */}
            {activeTab === 'ai' && (
              <div className="space-y-5 text-xs">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <div>
                    <h3 className="font-bold text-navy text-sm">Grounded Clinical Synthesis</h3>
                    <p className="text-[11px] text-typography-secondary">
                      Synthesizes hospital encounter notes, laboratory flags & active medications
                    </p>
                  </div>
                  <button
                    onClick={handleDoctorAiSummary}
                    disabled={aiLoading}
                    className="px-4 py-2 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiLoading ? 'Synthesizing...' : 'Run Clinical RAG'}</span>
                  </button>
                </div>

                {aiSummary ? (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px]">
                      <strong>Notice:</strong> {aiSummary.disclaimer}
                    </div>

                    <div className="p-4 bg-surface-muted rounded-xl border border-border space-y-2">
                      <span className="font-bold text-navy text-[11px] uppercase tracking-wider block">
                        Cardiovascular & Metabolic Highlights
                      </span>
                      <ul className="space-y-1.5 text-typography-secondary">
                        {aiSummary.chief_clinical_highlights.map((h: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-surface-muted rounded-xl border border-border space-y-2">
                      <span className="font-bold text-navy text-[11px] uppercase tracking-wider block">
                        Active Medications Reconciled
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {aiSummary.active_medications.map((m: any, i: number) => (
                          <div key={i} className="p-2.5 bg-white rounded-lg border border-border">
                            <div className="font-bold text-navy">{m.medication}</div>
                            <div className="text-[10px] text-typography-secondary">{m.frequency}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-typography-secondary text-xs">
                    Click &ldquo;Run Clinical RAG&rdquo; to generate grounded clinical synthesis for this patient.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
