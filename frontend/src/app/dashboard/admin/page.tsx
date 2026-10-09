'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { INITIAL_AUDIT_LOGS } from '@/lib/mockData';
import { fetchAbdmStatus } from '@/lib/abdmClient';
import {
  Building2,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Lock,
  RefreshCw,
  Server,
  FileText,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [auditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [abdmStatus, setAbdmStatus] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState(42);

  const checkStatus = async () => {
    setStatusLoading(true);
    const start = Date.now();
    const st = await fetchAbdmStatus();
    setLatencyMs(Date.now() - start || 38);
    setAbdmStatus(st);
    setStatusLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <DashboardLayout
      activeRole="hospital_admin"
      userName="Vikram Malhotra"
      userSubtitle="Hospital Operations Director & ABDM Officer"
    >
      <div className="space-y-6 text-xs">
        {/* Facility Credentials Overview */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center font-bold text-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-navy">MediSync Apex Multi-Specialty Hospital</h1>
                <div className="text-typography-secondary text-xs">
                  HITEC City, Hyderabad &bull; Facility Code: <strong className="font-mono text-navy">FAC-MS-HYD-01</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Health Facility (HFR)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
            <div className="p-3 bg-surface-muted rounded-xl border border-border space-y-1">
              <span className="text-typography-secondary text-[11px] block">ABDM HFR ID</span>
              <span className="font-mono font-bold text-navy text-sm">IN3610001234</span>
            </div>
            <div className="p-3 bg-surface-muted rounded-xl border border-border space-y-1">
              <span className="text-typography-secondary text-[11px] block">Hospital HIP Node</span>
              <span className="font-mono font-semibold text-primary">MEDISYNC_HOSPITAL_HIP_01</span>
            </div>
            <div className="p-3 bg-surface-muted rounded-xl border border-border space-y-1">
              <span className="text-typography-secondary text-[11px] block">Hospital HIU Node</span>
              <span className="font-mono font-semibold text-primary">MEDISYNC_HOSPITAL_HIU_01</span>
            </div>
            <div className="p-3 bg-surface-muted rounded-xl border border-border space-y-1">
              <span className="text-typography-secondary text-[11px] block">Target Gateway URL</span>
              <span className="font-mono text-typography-secondary text-[10px] truncate block">
                https://dev.abdm.gov.in/gateway
              </span>
            </div>
          </div>
        </div>

        {/* Live ABDM Gateway Diagnostics */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-navy">Live ABDM Gateway & Microservice Diagnostics</h2>
            </div>
            <button
              onClick={checkStatus}
              disabled={statusLoading}
              className="px-3 py-1 rounded-lg bg-surface-muted hover:bg-surface-subtle border border-border font-semibold text-[11px] text-navy flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${statusLoading ? 'animate-spin' : ''}`} />
              <span>Ping Gateway</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy text-[11px]">Milestone 1: Identity Service</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-typography-secondary">
                Aadhaar & Mobile OTP verification operational. Token caching active.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy text-[11px]">Milestone 2: Care Contexts (HIP)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-typography-secondary">
                FHIR R4 bundle packaging and linking callback router active.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy text-[11px]">Milestone 3: Health Exchange (HIU)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-typography-secondary">
                Consent artefact verification and Diffie-Hellman encryption ready.
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-primary flex items-center justify-between text-[11px]">
            <span>
              <strong>ABDM Configuration Mode:</strong>{' '}
              {abdmStatus?.mode_label || 'Sandbox Simulation Active'} &bull; Latency: {latencyMs} ms
            </span>
            <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Protocol v0.5 Verified
            </span>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-navy">Security & Compliance Audit Trail</h2>
              <p className="text-[11px] text-typography-secondary">
                Immutable record of clinical document views, prescription dispensing, and ABDM exchanges
              </p>
            </div>
            <span className="text-[11px] font-semibold text-typography-secondary">
              DPDP Act & HIPAA Compliant
            </span>
          </div>

          <div className="overflow-x-auto bg-surface-muted rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-b border-border text-navy font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">User & Role</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Resource</th>
                  <th className="py-2.5 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-typography-secondary">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-navy">{log.userName}</div>
                      <div className="text-[10px] text-typography-secondary capitalize">{log.userRole}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-primary">{log.action}</td>
                    <td className="py-2.5 px-3 font-mono text-typography-secondary text-[11px]">{log.resource}</td>
                    <td className="py-2.5 px-3 text-typography-secondary text-[11px]">{log.details}</td>
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
