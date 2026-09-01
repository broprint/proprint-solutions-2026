import { supabase } from '@/lib/supabase';
import type { Product } from '@/data/catalog';
import { normalizeProductCategory } from '@/config/catalog';

export type DatabaseProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  sku: string | null;

  short_description: string | null;
  description: string | null;
  specifications: string[];

  price: number | null;
  old_price: number | null;
  price_on_request: boolean;

  stock_quantity: number;
  availability:
    | 'in_stock'
    | 'low_stock'
    | 'available_on_order'
    | 'request_availability'
    | 'out_of_stock'
    | 'quote_only';

  image_url: string | null;
  image_urls: string[];
  image_alt: string | null;

  badge: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
};

const SPEC_JUNK = new Set([
  'information_stroke',
  'information stroke',
  'learn more',
  'show more',
]);

function cleanSpecification(value: string) {
  const cleaned = value
    .replace(/^[•·▪◦\-–—]+\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return null;
  if (SPEC_JUNK.has(cleaned.toLowerCase())) return null;
  if (/^[a-z]$/i.test(cleaned)) return null;
  return cleaned;
}

function productIcon(category: string): Product['icon'] {
  const value = category.toLowerCase();
  if (value.includes('laptop') || value.includes('computer') || value.includes('pc')) return 'laptop';
  if (value.includes('plotter') || value.includes('wide format')) return 'plotter';
  if (value.includes('printer') || value.includes('mfp') || value.includes('consumable')) return 'printer';
  if (value.includes('monitor') || value.includes('display') || value.includes('accessor')) return 'monitor';
  if (value.includes('network') || value.includes('router') || value.includes('switch')) return 'network';
  return 'storage';
}

function stockLabel(product: DatabaseProduct): Product['stock'] {
  switch (product.availability) {
    case 'in_stock':
      return 'In stock';
    case 'low_stock':
      return 'Low stock';
    case 'available_on_order':
      return 'Available on order';
    case 'out_of_stock':
      return 'Out of stock';
    case 'quote_only':
      return 'Quote only';
    default:
      return 'Request availability';
  }
}

export function toStoreProduct(product: DatabaseProduct): Product {
  const specs = Array.isArray(product.specifications)
    ? product.specifications
        .filter((item): item is string => typeof item === 'string')
        .map(cleanSpecification)
        .filter((item): item is string => !!item)
    : [];

  const gallery = Array.isArray(product.image_urls)
    ? product.image_urls.filter((item): item is string => typeof item === 'string' && item.length > 0)
    : [];

  const primaryImage = product.image_url ?? gallery[0] ?? undefined;
  const images = gallery.length > 0
    ? gallery
    : primaryImage
      ? [primaryImage]
      : [];

  const quoteOnly = product.price_on_request || product.price === null;
  const category = normalizeProductCategory(product.category);

  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category,
    price: quoteOnly ? 'Request Quote' : `KD ${Number(product.price).toFixed(3)}`,
    oldPrice: product.old_price === null ? undefined : `KD ${Number(product.old_price).toFixed(3)}`,
    badge: product.badge ?? undefined,
    specs,
    icon: productIcon(category),
    image: primaryImage,
    images,
    imageAlt: product.image_alt ?? product.name,
    sku: product.sku ?? undefined,
    stock: stockLabel(product),
    stockQuantity: product.stock_quantity,
    priceOnRequest: quoteOnly,
  };
}

export async function getPublishedProducts(): Promise<DatabaseProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load products from Supabase:', error);
    return [];
  }

  return (data ?? []) as DatabaseProduct[];
}

export async function getStoreProducts(): Promise<Product[]> {
  const products = await getPublishedProducts();
  return products.map(toStoreProduct);
}
