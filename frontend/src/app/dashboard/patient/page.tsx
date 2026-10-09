'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  INITIAL_PATIENTS,
  INITIAL_RECORDS,
  INITIAL_CARE_CONTEXTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_REPORTS,
  INITIAL_CONSENTS,
} from '@/lib/mockData';
import {
  verifyAbhaInitiate,
  verifyAbhaConfirm,
  createAbhaInitiate,
  createAbhaConfirm,
  initiateCareContextLink,
  confirmCareContextLink,
  simulateGrantConsent,
  revokeConsent,
  generateAiSummary,
} from '@/lib/abdmClient';
import {
  ShieldCheck,
  Activity,
  FileText,
  Pill,
  FlaskConical,
  Sparkles,
  Link2,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  PlusCircle,
  Eye,
  KeyRound,
  Users,
} from 'lucide-react';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState<'abha' | 'records' | 'prescriptions' | 'labs' | 'ai' | 'family'>('abha');
  const [patient, setPatient] = useState(INITIAL_PATIENTS[0]);
  const [careContexts, setCareContexts] = useState(INITIAL_CARE_CONTEXTS);
  const [consents, setConsents] = useState(INITIAL_CONSENTS);
  const [records] = useState(INITIAL_RECORDS);
  const [prescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [labReports] = useState(INITIAL_LAB_REPORTS);

  // M1 Verify Modal State
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyInput, setVerifyInput] = useState(patient.abhaLink?.abhaAddress || 'rohan.verma@abdm');
  const [verifyStep, setVerifyStep] = useState<'INPUT' | 'OTP' | 'SUCCESS'>('INPUT');
  const [verifyTxnId, setVerifyTxnId] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // M1 Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createAadhaarInput, setCreateAadhaarInput] = useState('987654321012');
  const [createDesiredAddr, setCreateDesiredAddr] = useState('rohan.new@abdm');
  const [createStep, setCreateStep] = useState<'INPUT' | 'OTP' | 'SUCCESS'>('INPUT');
  const [createTxnId, setCreateTxnId] = useState('');

  // M2 Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const [linkTxnId, setLinkTxnId] = useState('');
  const [linkOtpInput, setLinkOtpInput] = useState('');
  const [linkStep, setLinkStep] = useState<'CONFIRM' | 'OTP' | 'SUCCESS'>('CONFIRM');

  // AI Summary State
  const [aiSummaryData, setAiSummaryData] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Status message alert
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 5000);
  };

  // -------------------------------------------------------------
  // M1 Existing ABHA Verification Workflow
  // -------------------------------------------------------------
  const handleInitiateVerification = async () => {
    setVerifyLoading(true);
    setVerifyError('');
    try {
      const res = await verifyAbhaInitiate(patient.id, verifyInput, 'AADHAAR_OTP');
      setVerifyTxnId(res.txn_id);
      setVerifyStep('OTP');
      showNotice(res.message);
    } catch (e: any) {
      setVerifyError(e.message || 'Verification initiation failed.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleConfirmVerification = async () => {
    setVerifyLoading(true);
    setVerifyError('');
    try {
      const res = await verifyAbhaConfirm(patient.id, verifyTxnId, otpInput);
      if (res.profile) {
        setPatient({
          ...patient,
          abhaLink: {
            id: 'link-' + Math.random().toString(36).substring(2, 9),
            patientId: patient.id,
            abhaNumberMasked: res.profile.abha_number,
            abhaAddress: res.profile.abha_address,
            linkStatus: 'LINKED',
            verificationMethod: 'AADHAAR_OTP',
            verifiedAt: res.profile.verified_at,
            lastSyncedAt: new Date().toISOString(),
          },
        });
        setVerifyStep('SUCCESS');
        showNotice(res.message);
      }
    } catch (e: any) {
      setVerifyError(e.message || 'OTP verification failed.');
    } finally {
      setVerifyLoading(false);
    }
  };

  // -------------------------------------------------------------
  // M1 ABHA Creation Workflow
  // -------------------------------------------------------------
  const handleInitiateCreate = async () => {
    setVerifyLoading(true);
    try {
      const res = await createAbhaInitiate(patient.id, 'AADHAAR', createAadhaarInput, true);
      setCreateTxnId(res.txn_id);
      setCreateStep('OTP');
      showNotice(res.message);
    } catch (e: any) {
      setVerifyError(e.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleConfirmCreate = async () => {
    setVerifyLoading(true);
    try {
      const res = await createAbhaConfirm(patient.id, createTxnId, otpInput, createDesiredAddr);
      if (res.profile) {
        setPatient({
          ...patient,
          abhaLink: {
            id: 'link-' + Math.random().toString(36).substring(2, 9),
            patientId: patient.id,
            abhaNumberMasked: res.profile.abha_number,
            abhaAddress: res.profile.abha_address,
            linkStatus: 'LINKED',
            verificationMethod: 'AADHAAR_OTP',
            verifiedAt: res.profile.verified_at,
            lastSyncedAt: new Date().toISOString(),
          },
        });
        setCreateStep('SUCCESS');
        showNotice(res.message);
      }
    } catch (e: any) {
      setVerifyError(e.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  // -------------------------------------------------------------
  // M2 Care Context Linking Workflow
  // -------------------------------------------------------------
  const openLinkFlow = (contextId: string) => {
    setSelectedContextId(contextId);
    setLinkStep('CONFIRM');
    setLinkModalOpen(true);
  };

  const handleInitiateContextLink = async () => {
    if (!selectedContextId || !patient.abhaLink?.abhaAddress) return;
    setVerifyLoading(true);
    try {
      const res = await initiateCareContextLink(patient.id, patient.abhaLink.abhaAddress, [selectedContextId]);
      setLinkTxnId(res.txn_id);
      setLinkStep('OTP');
      showNotice(res.message);
    } catch (e: any) {
      setVerifyError(e.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleConfirmContextLink = async () => {
    if (!selectedContextId) return;
    setVerifyLoading(true);
    try {
      const res = await confirmCareContextLink(patient.id, linkTxnId, linkOtpInput, [selectedContextId]);
      setCareContexts(
        careContexts.map((cc) =>
          cc.internalContextId === selectedContextId
            ? { ...cc, linkStatus: 'LINKED', linkedAt: new Date().toISOString() }
            : cc
        )
      );
      setLinkStep('SUCCESS');
      showNotice(res.message);
    } catch (e: any) {
      setVerifyError(e.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  // -------------------------------------------------------------
  // M3 Consent Actions
  // -------------------------------------------------------------
  const handleApproveConsent = async (consentId: string) => {
    try {
      const res = await simulateGrantConsent(consentId);
      setConsents(
        consents.map((c) =>
          c.consentId === consentId
            ? { ...c, status: 'GRANTED', artefactId: res.artefact_id, grantedAt: res.granted_at }
            : c
        )
      );
      showNotice(res.message);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRevokeConsent = async (consentId: string) => {
    try {
      const res = await revokeConsent(consentId);
      setConsents(
        consents.map((c) =>
          c.consentId === consentId
            ? { ...c, status: 'REVOKED', revokedAt: res.revoked_at }
            : c
        )
      );
      showNotice(res.message);
    } catch (e: any) {
      alert(e.message);
    }
  };

  // -------------------------------------------------------------
  // AI Summary Trigger
  // -------------------------------------------------------------
  const handleGenerateAiSummary = async () => {
    setAiLoading(true);
    try {
      const summary = await generateAiSummary(patient.id, 'patient', records);
      setAiSummaryData(summary);
      showNotice('AI Clinical Summary synthesized from 4 verified hospital records.');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <DashboardLayout
      activeRole="patient"
      userName={patient.fullName}
      userSubtitle={`ID: ${patient.internalPatientId} | Age 34`}
    >
      <div className="space-y-6">
        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-primary flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Patient Profile & ABHA Identity Card */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-sm">
                {patient.fullName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-navy">{patient.fullName}</h1>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-surface-muted border border-border font-mono text-navy font-semibold">
                    {patient.internalPatientId}
                  </span>
                </div>
                <div className="text-xs text-typography-secondary flex flex-wrap items-center gap-3">
                  <span>DOB: {patient.dob} (Age 34)</span>
                  <span>&bull;</span>
                  <span>Gender: {patient.gender}</span>
                  <span>&bull;</span>
                  <span>Blood: <strong className="text-navy">{patient.bloodGroup}</strong></span>
                  <span>&bull;</span>
                  <span>Phone: {patient.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setVerifyStep('INPUT');
                  setVerifyModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-primary-50 text-primary hover:bg-primary-100 text-xs font-semibold border border-primary-200 transition-colors flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verify Existing ABHA</span>
              </button>
              <button
                onClick={() => {
                  setCreateStep('INPUT');
                  setCreateModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-surface-muted text-navy hover:bg-surface-subtle text-xs font-semibold border border-border transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-primary" />
                <span>Create New ABHA</span>
              </button>
            </div>
          </div>

          {/* DEDICATED ABHA INTEGRATION SECTION */}
          <div className="rounded-xl bg-gradient-to-r from-surface-muted to-white border border-border p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">
                    Ayushman Bharat Digital Mission (ABDM)
                  </div>
                  <h3 className="text-sm font-bold text-navy">National ABHA Identity Association</h3>
                </div>
              </div>
              <StatusBadge status={patient.abhaLink?.linkStatus || 'NOT_CONNECTED'} size="md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-1">
              <div className="p-3 bg-white rounded-lg border border-border space-y-1">
                <span className="text-typography-secondary block">ABHA Number</span>
                <span className="font-mono font-bold text-navy">
                  {patient.abhaLink?.abhaNumberMasked || 'Not Associated'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-border space-y-1">
                <span className="text-typography-secondary block">ABHA Address</span>
                <span className="font-medium text-primary">
                  {patient.abhaLink?.abhaAddress || 'Not Assigned'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-border space-y-1">
                <span className="text-typography-secondary block">Verification Method</span>
                <span className="font-semibold text-navy">
                  {patient.abhaLink?.verificationMethod || 'Pending'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-border space-y-1">
                <span className="text-typography-secondary block">Last Gateway Sync</span>
                <span className="text-typography-secondary">
                  {patient.abhaLink?.lastSyncedAt
                    ? new Date(patient.abhaLink.lastSyncedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
                    : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="border-b border-border flex items-center gap-6 text-xs font-semibold text-typography-secondary overflow-x-auto">
          <button
            onClick={() => setActiveTab('abha')}
            className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'abha' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-navy'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ABDM Hub (M1 &bull; M2 &bull; M3)</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'records' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-navy'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Unified Medical Records ({records.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'prescriptions'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent hover:text-navy'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Digital Prescriptions ({prescriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'labs' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-navy'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Laboratory Reports ({labReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'ai' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-navy'
            }`}
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>AI Clinical Synthesis</span>
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'family' ? 'border-primary text-primary font-bold' : 'border-transparent hover:text-navy'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Family & Dependents</span>
          </button>
        </div>

        {/* TAB 1: ABDM HUB (M1, M2, M3) */}
        {activeTab === 'abha' && (
          <div className="space-y-8">
            {/* Milestone 2: Care Contexts */}
            <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Milestone 2 (HIP)</span>
                  <h3 className="text-base font-bold text-navy">Hospital Care Contexts Linking</h3>
                </div>
                <span className="text-xs text-typography-secondary">
                  Links hospital encounters, prescriptions & lab reports to your ABHA
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-muted text-navy border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Care Context ID</th>
                      <th className="py-2.5 px-3">Encounter / Clinical Record</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {careContexts.map((cc) => (
                      <tr key={cc.internalContextId} className="hover:bg-surface-subtle transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-navy">{cc.internalContextId}</td>
                        <td className="py-3 px-3 font-semibold text-navy">{cc.displayLabel}</td>
                        <td className="py-3 px-3 text-typography-secondary">{cc.recordCategory}</td>
                        <td className="py-3 px-3">
                          <StatusBadge status={cc.linkStatus} size="sm" />
                        </td>
                        <td className="py-3 px-3 text-right">
                          {cc.linkStatus === 'LINKED' ? (
                            <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Linked
                            </span>
                          ) : (
                            <button
                              onClick={() => openLinkFlow(cc.internalContextId)}
                              className="px-3 py-1 rounded-lg bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition-colors inline-flex items-center gap-1"
                            >
                              <Link2 className="w-3 h-3" />
                              <span>Link to ABHA</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Milestone 3: Consent Requests & External Exchange */}
            <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <span className="text-[11px] font-bold text-navy uppercase tracking-wider">Milestone 3 (HIU)</span>
                  <h3 className="text-base font-bold text-navy">Consent-Based Health Information Exchange</h3>
                </div>
                <span className="text-xs text-typography-secondary">
                  Authorize other hospitals to share longitudinal health records
                </span>
              </div>

              <div className="space-y-3">
                {consents.map((consent) => (
                  <div
                    key={consent.consentId}
                    className="p-4 rounded-xl border border-border bg-surface-muted flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-navy">{consent.consentId}</span>
                        <StatusBadge status={consent.status} size="sm" />
                      </div>
                      <div className="text-navy font-semibold">{consent.purposeText}</div>
                      <div className="text-typography-secondary text-[11px] flex flex-wrap gap-2">
                        <span>Requester: {consent.hiuId}</span>
                        <span>&bull;</span>
                        <span>Source: {consent.hipId || 'All Participating Providers'}</span>
                        <span>&bull;</span>
                        <span>Categories: {consent.hiTypes.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {consent.status === 'CONSENT_PENDING' && (
                        <button
                          onClick={() => handleApproveConsent(consent.consentId)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                        >
                          Approve in ABHA
                        </button>
                      )}
                      {consent.status === 'GRANTED' && (
                        <button
                          onClick={() => handleRevokeConsent(consent.consentId)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs hover:bg-rose-100 transition-colors"
                        >
                          Revoke Access
                        </button>
                      )}
                      {consent.status === 'REVOKED' && (
                        <span className="text-[11px] font-semibold text-rose-600">Consent Revoked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UNIFIED MEDICAL RECORDS */}
        {activeTab === 'records' && (
          <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-base font-bold text-navy">Unified Longitudinal Medical Records</h3>
              <span className="text-xs text-typography-secondary">
                Signed hospital encounters & clinical documents
              </span>
            </div>

            <div className="space-y-4">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-xl border border-border bg-surface-muted hover:border-primary-300 transition-all space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-navy">{rec.recordNumber}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-border text-navy">
                        {rec.recordType.replace('_', ' ')}
                      </span>
                      <span className="text-typography-secondary text-[11px]">{rec.recordDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                        {rec.verificationStatus}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-navy">{rec.title}</h4>
                  <p className="text-typography-secondary leading-relaxed">{rec.summary}</p>

                  <div className="pt-2 border-t border-border/60 flex flex-wrap justify-between items-center text-[11px] text-typography-secondary gap-2">
                    <span>Source: <strong>{rec.sourceOrg}</strong></span>
                    <span>Clinician: <strong>{rec.authorName}</strong></span>
                    <span>ABHA Link: <strong>{rec.abhaCareContextStatus || 'LINKED'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DIGITAL PRESCRIPTIONS */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-base font-bold text-navy">Digital Prescriptions</h3>
              <span className="text-xs text-typography-secondary">Validated medication regimens</span>
            </div>

            <div className="space-y-6">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="p-5 rounded-xl border border-border bg-surface-muted space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-border/80 pb-2">
                    <div>
                      <span className="font-mono font-bold text-navy text-sm">{rx.prescriptionNumber}</span>
                      <div className="text-[11px] text-typography-secondary">
                        Issued on {rx.issueDate} by {rx.practitionerName}
                      </div>
                    </div>
                    <StatusBadge status={rx.status} size="sm" />
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-navy block text-[11px] uppercase tracking-wider">
                      Prescribed Medications:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rx.items.map((item) => (
                        <div key={item.id} className="p-3 bg-white rounded-lg border border-border space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-navy">{item.medicationName}</span>
                            <span className="font-mono text-primary font-semibold">{item.strength}</span>
                          </div>
                          <div className="text-[11px] text-typography-secondary">
                            Dosage: {item.dosageInstructions} &bull; {item.frequency}
                          </div>
                          <div className="text-[11px] text-typography-muted">
                            Duration: {item.duration} (Qty: {item.quantity})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-typography-secondary bg-white p-2.5 rounded-lg border border-border">
                    <strong>Instructions:</strong> {rx.instructions}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LABORATORY REPORTS */}
        {activeTab === 'labs' && (
          <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-base font-bold text-navy">Released Diagnostic Laboratory Reports</h3>
              <span className="text-xs text-typography-secondary">Reviewed & signed pathology results</span>
            </div>

            <div className="space-y-6">
              {labReports.map((report) => (
                <div key={report.id} className="p-5 rounded-xl border border-border bg-surface-muted space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-2">
                    <div>
                      <span className="font-mono font-bold text-navy text-sm">{report.orderNumber}</span>
                      <h4 className="text-sm font-bold text-navy">{report.testName}</h4>
                      <div className="text-[11px] text-typography-secondary">
                        Released by {report.technicianName} &bull; Reviewed by {report.reviewedByDoctorName}
                      </div>
                    </div>
                    <StatusBadge status={report.status} size="sm" />
                  </div>

                  {/* Results Table */}
                  <div className="overflow-x-auto bg-white rounded-lg border border-border">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-subtle border-b border-border text-navy font-semibold">
                        <tr>
                          <th className="py-2 px-3">Parameter</th>
                          <th className="py-2 px-3">Result Value</th>
                          <th className="py-2 px-3">Unit</th>
                          <th className="py-2 px-3">Reference Range</th>
                          <th className="py-2 px-3 text-right">Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {report.results.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-medium text-navy">{r.parameter}</td>
                            <td className="py-2 px-3 font-bold text-navy">{r.value}</td>
                            <td className="py-2 px-3 text-typography-secondary">{r.unit}</td>
                            <td className="py-2 px-3 text-typography-muted">{r.reference}</td>
                            <td className="py-2 px-3 text-right">
                              {r.flag === 'HIGH' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                  HIGH
                                </span>
                              )}
                              {r.flag === 'NORMAL' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  NORMAL
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-border text-[11px]">
                    <strong>Clinical Conclusion:</strong> {report.conclusion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AI CLINICAL SYNTHESIS */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-secondary text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy">AI-Assisted Medical History Synthesis</h3>
                  <span className="text-xs text-typography-secondary">
                    Grounded RAG analysis across all verified hospital records
                  </span>
                </div>
              </div>

              <button
                onClick={handleGenerateAiSummary}
                disabled={aiLoading}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-600 shadow-sm transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiLoading ? 'Synthesizing Records...' : 'Generate Grounded Summary'}</span>
              </button>
            </div>

            {aiSummaryData ? (
              <div className="space-y-6 text-xs animate-in fade-in">
                {/* Mandatory Disclaimer */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed font-medium">
                    {aiSummaryData.disclaimer}
                  </p>
                </div>

                {/* Synthesis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-2">
                    <span className="font-bold text-navy block uppercase text-[11px] tracking-wider">
                      Chief Clinical Highlights
                    </span>
                    <ul className="space-y-1 text-typography-secondary">
                      {aiSummaryData.chief_clinical_highlights.map((h: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-2">
                    <span className="font-bold text-navy block uppercase text-[11px] tracking-wider">
                      Active Medications Reconciled
                    </span>
                    <ul className="space-y-1 text-typography-secondary">
                      {aiSummaryData.active_medications.map((m: any, i: number) => (
                        <li key={i} className="flex justify-between items-center py-0.5 border-b border-border/50">
                          <span className="font-medium text-navy">{m.medication}</span>
                          <span className="text-[11px] text-primary">{m.frequency}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Source Citations with Exact Provenance */}
                <div className="space-y-2">
                  <span className="font-bold text-navy block uppercase text-[11px] tracking-wider">
                    Indexed Record Sources & Citations
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aiSummaryData.citations.map((cite: any, i: number) => (
                      <div key={i} className="p-3 bg-white rounded-lg border border-border space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-mono font-bold text-navy">{cite.record_id}</span>
                          <span className="text-typography-muted">{cite.date}</span>
                        </div>
                        <div className="text-typography-secondary text-[11px]">{cite.cited_detail}</div>
                        <div className="text-[10px] text-primary font-medium">{cite.facility}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-typography-secondary space-y-2">
                <Sparkles className="w-8 h-8 text-primary mx-auto opacity-50" />
                <p className="text-xs">
                  Click &ldquo;Generate Grounded Summary&rdquo; to analyze longitudinal consultation notes, lab values,
                  and medication history.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: FAMILY & DEPENDENTS */}
        {activeTab === 'family' && (
          <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-base font-bold text-navy">Family Dependents & Proxy Health Records</h3>
              <span className="text-xs text-typography-secondary">Authorized child and parent charts</span>
            </div>

            <div className="p-5 rounded-xl border border-border bg-surface-muted flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary flex items-center justify-center font-bold">
                  AS
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm">Aarav Sharma (Child Dependent)</h4>
                  <div className="text-typography-secondary text-[11px]">
                    Internal ID: MS-PAT-2026-0003 &bull; DOB: 2018-08-10 (Age 8) &bull; Blood: A+
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-primary border border-blue-200">
                  Guardian Access Active
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-white border border-border hover:bg-surface-subtle font-semibold text-xs text-navy">
                  View Immunizations
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: M1 Existing ABHA Verification */}
      {/* ------------------------------------------------------------- */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-border space-y-5 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Verify Existing ABHA (Milestone 1)</span>
              </h3>
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="text-typography-secondary hover:text-navy text-sm font-bold"
              >
                &times;
              </button>
            </div>

            {verifyError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200 font-medium">
                {verifyError}
              </div>
            )}

            {verifyStep === 'INPUT' && (
              <div className="space-y-4">
                <p className="text-typography-secondary leading-relaxed">
                  Enter your registered ABHA number (e.g. 91-4521-8932-1144) or ABHA address (e.g. user@abdm) to
                  initiate verification through official NHA APIs.
                </p>
                <div className="space-y-1.5">
                  <label className="font-semibold text-navy">ABHA Identifier *</label>
                  <input
                    type="text"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="e.g. rohan.verma@abdm"
                    className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-primary text-[11px]">
                  <strong>Sandbox Notice:</strong> An authentication challenge will be registered with NHA Gateway. For
                  testing, OTP <strong>123456</strong> will confirm verification.
                </div>
                <button
                  onClick={handleInitiateVerification}
                  disabled={verifyLoading}
                  className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 transition-colors"
                >
                  {verifyLoading ? 'Contacting NHA Gateway...' : 'Send Verification OTP'}
                </button>
              </div>
            )}

            {verifyStep === 'OTP' && (
              <div className="space-y-4">
                <p className="text-typography-secondary leading-relaxed">
                  Enter the 6-digit OTP sent to your Aadhaar/Mobile registered number.
                </p>
                <div className="space-y-1.5">
                  <label className="font-semibold text-navy">Enter OTP *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 123456"
                    className="w-full px-3 py-2 text-center rounded-xl border border-border focus:outline-none focus:border-primary font-mono text-base tracking-widest"
                  />
                </div>
                <button
                  onClick={handleConfirmVerification}
                  disabled={verifyLoading}
                  className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 transition-colors"
                >
                  {verifyLoading ? 'Validating Token on Server...' : 'Confirm OTP & Associate ABHA'}
                </button>
              </div>
            )}

            {verifyStep === 'SUCCESS' && (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-navy text-sm">ABHA Associated Successfully!</h4>
                <p className="text-typography-secondary text-[11px]">
                  Your verified identity is now linked with internal patient ID{' '}
                  <strong className="text-navy">{patient.internalPatientId}</strong>.
                </p>
                <button
                  onClick={() => setVerifyModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  Close & Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: M1 ABHA Creation */}
      {/* ------------------------------------------------------------- */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-border space-y-5 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-primary" />
                <span>Create New ABHA (Sandbox Flow)</span>
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-typography-secondary hover:text-navy text-sm font-bold"
              >
                &times;
              </button>
            </div>

            {createStep === 'INPUT' && (
              <div className="space-y-4">
                <p className="text-typography-secondary leading-relaxed">
                  Generate a new ABHA account in the ABDM Sandbox. No real Aadhaar number will be stored.
                </p>
                <div className="space-y-1.5">
                  <label className="font-semibold text-navy">Test Aadhaar / Mobile *</label>
                  <input
                    type="text"
                    value={createAadhaarInput}
                    onChange={(e) => setCreateAadhaarInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-navy">Desired ABHA Address *</label>
                  <input
                    type="text"
                    value={createDesiredAddr}
                    onChange={(e) => setCreateDesiredAddr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-typography-secondary">
                  <input type="checkbox" defaultChecked required />
                  <span>I confirm patient authorization to initiate ABHA creation</span>
                </div>
                <button
                  onClick={handleInitiateCreate}
                  disabled={verifyLoading}
                  className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 transition-colors"
                >
                  {verifyLoading ? 'Dispatching...' : 'Initiate Creation & Send OTP'}
                </button>
              </div>
            )}

            {createStep === 'OTP' && (
              <div className="space-y-4">
                <p className="text-typography-secondary leading-relaxed">
                  Enter the 6-digit Sandbox OTP to complete ABHA creation.
                </p>
                <div className="space-y-1.5">
                  <label className="font-semibold text-navy">OTP (Enter 123456) *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 text-center rounded-xl border border-border focus:outline-none focus:border-primary font-mono text-base tracking-widest"
                  />
                </div>
                <button
                  onClick={handleConfirmCreate}
                  disabled={verifyLoading}
                  className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 transition-colors"
                >
                  {verifyLoading ? 'Creating ABHA...' : 'Confirm & Reserve ABHA'}
                </button>
              </div>
            )}

            {createStep === 'SUCCESS' && (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-navy text-sm">ABHA Created and Associated!</h4>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: M2 Care Context Linking */}
      {/* ------------------------------------------------------------- */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-border space-y-5 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <Link2 className="w-4 h-4 text-secondary" />
                <span>Link Care Context to ABHA (Milestone 2)</span>
              </h3>
              <button
                onClick={() => setLinkModalOpen(false)}
                className="text-typography-secondary hover:text-navy text-sm font-bold"
              >
                &times;
              </button>
            </div>

            {linkStep === 'CONFIRM' && (
              <div className="space-y-4">
                <p className="text-typography-secondary leading-relaxed">
                  You are linking internal care record <strong className="text-navy">{selectedContextId}</strong> with
                  verified ABHA <strong className="text-primary">{patient.abhaLink?.abhaAddress}</strong>.
                </p>
                <div className="p-3 bg-surface-muted rounded-lg border border-border space-y-1">
                  <div>Patient Reference: {patient.internalPatientId}</div>
                  <div>HIP Facility: MediSync Apex Hospital (IN3610001234)</div>
                </div>
                <button
                  onClick={handleInitiateContextLink}
                  disabled={verifyLoading}
                  className="w-full py-2.5 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors"
                >
                  {verifyLoading ? 'Sending Linking Request...' : 'Send Linking Authorization OTP'}
                </button>
              </div>
            )}

            {linkStep === 'OTP' && (
              <div className="space-y-4">
                <p className="text-typography-secondary leading-relaxed">
                  Enter the OTP dispatched by the ABDM Gateway to verify linking authorization.
                </p>
                <div className="space-y-1.5">
                  <label className="font-semibold text-navy">Linking OTP (Enter 123456) *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={linkOtpInput}
                    onChange={(e) => setLinkOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 text-center rounded-xl border border-border focus:outline-none focus:border-primary font-mono text-base tracking-widest"
                  />
                </div>
                <button
                  onClick={handleConfirmContextLink}
                  disabled={verifyLoading}
                  className="w-full py-2.5 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors"
                >
                  {verifyLoading ? 'Validating Link Token...' : 'Confirm Linking on ABDM'}
                </button>
              </div>
            )}

            {linkStep === 'SUCCESS' && (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-navy text-sm">Care Context Successfully Linked!</h4>
                <p className="text-typography-secondary text-[11px]">
                  Records in this care context can now be discovered and requested via ABDM consent workflows.
                </p>
                <button
                  onClick={() => setLinkModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
