import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-semibold border border-primary-200">
              <ShieldCheck className="w-4 h-4" />
              <span>Data Protection & Privacy</span>
            </div>
            <h1 className="text-3xl font-extrabold text-navy">Privacy Policy & ABDM Consent Governance</h1>
            <p className="text-xs text-typography-secondary">
              Last updated: October 2026 &bull; Compliant with Digital Personal Data Protection (DPDP) Act 2023 and ABDM
              Data Privacy Policies.
            </p>
          </div>

          <div className="space-y-8 text-xs text-typography-secondary leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                1. Separation of MediSync Authentication from ABHA Identity
              </h2>
              <p>
                MediSync strictly distinguishes application account credentials from Ayushman Bharat Health Account
                (ABHA) identities. An ABHA number is never used as a login password. ABHA identity verification is an
                authorized association workflow performed via official server-side APIs only after explicit patient
                consent.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-primary" />
                2. Protection of Aadhaar and Sensitive Authentication Data
              </h2>
              <p>
                In strict adherence to UIDAI and NHA guidelines:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>MediSync never stores complete, unmasked Aadhaar numbers in databases.</li>
                <li>One-Time Passwords (OTPs) and biometric challenges are never logged, persisted, or stored.</li>
                <li>All verification tokens and transaction IDs are ephemeral and governed by time-to-live (TTL) limits.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                3. Consent-Based Health Information Exchange (Milestone 3)
              </h2>
              <p>
                Health information is never shared with third-party hospitals or providers without a valid, cryptographic
                consent artifact issued by the patient through their registered ABHA application. Patients retain the
                unconditional right to:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Approve or deny incoming consent requests.</li>
                <li>Specify the exact categories of data permitted (Prescriptions, Diagnostic Reports, OP Consultations).</li>
                <li>Define the start date, end date, and expiration window for authorized access.</li>
                <li>Revoke active consents at any time, halting future data queries immediately.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                4. Private Medical Document Storage & Encryption
              </h2>
              <p>
                All patient medical documents, lab attachments, and clinical summaries are hosted in private Supabase
                Storage buckets with Row Level Security (RLS) enforcement. No sensitive medical document is ever assigned a
                publicly accessible URL.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                5. Auditability and Immutable Logs
              </h2>
              <p>
                Every clinical record access, prescription dispensing, lab report release, and ABDM data transaction is
                logged into immutable audit trails recording the authenticated clinician ID, timestamp, and purpose of
                access, ensuring complete accountability.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
