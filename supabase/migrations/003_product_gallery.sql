-- =========================================================
-- ProPrint V10 - Product gallery
-- Adds multiple image URLs per product while keeping image_url
-- as the primary/catalog image for backward compatibility.
-- =========================================================

alter table public.products
add column if not exists image_urls jsonb not null default '[]'::jsonb;

comment on column public.products.image_urls is
'Ordered public image URLs for the product gallery. The first image is the primary image.';
