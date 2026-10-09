import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Award, Heart, Building2, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-semibold border border-primary-200">
              <ShieldCheck className="w-4 h-4" />
              <span>About MediSync</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
              Connecting Care Across India&rsquo;s Digital Health Ecosystem
            </h1>
            <p className="text-sm sm:text-base text-typography-secondary leading-relaxed">
              MediSync is an enterprise hospital information and patient management platform designed specifically to
              bridge hospital clinical operations with the National Health Authority&rsquo;s Ayushman Bharat Digital
              Mission (ABDM).
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-surface-muted border border-border space-y-3">
              <div className="p-2.5 rounded-xl bg-primary-50 text-primary w-fit">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy text-base">Patient-Centric Autonomy</h3>
              <p className="text-xs text-typography-secondary leading-relaxed">
                Empowering patients to own their health records through verified ABHA identities and explicit, granular
                consent controls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-muted border border-border space-y-3">
              <div className="p-2.5 rounded-xl bg-secondary-light text-secondary w-fit">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy text-base">Hospital EMR Excellence</h3>
              <p className="text-xs text-typography-secondary leading-relaxed">
                Full-spectrum clinical tooling including OPD encounters, digital prescriptions, inpatient flow charts,
                pharmacy dispensing, and laboratory diagnostics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-muted border border-border space-y-3">
              <div className="p-2.5 rounded-xl bg-navy-50 text-navy w-fit">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy text-base">ABDM Standards Compliance</h3>
              <p className="text-xs text-typography-secondary leading-relaxed">
                Engineered to conform with ABDM Milestone 1 (M1), Milestone 2 (M2 HIP), and Milestone 3 (M3 HIU)
                specifications using FHIR R4 schemas.
              </p>
            </div>
          </div>

          {/* Interoperability Statement */}
          <div className="p-8 rounded-2xl bg-surface-muted border border-border space-y-4">
            <h2 className="text-xl font-bold text-navy">Our ABDM Interoperability Vision</h2>
            <p className="text-xs text-typography-secondary leading-relaxed">
              In traditional healthcare systems, medical history is trapped within individual hospital silos. MediSync
              ensures that when a patient visits our hospital, their verified ABHA identity enables authorized clinicians
              to link encounters into care contexts and request external historical records with verified patient
              consent.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-typography-secondary">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Zero vendor lock-in via open FHIR R4 clinical bundles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>End-to-end cryptographic signature verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Strict privacy controls adhering to DPDP Act 2023</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Air-gapped separation between credentials and user auth</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
