-- Persistent missed-call text-back configuration and provider evidence.

create table if not exists public.maxx_sms_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.maxx_organizations(id) on delete cascade,
  name text not null,
  body text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists maxx_sms_templates_org_idx
  on public.maxx_sms_templates(organization_id, active);

alter table public.maxx_mctb_rules
  drop constraint if exists maxx_mctb_rules_template_id_fkey;
alter table public.maxx_mctb_rules
  add constraint maxx_mctb_rules_template_id_fkey
  foreign key (template_id) references public.maxx_sms_templates(id) on delete set null;

alter table public.maxx_call_events
  add column if not exists provider text not null default 'twilio',
  add column if not exists provider_call_id text,
  add column if not exists recording_url text;

create unique index if not exists maxx_call_events_provider_call_idx
  on public.maxx_call_events(provider, provider_call_id)
  where provider_call_id is not null;

alter table public.maxx_sms_messages
  add column if not exists from_number text,
  add column if not exists direction text not null default 'outbound',
  add column if not exists provider text not null default 'twilio',
  add column if not exists provider_message_id text;

create unique index if not exists maxx_sms_messages_provider_message_idx
  on public.maxx_sms_messages(provider, provider_message_id)
  where provider_message_id is not null;

alter table public.maxx_sms_templates enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='maxx_sms_templates' and policyname='org access'
  ) then
    create policy "org access" on public.maxx_sms_templates
      for all using (public.maxx_is_org_member(organization_id))
      with check (public.maxx_is_org_member(organization_id));
  end if;
end $$;
