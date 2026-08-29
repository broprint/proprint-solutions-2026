import { redirect } from 'next/navigation';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { login } from './actions';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/admin/products');

  const { error } = await searchParams;
  const message = error === 'invalid'
    ? 'The email or password is incorrect.'
    : error === 'missing'
      ? 'Enter both your email and password.'
      : null;

  return (
    <main className="min-h-[75vh] bg-slate-50 py-16">
      <div className="container flex justify-center">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b5cff] text-white">
            <LockKeyhole size={22} />
          </div>
          <div className="mt-6 text-[10px] font-black uppercase tracking-[.2em] text-[#0b5cff]">ProPrint V10</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-.04em] text-slate-900">Admin Login</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Sign in with an approved ProPrint administrator account to manage the product catalog.</p>

          {message && <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{message}</div>}

          <form action={login} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-slate-600">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b5cff]" placeholder="admin@proprintsolutions.net" />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-black uppercase tracking-wider text-slate-600">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b5cff]" placeholder="Your password" />
            </div>
            <button type="submit" className="w-full rounded-full bg-[#061321] px-6 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-[#0b5cff]">Sign in to Product Manager</button>
          </form>

          <div className="mt-7 flex gap-3 rounded-2xl bg-blue-50 p-4 text-xs leading-5 text-slate-600">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#0b5cff]" size={18} />
            <span>Catalog management is restricted to authenticated users who are also listed as approved ProPrint administrators.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
