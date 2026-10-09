'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { ShieldCheck, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: 'Spouse',
    allergies: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `MS-PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSuccessId(generatedId);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-block">
          <Logo showTagline={true} size="lg" />
        </div>
        <h2 className="text-2xl font-extrabold text-navy">Hospital Patient Registration</h2>
        <p className="text-xs text-typography-secondary">
          Register with MediSync Apex Hospital. You will receive an internal hospital patient ID.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-2xl border border-border sm:px-10 space-y-6">
          {successId ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-navy">Registration Successful!</h3>
              <p className="text-xs text-typography-secondary max-w-md mx-auto">
                Your hospital electronic medical chart has been initialized.
              </p>
              <div className="p-4 rounded-xl bg-surface-muted border border-border inline-block text-left text-xs space-y-1">
                <div>
                  <span className="text-typography-secondary">Internal Patient ID: </span>
                  <span className="font-mono font-bold text-primary">{successId}</span>
                </div>
                <div>
                  <span className="text-typography-secondary">ABHA Link Status: </span>
                  <span className="font-semibold text-slate-600">Not connected (Verification Pending)</span>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => router.push('/dashboard/patient')}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-600 shadow-sm"
                >
                  Proceed to Patient ABHA Hub &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-200 text-primary flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Hospital Registration Notice:</strong> This creates your hospital electronic health profile.
                  You can connect your verified ABHA identity via OTP challenge after logging into your dashboard.
                </p>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-navy text-xs uppercase tracking-wider border-b border-border pb-1">
                  Demographic Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Verma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary bg-white"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary bg-white"
                    >
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-navy text-xs uppercase tracking-wider border-b border-border pb-1">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91-9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Email Address</label>
                    <input
                      type="email"
                      placeholder="patient@example.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-navy">Residential Address</label>
                    <input
                      type="text"
                      placeholder="Street address, City, Pincode"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-3">
                <h4 className="font-bold text-navy text-xs uppercase tracking-wider border-b border-border pb-1">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Contact Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kavita Verma"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="+91-9876543299"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Relationship</label>
                    <select
                      value={formData.emergencyContactRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary bg-white"
                    >
                      <option>Spouse</option>
                      <option>Parent</option>
                      <option>Child</option>
                      <option>Sibling</option>
                      <option>Guardian</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-600 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Generating Patient Profile...</span>
                ) : (
                  <>
                    <span>Complete Hospital Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-border text-xs text-typography-secondary">
            Already have a hospital chart?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in to portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
