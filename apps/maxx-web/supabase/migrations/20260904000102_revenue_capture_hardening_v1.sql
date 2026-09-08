-- Hardening for provider idempotency, attribution, and cross-client operations.

-- Plain unique indexes are inferable by PostgREST ON CONFLICT and still allow multiple NULLs.
drop index if exists public.maxx_call_events_provider_call_idx;
create unique index if not exists maxx_call_events_provider_call_idx
  on public.maxx_call_events(provider, provider_call_id);

drop index if exists public.maxx_sms_messages_provider_message_idx;
create unique index if not exists maxx_sms_messages_provider_message_idx
  on public.maxx_sms_messages(provider, provider_message_id);

-- One economic entry per provider-native source. NULL provider/source rows remain repeatable
-- because PostgreSQL unique indexes treat NULL values as distinct.
drop index if exists public.maxx_value_ledger_provider_source_idx;
create unique index if not exists maxx_value_ledger_provider_source_idx
  on public.maxx_value_ledger_entries(organization_id, entry_type, source_provider, source_ref);

create table if not exists public.maxx_attribution_touchpoints (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.maxx_organizations(id) on delete cascade,
  contact_id uuid references public.maxx_contacts(id) on delete set null,
  opportunity_id uuid references public.maxx_opportunities(id) on delete set null,
  provider_event_id uuid references public.maxx_provider_events(id) on delete set null,
  provider text not null,
  source text,
  medium text,
  campaign text,
  external_click_id text,
  landing_page text,
  referrer text,
  confidence text not null default 'ATTRIBUTED'
    check (confidence in ('VERIFIED','ATTRIBUTED','ESTIMATED','UNKNOWN')),
  evidence jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists maxx_attribution_touchpoints_opportunity_idx
  on public.maxx_attribution_touchpoints(organization_id, opportunity_id, occurred_at desc)
  where opportunity_id is not null;
create index if not exists maxx_attribution_touchpoints_click_idx
  on public.maxx_attribution_touchpoints(organization_id, external_click_id)
  where external_click_id is not null;

create table if not exists public.maxx_platform_operators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'operator' check (role in ('operator','admin')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.maxx_attribution_touchpoints enable row level security;
alter table public.maxx_platform_operators enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='maxx_attribution_touchpoints' and policyname='org access'
  ) then
    create policy "org access" on public.maxx_attribution_touchpoints
      for all using (public.maxx_is_org_member(organization_id))
      with check (public.maxx_is_org_member(organization_id));
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='maxx_platform_operators' and policyname='self read'
  ) then
    create policy "self read" on public.maxx_platform_operators
      for select using (user_id = auth.uid());
  end if;
end $$;
