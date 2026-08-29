'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text || null;
}

function optionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

export async function createProduct(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/admin/login?error=unauthorized');

  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const brand = String(formData.get('brand') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();

  if (!name || !slug || !brand || !category) {
    redirect('/admin/products/new?error=required');
  }

  const specifications = String(formData.get('specifications') ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  const priceOnRequest = formData.get('price_on_request') === 'on';
  const price = priceOnRequest ? null : optionalNumber(formData.get('price'));

  const { error } = await supabase.from('products').insert({
    name,
    slug,
    brand,
    category,
    sku: optionalText(formData.get('sku')),
    short_description: optionalText(formData.get('short_description')),
    description: optionalText(formData.get('description')),
    specifications,
    price,
    old_price: optionalNumber(formData.get('old_price')),
    price_on_request: priceOnRequest,
    stock_quantity: Math.max(0, Number(formData.get('stock_quantity') ?? 0) || 0),
    availability: String(formData.get('availability') ?? 'request_availability'),
    image_url: optionalText(formData.get('image_url')),
    image_alt: optionalText(formData.get('image_alt')) || name,
    badge: optionalText(formData.get('badge')),
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    sort_order: Number(formData.get('sort_order') ?? 0) || 0,
  });

  if (error) {
    console.error('Failed to create product:', error);
    const reason = error.code === '23505' ? 'duplicate' : 'save';
    redirect(`/admin/products/new?error=${reason}`);
  }

  redirect('/admin/products?created=1');
}
