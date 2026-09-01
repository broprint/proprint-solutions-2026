import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Boxes, LogOut, Plus, ShieldCheck } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { DatabaseProduct } from '@/lib/products';
import { logout } from '../login/actions';
import { setProductPublished } from './actions';
import DeleteProductButton from './DeleteProductButton';

function priceLabel(product: DatabaseProduct) {
  if (product.price_on_request || product.price === null) return 'Request Quote';
  return `KD ${Number(product.price).toFixed(3)}`;
}
function availabilityLabel(value: DatabaseProduct['availability']) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ published?: string; unpublished?: string; deleted?: string; updated?: string; error?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !isAdmin) redirect('/admin/login?error=unauthorized');

  const params = await searchParams;
  const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  const products = (data ?? []) as DatabaseProduct[];

  return <main className="min-h-[75vh] bg-slate-50 py-12"><div className="container">
    <div className="flex flex-col gap-5 rounded-[2rem] bg-[#061321] p-7 text-white md:flex-row md:items-center md:justify-between">
      <div><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-blue-300"><ShieldCheck size={15}/> Protected ProPrint Admin</div><h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Product Manager</h1><p className="mt-2 text-sm text-slate-300">Manage the products that power the ProPrint online catalog.</p></div>
      <div className="flex flex-wrap gap-3"><Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-[#0b5cff] px-5 py-3 text-sm font-black text-white"><Plus size={17}/> Add Product</Link><form action={logout}><button type="submit" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white"><LogOut size={17}/> Sign Out</button></form></div>
    </div>

    {params.published === '1' && <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Product published successfully. It is now available to the storefront.</div>}
    {params.unpublished === '1' && <div className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">Product moved back to Draft.</div>}
    {params.updated === '1' && <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">Product updated successfully.</div>}
    {params.deleted === '1' && <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Product deleted successfully. Its ProPrint Storage images were also removed.</div>}
    {params.error && <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">The requested product change could not be completed. Please try again.</div>}

    <div className="mt-7 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Products</div><div className="mt-2 text-3xl font-black text-slate-900">{products.length}</div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Published</div><div className="mt-2 text-3xl font-black text-slate-900">{products.filter(p=>p.published).length}</div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Unpublished</div><div className="mt-2 text-3xl font-black text-slate-900">{products.filter(p=>!p.published).length}</div></div>
    </div>

    <section className="mt-7 overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5"><Boxes className="text-[#0b5cff]" size={20}/><h2 className="font-black text-slate-900">Catalog Products</h2></div>
      {error ? <div className="p-8 text-sm font-bold text-red-700">Could not load the product catalog: {error.message}</div> : products.length===0 ? <div className="p-10 text-center text-sm text-slate-500">No products yet. Use Add Product to create the first catalog item.</div> :
      <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Product</th><th className="px-4 py-4">SKU</th><th className="px-4 py-4">Price</th><th className="px-4 py-4">Stock</th><th className="px-4 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
        {products.map(product=><tr key={product.id}><td className="px-6 py-5"><div className="font-black text-slate-900">{product.name}</div><div className="mt-1 text-xs text-slate-500">{product.brand} · {product.category}</div></td><td className="px-4 py-5 text-slate-600">{product.sku ?? '—'}</td><td className="px-4 py-5 font-bold text-slate-900">{priceLabel(product)}</td><td className="px-4 py-5"><div className="font-bold text-slate-700">{product.stock_quantity}</div><div className="text-xs text-slate-500">{availabilityLabel(product.availability)}</div></td><td className="px-4 py-5"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${product.published?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-600'}`}>{product.published?'Published':'Draft'}</span></td><td className="px-6 py-5"><div className="flex flex-wrap justify-end gap-2">
          <form action={setProductPublished}><input type="hidden" name="product_id" value={product.id}/><input type="hidden" name="published" value={product.published?'false':'true'}/><button type="submit" className={`rounded-full px-4 py-2 text-xs font-black text-white ${product.published?'bg-slate-600 hover:bg-slate-700':'bg-emerald-600 hover:bg-emerald-700'}`}>{product.published?'Move to Draft':'Publish'}</button></form>
          <Link href={`/admin/products/${product.id}/edit`} className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:border-[#0b5cff] hover:text-[#0b5cff]">Edit Product</Link>
          <DeleteProductButton productId={product.id} productName={product.name} />
        </div></td></tr>)}
      </tbody></table></div>}
    </section>
  </div></main>;
}
