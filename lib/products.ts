import { supabase } from '@/lib/supabase';

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
  image_alt: string | null;

  badge: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
};

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