import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { ShieldCheck, Lock, CheckCircle2, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-slate-300 border-t border-border">
      {/* ABDM Interoperability Trust Banner */}
      <div className="border-b border-navy-500/40 bg-navy-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              <div>
                <span className="font-semibold text-white block">ABDM Interoperable</span>
                <span className="text-slate-400">Milestones 1, 2, & 3 Ready</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-secondary" />
              <div>
                <span className="font-semibold text-white block">DPDP Act Compliant</span>
                <span className="text-slate-400">End-to-End Consent Architecture</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <div>
                <span className="font-semibold text-white block">FHIR R4 Profiles</span>
                <span className="text-slate-400">Clinical Data Standardization</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-secondary" />
              <div>
                <span className="font-semibold text-white block">Role-Based Privacy</span>
                <span className="text-slate-400">Isolated Provider & Patient Portals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
              <Logo showTagline={true} size="md" />
            </div>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              MediSync is an enterprise hospital healthcare platform purpose-built for India&rsquo;s Ayushman Bharat Digital
              Mission (ABDM). We unify hospital records, digital prescriptions, laboratory workflows, and verified ABHA
              identities under consent-based healthcare standards.
            </p>
            <div className="text-[11px] text-slate-400 border-l-2 border-primary pl-3 py-1 bg-white/5 rounded-r">
              <strong>Notice:</strong> MediSync is engineered for ABHA/ABDM interoperability. Active live exchange requires
              authorized National Health Authority (NHA) facility credentials and sandbox/production verification.
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About MediSync
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features & Modules
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  ABDM Workflow Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Hospital
                </Link>
              </li>
            </ul>
          </div>

          {/* Hospital Portals */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Hospital Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard/patient" className="hover:text-white transition-colors">
                  Patient ABHA Hub
                </Link>
              </li>
              <li>
                <Link href="/dashboard/doctor" className="hover:text-white transition-colors">
                  Doctor Clinical Desk
                </Link>
              </li>
              <li>
                <Link href="/dashboard/nurse" className="hover:text-white transition-colors">
                  Ward & ICU Observations
                </Link>
              </li>
              <li>
                <Link href="/dashboard/pharmacy" className="hover:text-white transition-colors">
                  Pharmacy Dispensing
                </Link>
              </li>
              <li>
                <Link href="/dashboard/laboratory" className="hover:text-white transition-colors">
                  Pathology & Lab Orders
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-white transition-colors">
                  Hospital Admin & Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Compliance & Security</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Clinical Service
                </Link>
              </li>
              <li>
                <span className="text-slate-400 block">ABDM HIP/HIU Specification v0.5</span>
              </li>
              <li>
                <span className="text-slate-400 block">ISO 27001 Architecture</span>
              </li>
              <li>
                <span className="text-slate-400 block">DPDP Act (India) Compliance</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-navy-500/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} MediSync Healthcare Technologies. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <span>Tagline: &ldquo;Connected Care. Healthier Lives.&rdquo;</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
