'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { UserRole } from '@/lib/types';
import {
  User,
  Stethoscope,
  HeartPulse,
  Building2,
  Pill,
  FlaskConical,
  Users,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Activity,
  Layers,
  Bell,
  Sparkles,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  userName?: string;
  userSubtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeRole,
  userName = 'Rohan Verma',
  userSubtitle = 'Patient ID: MS-PAT-2026-0001',
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles = [
    { role: 'patient' as UserRole, name: 'Patient Hub', path: '/dashboard/patient', icon: User },
    { role: 'doctor' as UserRole, name: 'Doctor Clinical Desk', path: '/dashboard/doctor', icon: Stethoscope },
    { role: 'nurse' as UserRole, name: 'Nurse & Ward Vitals', path: '/dashboard/nurse', icon: HeartPulse },
    { role: 'hospital_admin' as UserRole, name: 'Hospital Admin & ABDM', path: '/dashboard/admin', icon: Building2 },
    { role: 'pharmacy' as UserRole, name: 'Pharmacy Dispensing', path: '/dashboard/pharmacy', icon: Pill },
    { role: 'laboratory' as UserRole, name: 'Laboratory & Pathology', path: '/dashboard/laboratory', icon: FlaskConical },
    { role: 'family_member' as UserRole, name: 'Family Dependent View', path: '/dashboard/family', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted text-typography-main">
      {/* Top Demo Banner */}
      <div className="bg-gradient-to-r from-navy to-primary px-4 py-1.5 text-white text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 font-extrabold text-[10px] tracking-wide uppercase">
              Demo Mode
            </span>
            <span className="text-[11px] font-medium text-slate-200">
              Synthetic Hospital Records &bull; Official ABDM Gateway Simulation Active
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-300 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ABDM Sandbox: Responsive
            </span>
            <span>&bull;</span>
            <span className="text-slate-300">HIP: MEDISYNC_HOSPITAL_HIP_01</span>
          </div>
        </div>
      </div>

      {/* Main App Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Logo size="sm" showTagline={false} href="/" />

              {/* Active Role Badge & Switcher */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-50 text-primary border border-primary-200 hover:bg-primary-100 transition-colors text-xs font-semibold"
                >
                  <span className="capitalize">{activeRole.replace('_', ' ')} Portal</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {roleMenuOpen && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-elevated border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setRoleMenuOpen(false)}
                  >
                    <div className="px-3 py-1 text-[11px] font-semibold text-typography-muted uppercase tracking-wider">
                      Switch Role Portal
                    </div>
                    {roles.map((r) => {
                      const IconComp = r.icon;
                      const isActive = r.role === activeRole;
                      return (
                        <Link
                          key={r.role}
                          href={r.path}
                          onClick={() => setRoleMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                            isActive
                              ? 'bg-primary-50 text-primary font-bold'
                              : 'text-navy hover:bg-surface-subtle'
                          }`}
                        >
                          <IconComp className="w-4 h-4 shrink-0" />
                          <span>{r.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-navy">{userName}</span>
                <span className="text-[11px] text-typography-secondary font-mono">{userSubtitle}</span>
              </div>

              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary flex items-center justify-center font-bold text-xs border border-primary-200">
                {userName.charAt(0)}
              </div>

              <button
                onClick={() => router.push('/login')}
                title="Sign out to Login"
                className="p-1.5 text-typography-secondary hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-border py-4 text-center text-xs text-typography-secondary">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>MediSync &bull; Ayushman Bharat Digital Mission (ABDM) Healthcare Platform</span>
          <span className="text-[11px] text-typography-muted">
            Designed for NHA Sandbox &bull; Connected Care. Healthier Lives.
          </span>
        </div>
      </footer>
    </div>
  );
};
