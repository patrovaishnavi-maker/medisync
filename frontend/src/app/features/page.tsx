import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  FileText,
  Activity,
  HeartPulse,
  Pill,
  FlaskConical,
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      category: 'ABHA Identity & Patient Hub',
      icon: Users,
      color: 'bg-primary text-white',
      badge: 'Milestone 1, 2 & 3',
      items: [
        'Aadhaar / Mobile OTP verification for existing ABHA numbers and addresses',
        'Optional sandbox ABHA creation with real-time address reservation',
        'Care context linking management for hospital encounters, prescriptions, and lab tests',
        'Patient consent control center: approve, deny, and revoke longitudinal record sharing',
        'Direct access to released medical records with verified source attribution',
      ],
      portalLink: '/dashboard/patient',
    },
    {
      category: 'Doctor & Clinical Encounters',
      icon: Activity,
      color: 'bg-primary-600 text-white',
      badge: 'OPD & Inpatient',
      items: [
        'Structured SOAP consultation notes with provisional and final ICD-10 diagnosis',
        'Validated digital prescriptions with medication dosage, frequency, and duration logic',
        'Integrated diagnostic test requisition with stat/routine priority tags',
        'Cross-hospital record discovery powered by ABDM consent artefacts',
        'One-click AI clinical summary generation with record citations and disclaimers',
      ],
      portalLink: '/dashboard/doctor',
    },
    {
      category: 'Nurse, Ward & ICU Workflows',
      icon: HeartPulse,
      color: 'bg-rose-600 text-white',
      badge: 'Ward Monitoring',
      items: [
        'Real-time vital signs charting: SpO2, blood pressure, heart rate, temp, and pain scores',
        'Visual vital trends flow chart for tracking clinical response to therapy',
        'Ward care task checklists with automated timestamps and assignment logs',
        'Clinical escalation logs with urgent physician notification triggers',
        'Synthetic telemetry demonstration mode for live training without patient risk',
      ],
      portalLink: '/dashboard/nurse',
    },
    {
      category: 'Digital Pharmacy & Dispensing',
      icon: Pill,
      color: 'bg-emerald-600 text-white',
      badge: 'Pharmacy Operations',
      items: [
        'Real-time queue of active hospital digital prescriptions',
        'Pharmacist dosage verification and drug interaction checks',
        'Batch number and manufacturer tracking for dispensed medications',
        'Audit-logged dispensing history preventing double-dispensing errors',
        'Care context status synchronization upon medication release',
      ],
      portalLink: '/dashboard/pharmacy',
    },
    {
      category: 'Diagnostic Laboratory & Pathology',
      icon: FlaskConical,
      color: 'bg-indigo-600 text-white',
      badge: 'Pathology Diagnostics',
      items: [
        'Specimen collection and accession logging with barcode-ready identifiers',
        'Multi-parameter test result recording (Biochemistry, Hematology, Microbiology)',
        'Automated reference range comparison with HIGH / LOW / CRITICAL visual flags',
        'Pathologist electronic review and digital signature report release',
        'Immediate FHIR R4 DiagnosticReport bundle generation for ABDM sharing',
      ],
      portalLink: '/dashboard/laboratory',
    },
    {
      category: 'Administration & ABDM Governance',
      icon: Building2,
      color: 'bg-navy text-white',
      badge: 'Facility Administration',
      items: [
        'ABDM Health Facility Registry (HFR) and Healthcare Professional (HPR) monitoring',
        'Live NHA Gateway connectivity and latency diagnostics (M1, M2, M3 status)',
        'Immutable audit logs tracking every record view, export, and API transaction',
        'Staff credential verification and role-based access management (RLS)',
        'Secure token lifecycle management with automated renewal',
      ],
      portalLink: '/dashboard/admin',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-semibold border border-primary-200">
              <ShieldCheck className="w-4 h-4" />
              <span>Full Hospital Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
              Engineered for Complete Healthcare Interoperability
            </h1>
            <p className="text-sm sm:text-base text-typography-secondary leading-relaxed">
              Every MediSync module is designed to operate seamlessly within a busy hospital environment while adhering
              strictly to National Health Authority (NHA) protocols.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={feat.category}
                  className="rounded-2xl border border-border bg-white shadow-card p-6 flex flex-col justify-between space-y-6 hover:shadow-elevated hover:border-primary-300 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${feat.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-muted text-typography-secondary border border-border">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-navy">{feat.category}</h3>

                    <ul className="space-y-2.5 text-xs text-typography-secondary">
                      {feat.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={feat.portalLink}
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-surface-muted hover:bg-primary-50 text-primary text-xs font-semibold border border-border hover:border-primary-200 transition-colors"
                  >
                    <span>Launch Portal Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
