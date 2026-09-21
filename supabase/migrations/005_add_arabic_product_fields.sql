-- Arabic catalog fields for the bilingual ProPrint storefront.
-- Arabic values are optional; the storefront falls back to English when blank.
alter table public.products
  add column if not exists name_ar text,
  add column if not exists short_description_ar text,
  add column if not exists description_ar text,
  add column if not exists specifications_ar text[] not null default '{}'::text[];

comment on column public.products.name_ar is 'Optional Arabic product name; falls back to English name when null.';
comment on column public.products.short_description_ar is 'Optional Arabic short description.';
comment on column public.products.description_ar is 'Optional Arabic full description.';
comment on column public.products.specifications_ar is 'Optional Arabic specifications, one item per array element.';
