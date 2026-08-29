import Link from 'next/link';
import { ArrowLeft, BadgeCheck, PackageCheck, Truck } from 'lucide-react';
import { CustomerCareForm } from '@/components/CustomerCareForm';

export const metadata = {
  title: 'Customer Care',
  description: 'Warranty support, pickup and delivery requests, and repair status enquiries for ProPrint Solutions Kuwait.',
};

type ServiceKey = 'warranty' | 'pickup' | 'status';

export default async function CustomerCarePage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;
  const requested = params.service;
  const initialService: ServiceKey = requested === 'pickup' || requested === 'status' ? requested : 'warranty';

  return (
    <div className="bg-slate-50">
      <section className="bg-[#061321] py-16 text-white">
        <div className="container">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-200"><ArrowLeft size={16}/>Back to ProPrint</Link>
          <div className="mt-8 max-w-3xl">
            <div className="text-[11px] font-black uppercase tracking-[.2em] text-[#57a7ff]">ProPrint Customer Care</div>
            <h1 className="mt-3 text-4xl font-black tracking-[-.04em] sm:text-5xl">Warranty, pickup and service-status support in one place.</h1>
            <p className="mt-5 max-w-2xl leading-7 text-slate-300">Submit the equipment details and ProPrint can review the request. Live warranty lookup and automated repair tracking will be connected only when approved service systems are available.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div className="space-y-4">
            {[
              [BadgeCheck, 'Warranty Support', 'Provide the brand, model and serial/product number for warranty or post-warranty guidance.'],
              [Truck, 'Pickup & Delivery', 'Request collection of eligible equipment from a Kuwait location. Pickup availability and charges are confirmed by ProPrint.'],
              [PackageCheck, 'Repair Status', 'Use a ProPrint service reference or repair receipt number to request an update.'],
            ].map(([Icon, title, text]) => { const I = Icon as typeof BadgeCheck; return <div key={title as string} className="rounded-2xl border border-slate-200 bg-white p-5"><I className="text-[#0b5cff]"/><h2 className="mt-3 font-black">{title as string}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{text as string}</p></div>; })}
          </div>
          <CustomerCareForm initialService={initialService}/>
        </div>
      </section>
    </div>
  );
}
