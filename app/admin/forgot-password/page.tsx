'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSending(true);

    const redirectTo = `${window.location.origin}/admin/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

    setSending(false);
    if (resetError) {
      if (resetError.status === 429) {
        setError('Too many password reset attempts. Please wait before requesting another recovery email.');
      } else {
        setError('Unable to send the recovery email right now. Please try again later.');
      }
      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 py-16">
      <div className="container flex justify-center">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b5cff] text-white">
            <KeyRound size={22} />
          </div>
          <div className="mt-6 text-[10px] font-black uppercase tracking-[.2em] text-[#0b5cff]">ProPrint V10</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-.04em] text-slate-900">Forgot Password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Enter your ProPrint administrator email address and we will send a secure password recovery link.</p>

          {sent ? (
            <div className="mt-7">
              <div className="rounded-2xl bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 shrink-0" size={20} />
                  <div><b>Check your email.</b><br />If the address is registered, use the newest ProPrint password recovery email to continue.</div>
                </div>
              </div>
              <Link href="/admin/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-black text-[#0b5cff] hover:underline"><ArrowLeft size={16}/> Back to Admin Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-slate-600">Administrator Email</label>
                <input id="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b5cff]" placeholder="admin@proprintsolutions.net" />
              </div>
              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}
              <button disabled={sending} type="submit" className="w-full rounded-full bg-[#061321] px-6 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-[#0b5cff] disabled:cursor-not-allowed disabled:opacity-60">{sending ? 'Sending recovery email…' : 'Send Password Recovery'}</button>
              <Link href="/admin/login" className="flex items-center justify-center gap-2 text-xs font-bold text-[#0b5cff] hover:underline"><ArrowLeft size={14}/> Back to Admin Login</Link>
            </form>
          )}

          <div className="mt-7 flex gap-3 rounded-2xl bg-blue-50 p-4 text-xs leading-5 text-slate-600">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#0b5cff]" size={18}/>
            <span>The recovery link returns to ProPrint's secure Set New Password page. For security, use only the newest recovery email.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
