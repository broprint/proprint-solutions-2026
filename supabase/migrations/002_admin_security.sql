-- =========================================================
-- ProPrint V10 - Admin access and Row Level Security
-- Creates the admin allow-list, is_admin() helper, and product
-- policies used by the catalog manager.
-- No administrator account is inserted by this migration.
-- =========================================================

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.products enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Published products are publicly readable" on public.products;
create policy "Published products are publicly readable"
on public.products
for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read admin allow-list" on public.admin_users;
create policy "Admins can read admin allow-list"
on public.admin_users
for select
to authenticated
using (public.is_admin());

-- Admin membership changes should be performed through the Supabase SQL
-- editor/service role by an authorized operator, not from the public app.
revoke all on table public.admin_users from anon;
revoke insert, update, delete on table public.admin_users from authenticated;

grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;
grant select on table public.admin_users to authenticated;
