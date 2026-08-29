import { getPublishedProducts } from '@/lib/products';

export default async function CatalogTestPage() {
  const products = await getPublishedProducts();

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container">
        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <div className="text-xs font-black uppercase tracking-[.2em] text-[#0b5cff]">
            ProPrint V10
          </div>

          <h1 className="mt-3 text-4xl font-black text-slate-900">
            Supabase Catalog Test
          </h1>

          <p className="mt-3 text-slate-600">
            Published products found: {products.length}
          </p>

          <div className="mt-8 grid gap-4">
            {products.length === 0 ? (
              <div className="rounded-2xl bg-amber-50 p-5 text-amber-900">
                No published products were returned from Supabase.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="text-xl font-black text-slate-900">
                    {product.name}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    {product.brand} · {product.category} · {product.sku}
                  </div>

                  <div className="mt-3 font-black text-[#0b5cff]">
                    {product.price_on_request || product.price === null
                      ? 'Request Price'
                      : `KD ${Number(product.price).toFixed(3)}`}
                  </div>

                  <div className="mt-2 text-sm text-slate-600">
                    Stock: {product.stock_quantity} · {product.availability}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}