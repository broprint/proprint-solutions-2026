import Link from 'next/link';
import { ArrowRight, BadgeCheck, Clock3, PackageCheck, ShieldCheck, Truck, Wrench, Building2 } from 'lucide-react';

const items = [
  { icon: BadgeCheck, title: 'Warranty Support', text: 'Submit brand, model and serial number for warranty or post-warranty support guidance.', href: '/customer-care?service=warranty', action: 'Check warranty options' },
  { icon: Truck, title: 'Pickup & Delivery', text: 'Request collection of eligible equipment from your Kuwait location for service.', href: '/customer-care?service=pickup', action: 'Request pickup' },
  { icon: PackageCheck, title: 'Repair Status', text: 'Request an update using your ProPrint service reference or repair details.', href: '/customer-care?service=status', action: 'Check repair status' },
  { icon: Wrench, title: 'Book a Repair', text: 'Start a service request for computers, printers, plotters, servers and other equipment.', href: '/service', action: 'Book service' },
  { icon: ShieldCheck, title: 'AMC Support', text: 'Maintenance plans for business IT, printing and technical environments.', href: '/amc', action: 'View AMC support' },
  { icon: Building2, title: 'Enterprise Support', text: 'Onsite field services, infrastructure support and business IT requirements.', href: '/enterprise', action: 'View enterprise services' },
];

export function CustomerServiceHub() {
  return (
    <section className="bg-slate-50 py-20" id="customer-care">
      <div className="container">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[.2em] text-[#0b5cff]">Customer Service Hub</div>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.03em] md:text-5xl">Sales support does not stop after delivery.</h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">Choose exactly what you need below. Each option takes you directly to the relevant ProPrint support page.</p>
          </div>
          <Link href="/customer-care" className="inline-flex items-center gap-2 self-start rounded-full bg-[#0b5cff] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#094ed6]">Open Customer Care Portal <ArrowRight size={16}/></Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text, href, action }) => (
            <Link key={title} href={href} className="group rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0b5cff]"><Icon size={24}/></div>
              <h3 className="mt-5 text-lg font-black text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-[#0b5cff] transition group-hover:bg-blue-100">{action} <ArrowRight size={13}/></span>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <Clock3 className="mt-0.5 shrink-0" size={18}/>
          <p><b>Management demo:</b> warranty verification, pickup availability and live repair tracking are request-based until the production service database and approved operating rules are connected.</p>
        </div>
      </div>
    </section>
  );
}
