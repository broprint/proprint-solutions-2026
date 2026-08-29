import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, PackagePlus, ShieldCheck } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createProduct } from '../actions';

const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0b5cff]';
const labelClass = 'text-xs font-black uppercase tracking-wider text-slate-600';

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/admin/login?error=unauthorized');

  const { error } = await searchParams;
  const message = error === 'required'
    ? 'Product name, slug, brand and category are required.'
    : error === 'duplicate'
      ? 'That slug or SKU already exists. Please use a unique value.'
      : error === 'save'
        ? 'The product could not be saved. Check the values and try again.'
        : null;

  return (
    <main className="min-h-[75vh] bg-slate-50 py-12">
      <div className="container max-w-5xl">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-black text-[#0b5cff]"><ArrowLeft size={16} /> Back to Product Manager</Link>

        <div className="mt-5 rounded-[2rem] bg-[#061321] p-7 text-white">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-blue-300"><ShieldCheck size={15} /> Protected ProPrint Admin</div>
          <div className="mt-3 flex items-center gap-3"><PackagePlus size={30} /><h1 className="text-3xl font-black tracking-[-.04em]">Add Product</h1></div>
          <p className="mt-2 text-sm text-slate-300">Create a product once here and it will be stored in the Supabase catalog database.</p>
        </div>

        {message && <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{message}</div>}

        <form action={createProduct} className="mt-6 space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-lg font-black text-slate-900">Product Identity</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div><label className={labelClass}>Product Name *</label><input name="name" required className={fieldClass} placeholder="HP LaserJet Pro MFP 4103fdw" /></div>
              <div><label className={labelClass}>Slug *</label><input name="slug" required pattern="[a-z0-9-]+" className={fieldClass} placeholder="hp-laserjet-pro-mfp-4103fdw" /><p className="mt-1 text-xs text-slate-500">Lowercase letters, numbers and hyphens only.</p></div>
              <div><label className={labelClass}>Brand *</label><input name="brand" required className={fieldClass} placeholder="HP" /></div>
              <div><label className={labelClass}>Category *</label><input name="category" required className={fieldClass} placeholder="Printers & MFPs" /></div>
              <div><label className={labelClass}>SKU</label><input name="sku" className={fieldClass} placeholder="HP-4103FDW" /></div>
              <div><label className={labelClass}>Badge</label><input name="badge" className={fieldClass} placeholder="New / Bestseller / Offer" /></div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-lg font-black text-slate-900">Price & Availability</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div><label className={labelClass}>Selling Price (KD)</label><input name="price" type="number" min="0" step="0.001" className={fieldClass} placeholder="129.000" /></div>
              <div><label className={labelClass}>Old Price (KD)</label><input name="old_price" type="number" min="0" step="0.001" className={fieldClass} placeholder="149.000" /></div>
              <div><label className={labelClass}>Stock Quantity</label><input name="stock_quantity" type="number" min="0" step="1" defaultValue="0" className={fieldClass} /></div>
              <div className="md:col-span-2"><label className={labelClass}>Availability</label><select name="availability" defaultValue="request_availability" className={fieldClass}><option value="in_stock">In Stock</option><option value="low_stock">Low Stock</option><option value="available_on_order">Available on Order</option><option value="request_availability">Request Availability</option><option value="out_of_stock">Out of Stock</option><option value="quote_only">Quote Only</option></select></div>
              <label className="flex items-center gap-3 self-end rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"><input name="price_on_request" type="checkbox" className="h-4 w-4" /> Price on request</label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-lg font-black text-slate-900">Product Information</h2>
            <div className="mt-5 space-y-5">
              <div><label className={labelClass}>Short Description</label><input name="short_description" className={fieldClass} placeholder="Short catalog summary" /></div>
              <div><label className={labelClass}>Full Description</label><textarea name="description" rows={5} className={fieldClass} placeholder="Detailed product description..." /></div>
              <div><label className={labelClass}>Specifications</label><textarea name="specifications" rows={6} className={fieldClass} placeholder={'Print speed: Up to 40 ppm\nDuplex printing\nWi-Fi and Ethernet\nADF scanner'} /><p className="mt-1 text-xs text-slate-500">Enter one specification per line.</p></div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-lg font-black text-slate-900">Image & Publishing</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div><label className={labelClass}>Image URL</label><input name="image_url" type="url" className={fieldClass} placeholder="https://..." /></div>
              <div><label className={labelClass}>Image Alt Text</label><input name="image_alt" className={fieldClass} placeholder="Product image description" /></div>
              <div><label className={labelClass}>Sort Order</label><input name="sort_order" type="number" step="1" defaultValue="0" className={fieldClass} /></div>
              <div className="flex flex-wrap items-end gap-3"><label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"><input name="featured" type="checkbox" className="h-4 w-4" /> Featured product</label><label className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-[#0b5cff]"><input name="published" type="checkbox" className="h-4 w-4" /> Publish immediately</label></div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3 pb-8">
            <button type="submit" className="rounded-full bg-[#0b5cff] px-7 py-3.5 text-sm font-black text-white shadow-sm hover:bg-[#064bcf]">Save Product</button>
            <Link href="/admin/products" className="rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-black text-slate-700">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
