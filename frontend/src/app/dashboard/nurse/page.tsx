'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { INITIAL_VITALS, INITIAL_CARE_TASKS } from '@/lib/mockData';
import {
  HeartPulse,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Clock,
  User,
  ShieldAlert,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function NurseDashboard() {
  const [vitalsList, setVitalsList] = useState(INITIAL_VITALS);
  const [tasksList, setTasksList] = useState(INITIAL_CARE_TASKS);

  // New vital entry state
  const [newHR, setNewHR] = useState('82');
  const [newSys, setNewSys] = useState('120');
  const [newDia, setNewDia] = useState('78');
  const [newSpO2, setNewSpO2] = useState('98');
  const [newTemp, setNewTemp] = useState('37.1');
  const [newNotes, setNewNotes] = useState('Patient resting comfortably; stable vital parameters.');
  const [notice, setNotice] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleRecordVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: 'vo-new-' + Math.random().toString(36).substring(2, 9),
      patientId: 'd0000000-0000-0000-0000-000000000002',
      patientName: 'Anita Desai',
      recordedBy: 'Staff Nurse Ananya Roy, RN',
      heartRate: parseInt(newHR) || 80,
      systolicBp: parseInt(newSys) || 120,
      diastolicBp: parseInt(newDia) || 80,
      respiratoryRate: 18,
      spo2: parseInt(newSpO2) || 98,
      temperature: parseFloat(newTemp) || 37.0,
      bloodGlucose: 115,
      painScore: 1,
      consciousnessLevel: 'Alert',
      notes: newNotes,
      recordedAt: new Date().toISOString(),
      isSyntheticDemo: true,
    };
    setVitalsList([...vitalsList, newEntry]);
    triggerNotice('Vital observations recorded and updated in inpatient flow sheet.');
  };

  const handleCompleteTask = (taskId: string) => {
    setTasksList(
      tasksList.map((t) => (t.id === taskId ? { ...t, status: 'COMPLETED' as const } : t))
    );
    triggerNotice('Care task marked as COMPLETED.');
  };

  // Recharts chart data format
  const chartData = vitalsList.map((v, i) => ({
    time: `T-${vitalsList.length - i} (${v.recordedAt.slice(11, 16)})`,
    HeartRate: v.heartRate,
    SystolicBP: v.systolicBp,
    SpO2: v.spo2,
    Temp: v.temperature * 2.5, // scaled for chart visibility
  }));

  return (
    <DashboardLayout
      activeRole="nurse"
      userName="Staff Nurse Ananya Roy, RN"
      userSubtitle="Ward 3B: Inpatient & ICU Care | Unit Head"
    >
      <div className="space-y-6">
        {notice && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-primary flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Inpatient Banner */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
                3B
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-navy">Anita Desai &bull; Bed 302-B</h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-muted font-mono text-navy font-semibold">
                    MS-PAT-2026-0002
                  </span>
                </div>
                <div className="text-xs text-typography-secondary pt-0.5">
                  Admitted: 07 Oct 2026 &bull; Primary Clinician: Dr. Priya Nambiar, MD (Pulmonology) &bull; Diagnosis:{' '}
                  <strong className="text-navy">Bacterial Bronchopneumonia</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Inpatient Therapy Active
              </span>
            </div>
          </div>

          {/* Telemetry Advisory */}
          <div className="p-3 bg-surface-muted rounded-xl border border-border text-[11px] text-typography-secondary flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Telemetry Disclaimer:</strong> Demonstration observations utilize synthetic clinical
              data. MediSync is an electronic inpatient flow-sheet and ABDM linking platform; not a certified ICU
              emergency alarm monitor.
            </span>
          </div>
        </div>

        {/* Vital Trends Chart & Rapid Entry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recharts Flowsheet Graph */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-navy text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span>Longitudinal Vital Sign Flow Sheet (SpO2, HR, BP)</span>
              </h3>
              <span className="text-[11px] text-typography-secondary">Updated real time</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[60, 150]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DCE7F3', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="SystolicBP" stroke="#1769D2" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="HeartRate" stroke="#E11D48" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="SpO2" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Vital Entry Form */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-border shadow-card p-5 space-y-4 text-xs">
            <div className="border-b border-border pb-2">
              <h3 className="font-bold text-navy text-sm">Log Bedside Observation</h3>
              <span className="text-[11px] text-typography-secondary">Records nurse vital parameters</span>
            </div>

            <form onSubmit={handleRecordVitals} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-navy">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={newHR}
                    onChange={(e) => setNewHR(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-navy">SpO2 (%)</label>
                  <input
                    type="number"
                    value={newSpO2}
                    onChange={(e) => setNewSpO2(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-navy">BP Systolic</label>
                  <input
                    type="number"
                    value={newSys}
                    onChange={(e) => setNewSys(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-navy">BP Diastolic</label>
                  <input
                    type="number"
                    value={newDia}
                    onChange={(e) => setNewDia(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-navy">Body Temp (&deg;C)</label>
                <input
                  type="text"
                  value={newTemp}
                  onChange={(e) => setNewTemp(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border focus:border-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-navy">Clinical Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 transition-colors shadow-xs"
              >
                Log Vital Sign Entry
              </button>
            </form>
          </div>
        </div>

        {/* Scheduled Care Tasks List */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4 text-xs">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-bold text-navy text-sm">Scheduled Ward Care Tasks & Medication Administration</h3>
            <span className="text-[11px] text-typography-secondary">Assigned nurse workflow checklist</span>
          </div>

          <div className="space-y-3">
            {tasksList.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-border bg-surface-muted flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy">{t.taskTitle}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'HIGH'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-primary border border-blue-200'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                  <p className="text-typography-secondary text-[11px]">{t.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={t.status} size="sm" />
                  {t.status === 'PENDING' && (
                    <button
                      onClick={() => handleCompleteTask(t.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
