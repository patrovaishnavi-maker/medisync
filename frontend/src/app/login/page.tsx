'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { DEMO_USERS } from '@/lib/mockData';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  User,
  Stethoscope,
  HeartPulse,
  Building2,
  Pill,
  FlaskConical,
  Users,
  AlertCircle,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('rohan.verma@example.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Route based on role
      const routeMap: Record<string, string> = {
        patient: '/dashboard/patient',
        doctor: '/dashboard/doctor',
        nurse: '/dashboard/nurse',
        hospital_admin: '/dashboard/admin',
        pharmacy: '/dashboard/pharmacy',
        laboratory: '/dashboard/laboratory',
        family_member: '/dashboard/family',
      };
      router.push(routeMap[selectedRole] || '/dashboard/patient');
    }, 600);
  };

  const handleQuickSelect = (roleKey: string, roleRoute: string) => {
    const user = DEMO_USERS[roleKey];
    if (user) {
      setEmail(user.email);
      setSelectedRole(user.role);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-block">
          <Logo showTagline={true} size="lg" />
        </div>
        <h2 className="text-2xl font-extrabold text-navy">Sign in to MediSync Portal</h2>
        <p className="text-xs text-typography-secondary">
          Secure, role-based healthcare portal for patients, clinicians, and hospital staff.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-2xl border border-border sm:px-10 space-y-6">
          {/* ABHA Security Notice */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-navy flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">ABHA Security Notice:</span>
              <p className="text-typography-secondary text-[11px] leading-relaxed">
                MediSync login credentials are not the same as your ABHA number. Do not enter your ABHA number as a
                password. ABHA identity verification is managed securely inside your dashboard.
              </p>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-typography-secondary block">
              One-Click Role Demonstration Login:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSelect('patient', '/dashboard/patient')}
                className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                  selectedRole === 'patient'
                    ? 'border-primary bg-primary-50 text-primary font-bold'
                    : 'border-border hover:bg-surface-subtle text-navy'
                }`}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Patient</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('doctor', '/dashboard/doctor')}
                className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                  selectedRole === 'doctor'
                    ? 'border-primary bg-primary-50 text-primary font-bold'
                    : 'border-border hover:bg-surface-subtle text-navy'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('nurse', '/dashboard/nurse')}
                className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                  selectedRole === 'nurse'
                    ? 'border-primary bg-primary-50 text-primary font-bold'
                    : 'border-border hover:bg-surface-subtle text-navy'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Nurse</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('hospital_admin', '/dashboard/admin')}
                className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                  selectedRole === 'hospital_admin'
                    ? 'border-primary bg-primary-50 text-primary font-bold'
                    : 'border-border hover:bg-surface-subtle text-navy'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('pharmacy', '/dashboard/pharmacy')}
                className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                  selectedRole === 'pharmacy'
                    ? 'border-primary bg-primary-50 text-primary font-bold'
                    : 'border-border hover:bg-surface-subtle text-navy'
                }`}
              >
                <Pill className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Pharmacy</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('laboratory', '/dashboard/laboratory')}
                className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                  selectedRole === 'laboratory'
                    ? 'border-primary bg-primary-50 text-primary font-bold'
                    : 'border-border hover:bg-surface-subtle text-navy'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Lab</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('family_member', '/dashboard/family')}
                className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                  selectedRole === 'family_member'
                    ? 'border-primary bg-primary-50 text-primary font-bold'
                    : 'border-border hover:bg-surface-subtle text-navy'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Family</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-navy">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-typography-secondary absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-navy">Password</label>
                <Link href="/forgot-password" className="text-primary hover:underline text-[11px]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-typography-secondary absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-600 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole.replace('_', ' ')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border text-xs text-typography-secondary">
            Need a new patient chart?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
