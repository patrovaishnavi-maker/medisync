import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FileText, ShieldAlert, Award, Stethoscope, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-semibold border border-primary-200">
              <FileText className="w-4 h-4" />
              <span>Terms of Clinical Service</span>
            </div>
            <h1 className="text-3xl font-extrabold text-navy">Platform Terms of Use & Clinical Governance</h1>
            <p className="text-xs text-typography-secondary">
              Effective Date: October 2026 &bull; MediSync Healthcare Technologies
            </p>
          </div>

          <div className="space-y-8 text-xs text-typography-secondary leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                1. Electronic Health Records & Practitioner Accountability
              </h2>
              <p>
                All electronic medical records, clinical notes, and digital prescriptions entered into MediSync must be
                authored by registered and verified healthcare practitioners. Practitioners are solely responsible for the
                accuracy of provisional diagnoses, treatment plans, and prescribed medications.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                2. AI Clinical Summarization Disclaimer
              </h2>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <p className="font-semibold">Mandatory Clinical Advisory:</p>
                <p>
                  MediSync AI summarizes clinical history for informational reference and workflow acceleration only. It
                  is not an autonomous medical device, does not diagnose disease, and cannot independently issue
                  prescriptions. Clinicians must always verify raw underlying medical documents prior to making clinical
                  decisions.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" />
                3. Demonstration Data & Emergency Disclaimers
              </h2>
              <p>
                MediSync includes demo and training modes utilizing synthetic healthcare records. Synthetic telemetry and
                vital signs must never be confused with live patient monitoring. MediSync is an enterprise hospital
                record and ABDM gateway system and is not certified as an emergency telemetry alert device.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                4. ABDM Sandbox and Production Operation
              </h2>
              <p>
                Participation in national health data exchange requires valid facility accreditation in the ABDM Health
                Facility Registry (HFR). MediSync facilitates gateway communication in sandbox environments for
                development and testing. Production transmission is activated only following official NHA security audits
                and onboarding clearance.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
