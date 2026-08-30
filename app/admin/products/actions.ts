'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const PRODUCT_IMAGE_BUCKET = 'product-images';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

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

function imageExtension(file: File) {
  switch (file.type) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return null;
  }
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

  if (!/^[a-z0-9-]+$/.test(slug)) {
    redirect('/admin/products/new?error=slug');
  }

  const specifications = String(formData.get('specifications') ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  const priceOnRequest = formData.get('price_on_request') === 'on';
  const price = priceOnRequest ? null : optionalNumber(formData.get('price'));

  let uploadedImagePath: string | null = null;
  let imageUrl = optionalText(formData.get('image_url'));
  const imageFile = formData.get('image_file');

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.has(imageFile.type)) {
      redirect('/admin/products/new?error=image-type');
    }

    if (imageFile.size > MAX_IMAGE_SIZE) {
      redirect('/admin/products/new?error=image-size');
    }

    const extension = imageExtension(imageFile);
    if (!extension) {
      redirect('/admin/products/new?error=image-type');
    }

    uploadedImagePath = `${slug}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(uploadedImagePath, imageFile, {
        contentType: imageFile.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Failed to upload product image:', uploadError);
      redirect('/admin/products/new?error=image-upload');
    }

    const { data: publicImage } = supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .getPublicUrl(uploadedImagePath);

    imageUrl = publicImage.publicUrl;
  }

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
    image_url: imageUrl,
    image_alt: optionalText(formData.get('image_alt')) || name,
    badge: optionalText(formData.get('badge')),
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    sort_order: Number(formData.get('sort_order') ?? 0) || 0,
  });

  if (error) {
    if (uploadedImagePath) {
      const { error: cleanupError } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .remove([uploadedImagePath]);

      if (cleanupError) {
        console.error('Failed to clean up uploaded product image:', cleanupError);
      }
    }

    console.error('Failed to create product:', error);
    const reason = error.code === '23505' ? 'duplicate' : 'save';
    redirect(`/admin/products/new?error=${reason}`);
  }

  redirect('/admin/products?created=1');
}
