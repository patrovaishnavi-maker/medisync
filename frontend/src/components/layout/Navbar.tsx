'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../ui/Logo';
import {
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  User,
  Stethoscope,
  HeartPulse,
  Building2,
  Pill,
  FlaskConical,
  Users,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const demoRoles = [
    { role: 'Patient Hub', href: '/dashboard/patient', icon: User, desc: 'ABHA M1/M2/M3, Records & Consent' },
    { role: 'Doctor Portal', href: '/dashboard/doctor', icon: Stethoscope, desc: 'Consultation, Rx & Health Exchange' },
    { role: 'Nurse & Ward', href: '/dashboard/nurse', icon: HeartPulse, desc: 'Vitals observation & Care tasks' },
    { role: 'Hospital Admin', href: '/dashboard/admin', icon: Building2, desc: 'ABDM Diagnostic & Audit logs' },
    { role: 'Pharmacy', href: '/dashboard/pharmacy', icon: Pill, desc: 'Digital prescriptions & Dispensing' },
    { role: 'Laboratory', href: '/dashboard/laboratory', icon: FlaskConical, desc: 'Lab orders & Report release' },
    { role: 'Family Member', href: '/dashboard/family', icon: Users, desc: 'Dependent proxy health record' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      {/* Top ABDM Sub-bar */}
      <div className="bg-navy px-4 py-1 text-xs text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary-light" />
            <span className="font-medium text-slate-200">
              ABDM Ecosystem Architecture &bull; Milestones 1, 2 & 3 Supported
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300 text-[11px]">
            <span>NHA Sandbox Ready</span>
            <span>&bull;</span>
            <span className="text-emerald-300 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Gateway Operational
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Logo showTagline={true} size="md" />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary font-semibold' : 'text-typography-main'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Demo Roles Quick Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-50 text-primary border border-primary-200 hover:bg-primary-100 transition-colors"
              >
                <span>Live Portals</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-elevated border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-typography-muted uppercase tracking-wider border-b border-border/50">
                    Switch Healthcare Role
                  </div>
                  {demoRoles.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.role}
                        href={item.href}
                        onClick={() => setDemoMenuOpen(false)}
                        className="flex items-start gap-3 px-3 py-2 text-xs hover:bg-surface-muted transition-colors group"
                      >
                        <div className="p-1.5 rounded-lg bg-primary-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-navy group-hover:text-primary">{item.role}</div>
                          <div className="text-[11px] text-typography-secondary">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-navy hover:text-primary px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white bg-primary hover:bg-primary-600 px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-typography-main hover:bg-surface-subtle"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-base font-medium text-navy hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            <div className="text-xs font-semibold text-typography-muted uppercase mb-2">Hospital Portals</div>
            <div className="grid grid-cols-2 gap-2">
              {demoRoles.map((item) => (
                <Link
                  key={item.role}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg bg-surface-muted text-xs font-semibold text-navy hover:bg-primary-50 hover:text-primary"
                >
                  {item.role}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-navy border border-border rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-primary rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
