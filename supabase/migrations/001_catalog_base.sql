-- =========================================================
-- ProPrint V10 - Base catalog schema
-- Creates the products table used by the self-managed catalog.
-- This migration is intended for a fresh Supabase/PostgreSQL setup.
-- It does not insert any real product data.
-- =========================================================

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null,
  category text not null,
  sku text,

  short_description text,
  description text,
  specifications jsonb not null default '[]'::jsonb,

  price numeric(12,3),
  old_price numeric(12,3),
  price_on_request boolean not null default false,

  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  availability text not null default 'request_availability'
    check (availability in (
      'in_stock',
      'low_stock',
      'available_on_order',
      'request_availability',
      'out_of_stock',
      'quote_only'
    )),

  image_url text,
  image_alt text,

  badge text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_sort_idx
  on public.products (published, sort_order, created_at desc);

create index if not exists products_category_idx
  on public.products (category);

create index if not exists products_brand_idx
  on public.products (brand);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

comment on table public.products is
'ProPrint V10 self-managed product catalog.';
