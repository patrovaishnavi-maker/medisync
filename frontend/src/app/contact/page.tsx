import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Phone, Mail, MapPin, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-semibold border border-primary-200">
              <Phone className="w-4 h-4" />
              <span>Contact MediSync</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">Get in Touch with Our Team</h1>
            <p className="text-sm text-typography-secondary">
              Whether you need medical assistance, technical support for ABHA linking, or hospital administrative
              inquiries, we are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-6 rounded-2xl bg-surface-muted border border-border space-y-3">
              <div className="p-2.5 rounded-xl bg-primary-50 text-primary w-fit">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy text-sm">Hospital Facility</h3>
              <p className="text-typography-secondary leading-relaxed">
                MediSync Apex Multi-Specialty Hospital<br />
                Plot 42, Health City, HITEC City<br />
                Hyderabad, Telangana - 500081<br />
                <span className="font-semibold text-primary">ABDM Facility ID: IN3610001234</span>
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-muted border border-border space-y-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 w-fit">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy text-sm">Helplines & Emergency</h3>
              <p className="text-typography-secondary leading-relaxed">
                Emergency 24x7: <span className="font-bold text-navy">+91-40-2345-9999</span><br />
                OPD Appointments: <span className="text-navy">+91-40-2345-6789</span><br />
                ABHA Desk Support: <span className="text-navy">+91-40-2345-6700</span><br />
                National ABDM Toll-Free: 1800-11-4477
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-muted border border-border space-y-3">
              <div className="p-2.5 rounded-xl bg-secondary-light text-secondary w-fit">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy text-sm">Digital Support</h3>
              <p className="text-typography-secondary leading-relaxed">
                Patient Inquiries: support@medisync.in<br />
                ABDM Integration: abdm-desk@medisync.in<br />
                Clinical Administration: ops@medisync.in<br />
                Grievance Officer: privacy@medisync.in
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 rounded-2xl bg-white border border-border shadow-card max-w-2xl mx-auto space-y-4">
            <h3 className="text-lg font-bold text-navy">Send an Inquiry or Feedback</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-navy">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rohan Verma"
                  className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-navy">Phone or Email</label>
                <input
                  type="text"
                  placeholder="e.g. rohan@example.in"
                  className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-navy">Inquiry Category</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-primary bg-white">
                <option>ABHA Identity & Linking Assistance</option>
                <option>Doctor Consultation / Appointment</option>
                <option>Medical Record Retrieval</option>
                <option>Laboratory Report Query</option>
                <option>General Administration</option>
              </select>
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-navy">Message</label>
              <textarea
                rows={4}
                placeholder="Describe your inquiry..."
                className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-600 transition-colors"
            >
              Submit Inquiry
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
