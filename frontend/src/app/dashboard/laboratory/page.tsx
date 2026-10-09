'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { INITIAL_LAB_REPORTS } from '@/lib/mockData';
import { FlaskConical, CheckCircle2, ShieldCheck, FileCheck, AlertCircle, Plus } from 'lucide-react';

export default function LaboratoryDashboard() {
  const [reports, setReports] = useState(INITIAL_LAB_REPORTS);
  const [selectedReport, setSelectedReport] = useState(INITIAL_LAB_REPORTS[0]);
  const [conclusionInput, setConclusionInput] = useState(selectedReport.conclusion);
  const [notice, setNotice] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleReleaseReport = (reportId: string) => {
    setReports(
      reports.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'RELEASED' as const,
              releasedAt: new Date().toISOString(),
              conclusion: conclusionInput,
            }
          : r
      )
    );
    setSelectedReport({
      ...selectedReport,
      status: 'RELEASED',
      releasedAt: new Date().toISOString(),
      conclusion: conclusionInput,
    });
    triggerNotice(`Laboratory Report ${selectedReport.orderNumber} signed and released to patient records.`);
  };

  return (
    <DashboardLayout
      activeRole="laboratory"
      userName="Dr. Sunita Kulkarni"
      userSubtitle="Laboratory & Diagnostic Services Head"
    >
      <div className="space-y-6">
        {notice && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-primary flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order Queue */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-border shadow-card p-5 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="font-bold text-navy text-sm flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-primary" />
                <span>Diagnostic Worklist</span>
              </h2>
              <span className="text-[11px] font-semibold text-typography-secondary bg-surface-muted px-2 py-0.5 rounded-full">
                {reports.length} Tests
              </span>
            </div>

            <div className="space-y-2.5">
              {reports.map((r) => {
                const isSelected = selectedReport.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedReport(r);
                      setConclusionInput(r.conclusion);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1.5 ${
                      isSelected
                        ? 'border-primary bg-primary-50 text-navy shadow-xs'
                        : 'border-border hover:bg-surface-subtle text-typography-main'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-navy">{r.orderNumber}</span>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <div className="font-semibold text-navy">{r.testName}</div>
                    <div className="text-[11px] text-typography-secondary flex justify-between">
                      <span>Patient: {r.patientName}</span>
                      <span>Reviewer: {r.reviewedByDoctorName?.split(',')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Parameters & Verification Desk */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-border shadow-card p-6 space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-navy">{selectedReport.testName}</h3>
                  <StatusBadge status={selectedReport.status} size="sm" />
                </div>
                <div className="text-typography-secondary text-[11px] pt-0.5">
                  Order ID: <strong className="font-mono text-navy">{selectedReport.orderNumber}</strong> &bull; Patient:{' '}
                  <strong>{selectedReport.patientName}</strong>
                </div>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="space-y-3">
              <span className="font-bold text-navy text-[11px] uppercase tracking-wider block">
                Recorded Biochemical & Hematological Values:
              </span>
              <div className="overflow-x-auto bg-surface-muted rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-subtle border-b border-border text-navy font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3">Result</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3">Reference Baseline</th>
                      <th className="py-2.5 px-3 text-right">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedReport.results.map((res, idx) => (
                      <tr key={idx} className="hover:bg-white">
                        <td className="py-2.5 px-3 font-medium text-navy">{res.parameter}</td>
                        <td className="py-2.5 px-3 font-bold text-navy">{res.value}</td>
                        <td className="py-2.5 px-3 text-typography-secondary">{res.unit}</td>
                        <td className="py-2.5 px-3 text-typography-muted">{res.reference}</td>
                        <td className="py-2.5 px-3 text-right">
                          {res.flag === 'HIGH' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              HIGH
                            </span>
                          )}
                          {res.flag === 'NORMAL' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              NORMAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pathologist Conclusion */}
            <div className="space-y-1.5">
              <label className="font-semibold text-navy">Pathologist Clinical Interpretation & Conclusion</label>
              <textarea
                rows={3}
                value={conclusionInput}
                onChange={(e) => setConclusionInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border focus:border-primary text-xs"
              />
            </div>

            {/* Release Action */}
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[11px] text-typography-secondary">
                Verified digital signature will be embedded onto FHIR DiagnosticReport bundle.
              </span>

              <button
                onClick={() => handleReleaseReport(selectedReport.id)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Digitally Sign & Release Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
