'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Users, ShieldCheck, CheckCircle2, Heart, AlertTriangle, FileText } from 'lucide-react';

export default function FamilyDashboard() {
  const child = {
    fullName: 'Aarav Sharma (Child Dependent)',
    internalPatientId: 'MS-PAT-2026-0003',
    dob: '2018-08-10',
    age: '8 Years',
    gender: 'Male',
    bloodGroup: 'A+',
    allergies: ['Peanuts (Severe)', 'Dust Mites'],
    conditions: ['Allergic Rhinitis'],
  };

  const immunizations = [
    { vaccine: 'MMR Booster (Measles, Mumps, Rubella)', date: '2023-08-15', status: 'COMPLETED', clinician: 'Dr. Priya Nambiar' },
    { vaccine: 'DTP Booster Dose', date: '2023-08-15', status: 'COMPLETED', clinician: 'Dr. Priya Nambiar' },
    { vaccine: 'Oral Polio Vaccine (OPV Booster)', date: '2023-08-15', status: 'COMPLETED', clinician: 'Dr. Priya Nambiar' },
    { vaccine: 'Annual Influenza Vaccine (Quadrivalent)', date: '2025-09-10', status: 'COMPLETED', clinician: 'Dr. Priya Nambiar' },
  ];

  return (
    <DashboardLayout
      activeRole="family_member"
      userName="Sunita Kumar"
      userSubtitle="Guardian & Mother | Proxy ID: GUA-2026-0091"
    >
      <div className="space-y-6 text-xs">
        {/* Child Profile Card */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary flex items-center justify-center font-bold text-lg">
                AS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-navy">{child.fullName}</h1>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-muted text-navy font-semibold border border-border">
                    {child.internalPatientId}
                  </span>
                </div>
                <div className="text-typography-secondary text-xs pt-0.5">
                  Age: {child.age} &bull; DOB: {child.dob} &bull; Blood Group:{' '}
                  <strong className="text-navy">{child.bloodGroup}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Guardian Proxy Active
              </span>
            </div>
          </div>

          {/* Critical Allergy Warning */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>
              <strong>Documented Pediatric Allergies:</strong> {child.allergies.join(', ')}. Epinephrine pen available
              at school desk.
            </span>
          </div>
        </div>

        {/* Immunization & Pediatric Timeline */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-navy">Pediatric Immunization Records</h2>
              <p className="text-[11px] text-typography-secondary">
                Verified vaccination record certified by MediSync Pediatrics
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Up to Date</span>
            </span>
          </div>

          <div className="overflow-x-auto bg-surface-muted rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-b border-border text-navy font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Vaccine / Immunization</th>
                  <th className="py-2.5 px-3">Administered Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Pediatrician</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {immunizations.map((imm, idx) => (
                  <tr key={idx} className="hover:bg-white">
                    <td className="py-2.5 px-3 font-semibold text-navy">{imm.vaccine}</td>
                    <td className="py-2.5 px-3 font-mono text-typography-secondary">{imm.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {imm.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-typography-secondary">{imm.clinician}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
