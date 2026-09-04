-- Revenue Capture OS event/evidence spine.
-- Additive only. Provider secrets remain in deployment secret storage; database rows
-- store secret references and provider account identifiers, never raw credentials.

create extension if not exists "pgcrypto";

-- Expand the original connection registry into the canonical provider registry.
alter table public.maxx_integration_connections
  add column if not exists external_account_id text,
  add column if not exists external_label text,
  add column if not exists secret_ref text,
  add column if not exists config jsonb not null default '{}'::jsonb,
  add column if not exists capabilities text[] not null default '{}',
  add column if not exists last_verified_at timestamptz,
  add column if not exists last_event_at timestamptz,
  add column if not exists health_message text;

alter table public.maxx_integration_connections
  drop constraint if exists maxx_integration_connections_provider_check;

alter table public.maxx_integration_connections
  add constraint maxx_integration_connections_provider_check
  check (provider in (
    'twilio', 'whatsapp_business', 'email', 'stripe', 'quickbooks', 'xero',
    'google_business_profile', 'meta_ads', 'google_ads', 'search_console',
    'google_analytics', 'ghl_api', 'hubspot', 'salesforce', 'erpnext',
    'supabase', 'postiz', 'webhook'
  ));

create table if not exists public.maxx_provider_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.maxx_organizations(id) on delete cascade,
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  direction text not null default 'inbound' check (direction in ('inbound','outbound','internal')),
  occurred_at timestamptz not null default now(),
  received_at timestamptz not null default now(),
  contact_id uuid references public.maxx_contacts(id) on delete set null,
  opportunity_id uuid references public.maxx_opportunities(id) on delete set null,
  connection_id uuid references public.maxx_integration_connections(id) on delete set null,
  correlation_key text,
  payload jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '{}'::jsonb,
  evidence_state text not null default 'UNKNOWN'
    check (evidence_state in ('VERIFIED','ATTRIBUTED','ESTIMATED','UNKNOWN')),
  processing_status text not null default 'received'
    check (processing_status in ('received','processed','ignored','failed','needs_human')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, provider_event_id)
);

create index if not exists maxx_provider_events_org_time_idx
  on public.maxx_provider_events(organization_id, occurred_at desc);
create index if not exists maxx_provider_events_contact_idx
  on public.maxx_provider_events(contact_id) where contact_id is not null;
create index if not exists maxx_provider_events_opportunity_idx
  on public.maxx_provider_events(opportunity_id) where opportunity_id is not null;
create index if not exists maxx_provider_events_correlation_idx
  on public.maxx_provider_events(organization_id, correlation_key) where correlation_key is not null;

create table if not exists public.maxx_value_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.maxx_organizations(id) on delete cascade,
  contact_id uuid references public.maxx_contacts(id) on delete set null,
  opportunity_id uuid references public.maxx_opportunities(id) on delete set null,
  provider_event_id uuid references public.maxx_provider_events(id) on delete set null,
  entry_type text not null check (entry_type in (
    'lead_value','opportunity_value','recovered_revenue','booked_revenue',
    'payment','refund','lost_revenue','cost','adjustment'
  )),
  amount_cents bigint not null default 0,
  currency text not null default 'USD',
  confidence text not null default 'UNKNOWN'
    check (confidence in ('VERIFIED','ATTRIBUTED','ESTIMATED','UNKNOWN')),
  source_provider text,
  source_ref text,
  attribution_model text,
  attribution_reason text,
  evidence jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists maxx_value_ledger_org_time_idx
  on public.maxx_value_ledger_entries(organization_id, occurred_at desc);
create index if not exists maxx_value_ledger_opportunity_idx
  on public.maxx_value_ledger_entries(opportunity_id) where opportunity_id is not null;
create index if not exists maxx_value_ledger_confidence_idx
  on public.maxx_value_ledger_entries(organization_id, confidence, entry_type);

create table if not exists public.maxx_external_objects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.maxx_organizations(id) on delete cascade,
  provider text not null,
  object_type text not null,
  external_id text not null,
  local_type text,
  local_id uuid,
  sync_direction text not null default 'inbound'
    check (sync_direction in ('inbound','outbound','bidirectional')),
  sync_status text not null default 'linked'
    check (sync_status in ('linked','pending','conflict','error','disabled')),
  external_updated_at timestamptz,
  last_synced_at timestamptz,
  content_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, provider, object_type, external_id)
);

create index if not exists maxx_external_objects_local_idx
  on public.maxx_external_objects(organization_id, local_type, local_id)
  where local_id is not null;

create table if not exists public.maxx_recovery_receipts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.maxx_organizations(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  status text not null default 'draft' check (status in ('draft','ready','sent','failed')),
  verified_revenue_cents bigint not null default 0,
  attributed_revenue_cents bigint not null default 0,
  estimated_value_cents bigint not null default 0,
  recovered_count int not null default 0,
  risk_count int not null default 0,
  summary jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, period_start, period_end)
);

create table if not exists public.maxx_erp_sync_state (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.maxx_organizations(id) on delete cascade,
  entity_type text not null,
  erp_doctype text not null,
  authoritative_system text not null default 'erpnext' check (authoritative_system in ('erpnext')),
  last_cursor text,
  last_synced_at timestamptz,
  status text not null default 'pending' check (status in ('pending','healthy','degraded','blocked')),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, entity_type)
);

-- RLS: authenticated org members can see their tenant. Server-side provider webhooks
-- use the service role after independently resolving the destination/account to an org.
do $$
declare
  t text;
begin
  foreach t in array array[
    'maxx_provider_events', 'maxx_value_ledger_entries', 'maxx_external_objects',
    'maxx_recovery_receipts', 'maxx_erp_sync_state'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    if not exists (
      select 1 from pg_policies where schemaname='public' and tablename=t and policyname='org access'
    ) then
      execute format(
        'create policy "org access" on public.%I for all using (public.maxx_is_org_member(organization_id)) with check (public.maxx_is_org_member(organization_id))',
        t
      );
    end if;
  end loop;
end $$;

-- Realtime event bus. Publication add is idempotent via catalog check.
do $$
begin
  if exists (select 1 from pg_publication where pubname='supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname='supabase_realtime' and schemaname='public' and tablename='maxx_provider_events'
    ) then
      alter publication supabase_realtime add table public.maxx_provider_events;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname='supabase_realtime' and schemaname='public' and tablename='maxx_value_ledger_entries'
    ) then
      alter publication supabase_realtime add table public.maxx_value_ledger_entries;
    end if;
  end if;
end $$;

comment on table public.maxx_provider_events is 'Canonical provider event/evidence bus for Revenue Capture OS.';
comment on table public.maxx_value_ledger_entries is 'Evidence-backed economic ledger. Estimates must never be presented as verified revenue.';
comment on table public.maxx_external_objects is 'Portable provider-to-MAXX object identity map for CRM/ERP/accounting imports and sync.';
comment on table public.maxx_recovery_receipts is 'Weekly evidence receipt derived from the Value Ledger.';
