\set ON_ERROR_STOP on
-- Disposable PostgreSQL 17 proof of the same contract expected from MACS staging.
-- This creates synthetic auth and Client Zero tenant tables only.
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users(id uuid primary key);
create or replace function auth.uid() returns uuid
  language sql stable security invoker set search_path = ''
  as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth to authenticated;
grant execute on function auth.uid() to authenticated;

create table public.maxx_icm_tenants (
  id uuid primary key,
  slug text not null unique,
  name text not null
);
create table public.maxx_icm_memberships (
  tenant_id uuid not null references public.maxx_icm_tenants(id),
  user_id uuid not null references auth.users(id),
  role text not null,
  primary key(tenant_id,user_id)
);
create or replace function public.maxx_is_icm_member(p_tenant_id uuid)
  returns boolean
  language sql stable security definer set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from public.maxx_icm_memberships m
    where m.tenant_id = p_tenant_id and m.user_id = auth.uid()
  );
$$;
grant usage on schema public to authenticated;
grant execute on function public.maxx_is_icm_member(uuid) to authenticated;
grant select on public.maxx_icm_tenants, public.maxx_icm_memberships to authenticated;

insert into auth.users(id) values
 ('11111111-1111-4111-8111-111111111111'),
 ('22222222-2222-4222-8222-222222222222'),
 ('33333333-3333-4333-8333-333333333333'),
 ('44444444-4444-4444-8444-444444444444');
insert into public.maxx_icm_tenants(id,slug,name) values
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','crown-and-core','Crown & Core'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','foreign-business','Other Tenant');
insert into public.maxx_icm_memberships(tenant_id,user_id,role) values
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','owner'),
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','22222222-2222-4222-8222-222222222222','reviewer'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','33333333-3333-4333-8333-333333333333','owner');

alter table public.maxx_icm_tenants enable row level security;
alter table public.maxx_icm_memberships enable row level security;
create policy tenant_reader on public.maxx_icm_tenants for select to authenticated
  using (public.maxx_is_icm_member(id));
create policy membership_reader on public.maxx_icm_memberships for select to authenticated
  using (user_id = auth.uid());
