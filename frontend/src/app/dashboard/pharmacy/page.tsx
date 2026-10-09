'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { INITIAL_PRESCRIPTIONS } from '@/lib/mockData';
import { Pill, CheckCircle2, PackageCheck, AlertCircle, Clock } from 'lucide-react';

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [selectedRx, setSelectedRx] = useState(INITIAL_PRESCRIPTIONS[1]); // Active prescription
  const [batchNumber, setBatchNumber] = useState('BL-2026-9042');
  const [notice, setNotice] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleDispense = (rxId: string) => {
    setPrescriptions(
      prescriptions.map((rx) =>
        rx.id === rxId ? { ...rx, status: 'DISPENSED' as const } : rx
      )
    );
    if (selectedRx.id === rxId) {
      setSelectedRx({ ...selectedRx, status: 'DISPENSED' });
    }
    triggerNotice(`Prescription ${selectedRx.prescriptionNumber} dispensed under Batch #${batchNumber}. Inventory updated.`);
  };

  return (
    <DashboardLayout
      activeRole="pharmacy"
      userName="Farhan Akhtar, B.Pharm"
      userSubtitle="Pharmacy Operations | Reg: TS-PHARM-8821"
    >
      <div className="space-y-6">
        {notice && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-primary flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Prescription Queue */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-border shadow-card p-5 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="font-bold text-navy text-sm flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                <span>Prescription Queue</span>
              </h2>
              <span className="text-[11px] font-semibold text-typography-secondary bg-surface-muted px-2 py-0.5 rounded-full">
                {prescriptions.length} Orders
              </span>
            </div>

            <div className="space-y-2.5">
              {prescriptions.map((rx) => {
                const isSelected = selectedRx.id === rx.id;
                return (
                  <button
                    key={rx.id}
                    onClick={() => setSelectedRx(rx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1.5 ${
                      isSelected
                        ? 'border-primary bg-primary-50 text-navy shadow-xs'
                        : 'border-border hover:bg-surface-subtle text-typography-main'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-navy">{rx.prescriptionNumber}</span>
                      <StatusBadge status={rx.status} size="sm" />
                    </div>
                    <div className="font-semibold text-navy">{rx.patientName}</div>
                    <div className="text-[11px] text-typography-secondary flex justify-between">
                      <span>Issued: {rx.issueDate}</span>
                      <span>By: {rx.practitionerName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Prescription Dispensing Desk */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-border shadow-card p-6 space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-navy">{selectedRx.prescriptionNumber}</h3>
                  <StatusBadge status={selectedRx.status} size="sm" />
                </div>
                <div className="text-typography-secondary text-[11px] pt-0.5">
                  Patient: <strong className="text-navy">{selectedRx.patientName}</strong> &bull; Clinician:{' '}
                  {selectedRx.practitionerName}
                </div>
              </div>
            </div>

            {/* Prescribed Items Table */}
            <div className="space-y-3">
              <span className="font-bold text-navy text-[11px] uppercase tracking-wider block">
                Prescription Items to Dispense:
              </span>
              <div className="overflow-x-auto bg-surface-muted rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-subtle border-b border-border text-navy font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Medication</th>
                      <th className="py-2.5 px-3">Strength & Form</th>
                      <th className="py-2.5 px-3">Instructions</th>
                      <th className="py-2.5 px-3 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedRx.items.map((item) => (
                      <tr key={item.id} className="hover:bg-white">
                        <td className="py-2.5 px-3 font-bold text-navy">{item.medicationName}</td>
                        <td className="py-2.5 px-3 text-typography-secondary">
                          {item.strength} ({item.dosageForm})
                        </td>
                        <td className="py-2.5 px-3 text-typography-secondary">{item.dosageInstructions}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-navy">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dispensing Action Form */}
            {selectedRx.status === 'ACTIVE' ? (
              <div className="p-4 bg-surface-muted rounded-xl border border-border space-y-3">
                <span className="font-bold text-navy block text-[11px]">Pharmacist Dispensing Verification:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-navy">Medication Batch Number *</label>
                    <input
                      type="text"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary text-xs bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-navy">Pharmacist License ID</label>
                    <input
                      type="text"
                      readOnly
                      value="TS-PHARM-8821"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-slate-100 text-typography-secondary text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDispense(selectedRx.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Confirm & Record Dispensing</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>This digital prescription has been fully dispensed and logged into the hospital inventory audit.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
