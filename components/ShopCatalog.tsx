'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/data/catalog';

function numericPrice(price: string) {
  const match = price.match(/KD\s*([0-9.]+)/i);
  return match ? Number(match[1]) : null;
}

export function ShopCatalog({ products, initialCategory = 'All' }: { products: Product[]; initialCategory?: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState('All');
  const [price, setPrice] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(() => {
    const values = ['All', ...Array.from(new Set(products.map((p) => p.category))).sort()];
    if (initialCategory !== 'All' && !values.includes(initialCategory)) values.push(initialCategory);
    return values;
  }, [products, initialCategory]);
  const brands = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.brand))).sort()], [products]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const haystack = `${product.name} ${product.brand} ${product.category} ${product.sku || ''} ${product.specs.join(' ')}`.toLowerCase();
      if (needle && !haystack.includes(needle)) return false;
      if (category !== 'All' && product.category !== category) return false;
      if (brand !== 'All' && product.brand !== brand) return false;
      const value = numericPrice(product.price);
      if (price === 'Under KD 100' && !(value !== null && value < 100)) return false;
      if (price === 'KD 100–250' && !(value !== null && value >= 100 && value <= 250)) return false;
      if (price === 'KD 250+' && !(value !== null && value > 250)) return false;
      if (price === 'Request Quote' && value !== null) return false;
      return true;
    });
  }, [products, query, category, brand, price]);

  const clearFilters = () => { setQuery(''); setCategory('All'); setBrand('All'); setPrice('All'); };
  const hasFilters = query || category !== 'All' || brand !== 'All' || price !== 'All';

  return <>
    <section className="border-b bg-white"><div className="container py-5"><div className="flex gap-3 overflow-x-auto pb-1">{categories.map((name) => <button key={name} onClick={() => setCategory(name)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black transition ${category === name ? 'border-[#0b5cff] bg-[#0b5cff] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'}`}>{name}</button>)}</div></div></section>
    <section className="py-10 xl:py-12"><div className="mx-auto w-[calc(100%-32px)] max-w-[1680px]"><div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] xl:gap-7">
      <aside className={`${filtersOpen ? 'block' : 'hidden'} h-fit rounded-[1.5rem] border border-slate-200 bg-white p-5 lg:block`}>
        <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-black"><SlidersHorizontal size={17}/> Filters</div><button onClick={() => setFiltersOpen(false)} className="lg:hidden" aria-label="Close filters"><X size={18}/></button></div>
        <label className="mt-6 block text-xs font-black uppercase tracking-wider text-slate-500">Brand</label><select value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400">{brands.map((item) => <option key={item}>{item}</option>)}</select>
        <label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">Price</label><select value={price} onChange={(e) => setPrice(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400">{['All', 'Under KD 100', 'KD 100–250', 'KD 250+', 'Request Quote'].map((item) => <option key={item}>{item}</option>)}</select>
        <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-600"><b className="block text-slate-900">Business customer?</b>Ask ProPrint for bulk pricing, deployment and AMC support.</div>
        {hasFilters && <button onClick={clearFilters} className="mt-5 w-full rounded-xl border border-slate-200 py-3 text-xs font-black text-slate-700 hover:bg-slate-50">Clear all filters</button>}
      </aside>
      <div className="min-w-0"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-3xl font-black tracking-[-.03em]">Shop products</h2><p className="mt-1 text-sm text-slate-500">{filtered.length} product{filtered.length === 1 ? '' : 's'} shown · ProPrint-managed catalog</p></div><button onClick={() => setFiltersOpen((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold lg:hidden"><SlidersHorizontal size={16}/> Filters</button></div>
        <div className="mt-5 flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><Search className="ml-3 text-slate-400" size={19}/><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-3 py-2.5 text-sm outline-none" placeholder="Search products, brands, models, SKU or specifications..." aria-label="Search product catalog"/>{query && <button onClick={() => setQuery('')} className="mr-2 rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Clear search"><X size={16}/></button>}</div>
        {filtered.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filtered.map((product) => <ProductCard key={product.slug} product={product}/>)}</div> : <div className="mt-8 rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><h3 className="text-xl font-black">No products currently available in this category.</h3><p className="mt-2 text-sm text-slate-500">Try another category or check back as new products are added.</p><button onClick={clearFilters} className="mt-5 rounded-full bg-[#071525] px-5 py-2.5 text-sm font-black text-white">View all products</button></div>}
      </div>
    </div></div></section>
  </>;
}
