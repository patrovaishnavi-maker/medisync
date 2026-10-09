import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Activity,
  FileText,
  Pill,
  FlaskConical,
  HeartPulse,
  Building2,
  Users,
  Sparkles,
  Layers,
  Share2,
} from 'lucide-react';

export default function HomePage() {
  const roleCards = [
    {
      title: 'Patients & Families',
      desc: 'Verify ABHA, access longitudinal hospital records, manage consent approvals, and link family dependents.',
      icon: Users,
      href: '/dashboard/patient',
      badge: 'ABHA Hub & Records',
    },
    {
      title: 'Doctors & Clinicians',
      desc: 'Streamlined OPD consultations, digital prescriptions with dosage validation, lab requisitions, and consent-based history.',
      icon: Activity,
      href: '/dashboard/doctor',
      badge: 'Clinical Desk',
    },
    {
      title: 'Nurses & Inpatient Wards',
      desc: 'Real-time vital signs charting, SpO2/BP monitoring, scheduled medication tasks, and clinical escalation notes.',
      icon: HeartPulse,
      href: '/dashboard/nurse',
      badge: 'Ward & ICU Care',
    },
    {
      title: 'Hospital Administration',
      desc: 'ABDM HFR/HPR registration governance, live gateway health monitoring, audit logs, and credential verification.',
      icon: Building2,
      href: '/dashboard/admin',
      badge: 'Facility Ops',
    },
    {
      title: 'Pharmacy Operations',
      desc: 'Active digital prescription dispensing queue, dosage verification, and batch-tracked dispensing history.',
      icon: Pill,
      href: '/dashboard/pharmacy',
      badge: 'Dispensing Desk',
    },
    {
      title: 'Diagnostic Laboratories',
      desc: 'Order specimen tracking, multi-parameter test result recording, reference range flags, and digital report release.',
      icon: FlaskConical,
      href: '/dashboard/laboratory',
      badge: 'Pathology Lab',
    },
  ];

  const abdmSteps = [
    {
      step: '01',
      milestone: 'Milestone 1 (M1)',
      title: 'ABHA Identity Creation & Verification',
      desc: 'Patients verify existing ABHA numbers or create a new ABHA via official Aadhaar/Mobile OTP challenges. MediSync strictly isolates ABHA identity from application account authentication.',
      href: '/dashboard/patient?tab=abha',
    },
    {
      step: '02',
      milestone: 'Milestone 2 (M2)',
      title: 'Hospital Care-Context Linking',
      desc: 'Hospital encounters, digital prescriptions, and lab reports are organized into standardized care contexts and securely linked to the patient’s ABHA via NHA HIP workflows.',
      href: '/dashboard/patient?tab=contexts',
    },
    {
      step: '03',
      milestone: 'Milestone 3 (M3)',
      title: 'Consent-Based Health Information Exchange',
      desc: 'Authorized healthcare providers can request cross-hospital longitudinal records. Data transfer occurs exclusively after verifiable patient consent approval via their ABHA mobile app.',
      href: '/dashboard/patient?tab=consent',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-surface-muted via-white to-white pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                {/* Notice Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-xs font-semibold text-primary">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Ayushman Bharat Digital Mission (ABDM) Integrated</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight leading-[1.15]">
                  Unified Healthcare for a <span className="text-primary">Healthier Tomorrow</span>
                </h1>

                <p className="text-base sm:text-lg text-typography-secondary max-w-2xl leading-relaxed">
                  Connect your hospital with India&rsquo;s national digital health highway. MediSync bridges hospital
                  electronic medical records with verified ABHA identities, digital prescriptions, pathology reports,
                  and consent-driven health information exchange.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/dashboard/patient"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary-600 hover:shadow-lg transition-all"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-navy font-semibold text-sm border border-border hover:bg-surface-muted hover:border-primary-300 transition-all shadow-xs"
                  >
                    <Layers className="w-4 h-4 text-primary" />
                    <span>Explore ABHA Integration</span>
                  </Link>
                </div>

                {/* Trust Points */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/80 text-xs text-typography-secondary">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Strict Server Credentials</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>FHIR R4 Standardized</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Grounded AI Summaries</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-elevated border border-border p-6 space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center font-bold">
                        AB
                      </div>
                      <div>
                        <div className="text-sm font-bold text-navy">ABHA Identity Card</div>
                        <div className="text-xs text-typography-secondary">National Health Authority</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-typography-secondary">ABHA Number</span>
                      <span className="font-mono font-bold text-navy">91-4521-8932-1144</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-typography-secondary">ABHA Address</span>
                      <span className="font-medium text-primary">rohan.verma@abdm</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-typography-secondary">Internal Patient ID</span>
                      <span className="font-medium text-navy">MS-PAT-2026-0001</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-typography-secondary">Hospital Facility</span>
                      <span className="font-medium text-navy">MediSync Apex Hospital (IN3610001234)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-typography-secondary">Care Contexts Linked</span>
                      <span className="font-bold text-emerald-600">3 of 3 Active</span>
                    </div>
                  </div>

                  {/* Interactive Status Footer */}
                  <div className="bg-surface-muted p-3.5 rounded-xl border border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-primary" />
                      <span className="font-medium text-navy">Consent Artifact Active</span>
                    </div>
                    <Link
                      href="/dashboard/patient"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Manage &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Comprehensive Features</span>
              <h2 className="text-3xl font-extrabold text-navy">
                Complete Hospital Workflows Powered by ABDM
              </h2>
              <p className="text-sm text-typography-secondary">
                From outpatient registration to intensive care monitoring, pharmacy dispensing, and national health data
                exchange.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-surface-muted border border-border hover:border-primary-300 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy">Unified Medical Records</h3>
                <p className="text-xs text-typography-secondary leading-relaxed">
                  Consolidate consultation notes, lab results, prescriptions, and discharge summaries into a clean,
                  chronological medical timeline with full provenance tracking.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted border border-border hover:border-primary-300 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center shadow-sm">
                  <Pill className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy">Digital Prescriptions & Pharmacy</h3>
                <p className="text-xs text-typography-secondary leading-relaxed">
                  Clinicians generate validated digital prescriptions with dosage and frequency rules. Pharmacists verify
                  and record dispensing with batch tracking.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted border border-border hover:border-primary-300 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shadow-sm">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy">Laboratory & Diagnostics</h3>
                <p className="text-xs text-typography-secondary leading-relaxed">
                  Track orders from specimen collection to test processing. Releasing reports triggers verified digital
                  signatures and automated patient record updates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted border border-border hover:border-primary-300 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy">Nurse & Inpatient Flow Sheets</h3>
                <p className="text-xs text-typography-secondary leading-relaxed">
                  Ward and ICU nurses chart vital signs (SpO2, BP, pulse, temp), log clinical care tasks, and register
                  escalation notes in real time.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted border border-border hover:border-primary-300 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy">AI-Assisted Clinical Summaries</h3>
                <p className="text-xs text-typography-secondary leading-relaxed">
                  FastAPI-powered synthesis synthesizes long medical histories into source-grounded summaries with
                  mandatory citations and medical disclaimers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted border border-border hover:border-primary-300 transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy">Consent & Audit Governance</h3>
                <p className="text-xs text-typography-secondary leading-relaxed">
                  Full compliance with ABDM consent artifacts and DPDP regulations. Every record view and exchange
                  operation is logged in immutable audit records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How MediSync Works (ABDM 3-Step Journey) */}
        <section className="py-20 bg-surface-muted border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">National Architecture</span>
              <h2 className="text-3xl font-extrabold text-navy">
                How MediSync Integrates with ABDM
              </h2>
              <p className="text-sm text-typography-secondary">
                Built modularly across official National Health Authority (NHA) milestones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {abdmSteps.map((step) => (
                <div key={step.step} className="bg-white rounded-2xl p-6 border border-border shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-primary/30">{step.step}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary border border-primary-200">
                      {step.milestone}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-navy">{step.title}</h3>
                  <p className="text-xs text-typography-secondary leading-relaxed">{step.desc}</p>
                  <div className="pt-2">
                    <Link
                      href={step.href}
                      className="text-xs font-bold text-primary hover:text-primary-700 flex items-center gap-1"
                    >
                      <span>Explore Workflow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Role Cards Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Role-Based Experience</span>
              <h2 className="text-3xl font-extrabold text-navy">Dedicated Portals for Every Stakeholder</h2>
              <p className="text-sm text-typography-secondary">
                Click any role to test live dashboards with pre-populated synthetic hospital records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roleCards.map((role) => {
                const IconComponent = role.icon;
                return (
                  <div
                    key={role.title}
                    className="p-6 rounded-2xl border border-border bg-white shadow-card hover:shadow-elevated hover:border-primary-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-primary-50 text-primary">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-typography-secondary bg-surface-muted px-2 py-0.5 rounded-full border border-border">
                          {role.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-navy">{role.title}</h3>
                      <p className="text-xs text-typography-secondary leading-relaxed">{role.desc}</p>
                    </div>

                    <Link
                      href={role.href}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary-50 text-primary font-semibold text-xs hover:bg-primary hover:text-white transition-colors"
                    >
                      <span>Open {role.title.split(' ')[0]} Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
