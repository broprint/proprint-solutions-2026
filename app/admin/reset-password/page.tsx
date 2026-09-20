'use client';

import { FormEvent, useEffect, useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setReady(Boolean(data.session));
    };

    void checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setMessage('Use a password with at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('The passwords do not match.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    await supabase.auth.signOut();
    router.replace('/admin/login?status=password-reset');
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 py-16">
      <div className="container flex justify-center">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b5cff] text-white">
            <KeyRound size={22} />
          </div>
          <div className="mt-6 text-[10px] font-black uppercase tracking-[.2em] text-[#0b5cff]">ProPrint V10</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-.04em] text-slate-900">Set New Password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Choose a new password for your ProPrint administrator account.
          </p>

          {!ready ? (
            <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
              Open this page using the newest password recovery link from your email.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {message && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{message}</div>}
              <div>
                <label htmlFor="password" className="text-xs font-black uppercase tracking-wider text-slate-600">New password</label>
                <input id="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b5cff]" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-wider text-slate-600">Confirm password</label>
                <input id="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b5cff]" />
              </div>
              <button type="submit" disabled={saving} className="w-full rounded-full bg-[#061321] px-6 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-[#0b5cff] disabled:opacity-60">
                {saving ? 'Updating password…' : 'Update password'}
              </button>
            </form>
          )}

          <div className="mt-7 flex gap-3 rounded-2xl bg-blue-50 p-4 text-xs leading-5 text-slate-600">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#0b5cff]" size={18} />
            <span>Only a valid Supabase password-recovery session can update the administrator password.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
