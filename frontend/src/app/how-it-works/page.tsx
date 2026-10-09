import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Fingerprint,
  Link2,
  Share2,
  KeyRound,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-semibold border border-primary-200">
              <ShieldCheck className="w-4 h-4" />
              <span>ABDM Technical Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
              How MediSync Integrates with ABDM
            </h1>
            <p className="text-sm sm:text-base text-typography-secondary leading-relaxed">
              MediSync connects hospital electronic health records to India&rsquo;s national Ayushman Bharat Digital
              Mission through official Gateway v0.5 protocols across three official milestones.
            </p>
          </div>

          {/* Principle Alert */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-navy flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Fundamental Architecture Principle:</span>
              <p className="text-typography-secondary leading-relaxed">
                ABHA identity verification and MediSync account login are strictly decoupled. An ABHA number is never used
                as a password. MediSync uses Supabase Auth for platform login, and invokes server-side ABDM adapter
                services to verify ABHA identities only when authorized by the patient.
              </p>
            </div>
          </div>

          {/* Detailed Milestone Walkthrough */}
          <div className="space-y-12">
            {/* Milestone 1 */}
            <div className="p-8 rounded-2xl bg-surface-muted border border-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                    M1
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Milestone 1</span>
                    <h2 className="text-xl font-bold text-navy">Identity Creation & Verification</h2>
                  </div>
                </div>
                <Link
                  href="/dashboard/patient?tab=abha"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Test M1 in Patient Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-typography-secondary leading-relaxed">
                Allows patients to associate their verified Ayushman Bharat Health Account (ABHA) with their MediSync
                hospital patient chart.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-primary" />
                    1. OTP Challenge
                  </span>
                  <p className="text-typography-secondary">
                    Requests an authentication challenge via NHA Gateway (`/v0.5/users/auth/init`). An OTP is sent to the
                    patient&rsquo;s Aadhaar/Mobile registered number.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-primary" />
                    2. Server Validation
                  </span>
                  <p className="text-typography-secondary">
                    Validates OTP on the server through official API contracts. Never compares OTPs on the client or
                    generates fake local tokens.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-primary" />
                    3. Identity Mapping
                  </span>
                  <p className="text-typography-secondary">
                    Maps the verified ABHA number and address to the internal patient ID (`MS-PAT-2026-XXXX`). Prevents
                    duplicate or conflicting identity mappings.
                  </p>
                </div>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="p-8 rounded-2xl bg-surface-muted border border-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center font-bold">
                    M2
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Milestone 2</span>
                    <h2 className="text-xl font-bold text-navy">Hospital Care-Context Linking (HIP)</h2>
                  </div>
                </div>
                <Link
                  href="/dashboard/patient?tab=contexts"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline"
                >
                  <span>Test M2 in Patient Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-typography-secondary leading-relaxed">
                As an accredited Health Information Provider (HIP), MediSync groups clinical encounters into standardized
                care contexts and enables patients to link them directly to their ABHA.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-secondary" />
                    1. Context Discovery
                  </span>
                  <p className="text-typography-secondary">
                    Scans hospital electronic health records for eligible encounters, prescriptions, and lab reports
                    associated with the patient.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-secondary" />
                    2. Link Authorization
                  </span>
                  <p className="text-typography-secondary">
                    Submits linking requests through server-side adapter (`/v0.5/links/link/init`) and verifies patient
                    link token or OTP authorization.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    3. Gateway Callback
                  </span>
                  <p className="text-typography-secondary">
                    Correlates asynchronous confirmation callbacks (`/v0.5/links/link/on-add-contexts`) and marks records as
                    &lsquo;LINKED&rsquo; only after validation.
                  </p>
                </div>
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="p-8 rounded-2xl bg-surface-muted border border-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-bold">
                    M3
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Milestone 3</span>
                    <h2 className="text-xl font-bold text-navy">Consent-Based Health Information Exchange (HIU)</h2>
                  </div>
                </div>
                <Link
                  href="/dashboard/patient?tab=consent"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:underline"
                >
                  <span>Test M3 in Patient Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-typography-secondary leading-relaxed">
                As a Health Information User (HIU), MediSync clinicians can request access to external medical history
                stored at other participating hospitals.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-navy" />
                    1. Consent Artefact
                  </span>
                  <p className="text-typography-secondary">
                    Doctor creates a consent request specifying clinical purpose, date range, and record categories. Sent
                    directly to the patient&rsquo;s ABHA mobile app.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-navy" />
                    2. Patient Approval
                  </span>
                  <p className="text-typography-secondary">
                    Patient reviews and grants or denies consent on their ABHA app. Status tracks in real time:
                    REQUESTED, GRANTED, DENIED, or REVOKED.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-border space-y-2">
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-navy" />
                    3. Encrypted Ingestion
                  </span>
                  <p className="text-typography-secondary">
                    Encrypted FHIR R4 bundles are transferred securely via Diffie-Hellman ephemeral keys, preserving
                    original provider provenance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
