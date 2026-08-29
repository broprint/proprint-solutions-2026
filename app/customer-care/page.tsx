import Link from 'next/link';
import { ArrowLeft, BadgeCheck, ExternalLink, PackageCheck, Truck } from 'lucide-react';
import { CustomerCareForm } from '@/components/CustomerCareForm';

export const metadata = {
  title: 'Customer Care',
  description: 'Warranty support, pickup and delivery requests, and repair status enquiries for ProPrint Solutions Kuwait.',
};

type ServiceKey = 'warranty' | 'pickup' | 'status';

const warrantyLinks = [
  { brand: 'HP', label: 'HP Warranty Check', href: 'https://support.hp.com/emea_middle_east-en/check-warranty', hint: 'Serial number + country/region of purchase' },
  { brand: 'Lenovo', label: 'Lenovo Warranty Lookup', href: 'https://support.lenovo.com/kw/en/warranty-upgrade-and-services/', hint: 'PCs, workstations, servers and other Lenovo devices' },
  { brand: 'Dell', label: 'Dell Warranty & Support', href: 'https://www.dell.com/support/home/en-kw', hint: 'Use the Dell Service Tag or Product ID' },
  { brand: 'Epson', label: 'Epson Warranty Check', href: 'https://warrantycheck.epson.eu/', hint: 'Use the Epson serial number' },
];

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
            <p className="mt-5 max-w-2xl leading-7 text-slate-300">Check supported manufacturer warranty portals or submit equipment details to ProPrint for assistance. Manufacturer warranty status is determined by the manufacturer, not by this website.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="mb-10 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-1 shrink-0 text-[#0b5cff]" size={28}/>
              <div>
                <div className="text-[11px] font-black uppercase tracking-[.18em] text-[#0b5cff]">Official Manufacturer Portals</div>
                <h2 className="mt-2 text-2xl font-black tracking-[-.03em]">Check your device warranty</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Select your brand to open its official warranty/support website in a new tab. Keep the device serial number, product number or Service Tag ready.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {warrantyLinks.map((item) => (
                <a key={item.brand} href={item.href} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50">
                  <div className="flex items-center justify-between gap-3"><span className="text-lg font-black text-slate-900">{item.brand}</span><ExternalLink size={16} className="text-[#0b5cff]"/></div>
                  <div className="mt-2 text-sm font-black text-[#0b5cff]">{item.label}</div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{item.hint}</p>
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">External warranty results are provided by the respective manufacturer. If you need help identifying the product or arranging service, submit a ProPrint Warranty Support request below.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
            <div className="space-y-4">
              {[
                [BadgeCheck, 'Warranty Support', 'Provide the brand, model and serial/product number for warranty or post-warranty guidance.'],
                [Truck, 'Pickup & Delivery', 'Request collection of eligible equipment from a Kuwait location. Pickup availability and charges are confirmed by ProPrint.'],
                [PackageCheck, 'Repair Status', 'Use a ProPrint service reference or repair receipt number to request an update.'],
              ].map(([Icon, title, text]) => { const I = Icon as typeof BadgeCheck; return <div key={title as string} className="rounded-2xl border border-slate-200 bg-white p-5"><I className="text-[#0b5cff]"/><h2 className="mt-3 font-black">{title as string}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{text as string}</p></div>; })}
            </div>
            <CustomerCareForm initialService={initialService}/>
          </div>
        </div>
      </section>
    </div>
  );
}
