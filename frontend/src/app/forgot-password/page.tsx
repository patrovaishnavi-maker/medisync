'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-block">
          <Logo showTagline={true} size="lg" />
        </div>
        <h2 className="text-2xl font-extrabold text-navy">Password Reset Assistance</h2>
        <p className="text-xs text-typography-secondary">
          Enter your registered email address to receive secure password recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-2xl border border-border sm:px-10 space-y-6">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy text-sm">Recovery Link Dispatched</h3>
              <p className="text-xs text-typography-secondary">
                If an account exists for <span className="font-semibold text-navy">{email}</span>, you will receive an
                email with a password reset link shortly.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-navy">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-typography-secondary absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-600 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Send Password Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-border text-xs text-typography-secondary">
            Remembered your credentials?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
