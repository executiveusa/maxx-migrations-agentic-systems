-- Crown & Core Vibe Audit: additive internal-only drafts; no action execution.
-- Apply ONLY to an approved MACS-owned staging database. Requires Client Zero schema.
create extension if not exists pgcrypto with schema extensions;

-- Privileged logic lives outside the exposed API schema.
create schema if not exists maxx_internal;
revoke all on schema maxx_internal from public, anon;
grant usage on schema maxx_internal to authenticated;

create table if not exists public.maxx_offer_drafts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.maxx_icm_tenants(id) on delete restrict,
  offer_id text not null check (offer_id = 'maxx-vibe-audit-v1'),
  kind text not null check (kind in ('audit', 'proposal')),
  source_draft_id uuid null references public.maxx_offer_drafts(id) on delete restrict,
  request_id uuid not null,
  idempotency_key text not null check (char_length(idempotency_key) between 12 and 120),
  payload_hash text not null check (payload_hash ~ '^[0-9a-f]{64}$'),
  artifact jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'reviewed', 'rejected')),
  created_by uuid not null references auth.users(id) on delete restrict,
  reviewed_by uuid null references auth.users(id) on delete restrict,
  reviewed_at timestamptz null,
  created_at timestamptz not null default now(),
  unique (tenant_id, idempotency_key)
);
create index if not exists maxx_offer_drafts_lookup_idx
  on public.maxx_offer_drafts(tenant_id, created_at desc);
create index if not exists maxx_offer_drafts_rate_idx
  on public.maxx_offer_drafts(tenant_id, created_by, created_at desc);

create table if not exists public.maxx_offer_draft_events (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.maxx_icm_tenants(id) on delete restrict,
  draft_id uuid not null references public.maxx_offer_drafts(id) on delete restrict,
  event_type text not null check (event_type in ('created', 'reviewed', 'rejected')),
  actor_id uuid not null references auth.users(id) on delete restrict,
  payload_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists maxx_offer_draft_events_idx
  on public.maxx_offer_draft_events(tenant_id, draft_id, created_at);

alter table public.maxx_offer_drafts enable row level security;
alter table public.maxx_offer_draft_events enable row level security;
alter table public.maxx_offer_drafts force row level security;
alter table public.maxx_offer_draft_events force row level security;

revoke all on public.maxx_offer_drafts from public, anon, authenticated;
revoke all on public.maxx_offer_draft_events from public, anon, authenticated;
grant select on public.maxx_offer_drafts to authenticated;
grant select on public.maxx_offer_draft_events to authenticated;

drop policy if exists maxx_offer_draft_select on public.maxx_offer_drafts;
create policy maxx_offer_draft_select on public.maxx_offer_drafts
  for select to authenticated using (public.maxx_is_icm_member(tenant_id));
drop policy if exists maxx_offer_event_select on public.maxx_offer_draft_events;
create policy maxx_offer_event_select on public.maxx_offer_draft_events
  for select to authenticated using (public.maxx_is_icm_member(tenant_id));

-- No INSERT/UPDATE/DELETE grants: the only write path is an authenticated, transactional RPC.
create or replace function maxx_internal.maxx_create_offer_draft(
  p_tenant_id uuid, p_kind text, p_artifact jsonb, p_idempotency_key text,
  p_request_id uuid, p_source_draft_id uuid default null
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_role text;
  v_hash text;
  v_prior public.maxx_offer_drafts%rowtype;
  v_parent public.maxx_offer_drafts%rowtype;
  v_draft public.maxx_offer_drafts%rowtype;
begin
  if v_actor is null then
    raise exception 'UNAUTHENTICATED' using errcode = '42501';
  end if;
  select m.role into v_role from public.maxx_icm_memberships m
    where m.tenant_id = p_tenant_id and m.user_id = v_actor;
  if coalesce(v_role,'') not in ('owner','operator') then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  if not exists (select 1 from public.maxx_icm_tenants
                 where id = p_tenant_id and slug = 'crown-and-core') then
    raise exception 'TENANT_NOT_FOUND' using errcode = '42501';
  end if;
  if p_kind not in ('audit', 'proposal') or p_artifact is null or
     p_artifact->>'offer_id' is distinct from 'maxx-vibe-audit-v1' or
     p_artifact->>'kind' is distinct from p_kind or
     p_artifact->>'external_side_effects' is distinct from '0' or
     p_artifact->'price' is distinct from 'null'::jsonb or
     p_idempotency_key is null or length(p_idempotency_key) not between 12 and 120 then
    raise exception 'INPUT_INVALID' using errcode = '22023';
  end if;
  if octet_length(p_artifact::text) > 16000 then
    raise exception 'INPUT_TOO_LARGE' using errcode = '22023';
  end if;

  -- One logical writer per actor/tenant, including retry and rate-limit checks.
  perform pg_advisory_xact_lock(hashtextextended(p_tenant_id::text || ':' || v_actor::text, 0));
  v_hash := encode(extensions.digest(convert_to(p_artifact::text,'UTF8'),'sha256'),'hex');
  select * into v_prior from public.maxx_offer_drafts
    where tenant_id = p_tenant_id and idempotency_key = p_idempotency_key;
  if found then
    if v_prior.payload_hash <> v_hash or v_prior.created_by <> v_actor or v_prior.kind <> p_kind then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = '23505';
    end if;
    return jsonb_build_object('id',v_prior.id,'status',v_prior.status,
      'payload_hash',v_prior.payload_hash,'replayed',true,'external_side_effects',0);
  end if;
  if (select count(*) from public.maxx_offer_drafts
      where tenant_id = p_tenant_id and created_by = v_actor
        and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'RATE_LIMITED' using errcode = '22023';
  end if;
  if p_kind = 'proposal' then
    select * into v_parent from public.maxx_offer_drafts
      where id = p_source_draft_id and tenant_id = p_tenant_id
      and kind = 'audit' and status = 'reviewed';
    if not found or p_artifact->>'source_audit_id' is distinct from v_parent.id::text
                 or p_artifact->>'source_audit_digest' is distinct from v_parent.payload_hash then
      raise exception 'REVIEWED_AUDIT_REQUIRED' using errcode = '22023';
    end if;
  elsif p_source_draft_id is not null then
    raise exception 'AUDIT_PARENT_FORBIDDEN' using errcode = '22023';
  end if;
  insert into public.maxx_offer_drafts
    (tenant_id,offer_id,kind,source_draft_id,request_id,idempotency_key,
     payload_hash,artifact,created_by)
  values (p_tenant_id,'maxx-vibe-audit-v1',p_kind,p_source_draft_id,p_request_id,
          p_idempotency_key,v_hash,p_artifact,v_actor)
  returning * into v_draft;
  insert into public.maxx_offer_draft_events
    (tenant_id,draft_id,event_type,actor_id,payload_hash)
  values (p_tenant_id,v_draft.id,'created',v_actor,v_hash);
  return jsonb_build_object('id',v_draft.id,'status','draft',
    'payload_hash',v_hash,'replayed',false,'external_side_effects',0);
end; $$;

create or replace function maxx_internal.maxx_review_offer_draft(
  p_tenant_id uuid, p_draft_id uuid, p_decision text, p_expected_hash text
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_role text;
  v_draft public.maxx_offer_drafts%rowtype;
  v_next text;
begin
  if v_actor is null then raise exception 'UNAUTHENTICATED' using errcode = '42501'; end if;
  select role into v_role from public.maxx_icm_memberships
    where tenant_id = p_tenant_id and user_id = v_actor;
  if coalesce(v_role,'') not in ('owner','reviewer') then
    raise exception 'REVIEW_FORBIDDEN' using errcode = '42501';
  end if;
  if p_decision not in ('review','reject') then
    raise exception 'INVALID_DECISION' using errcode = '22023';
  end if;
  select * into v_draft from public.maxx_offer_drafts
    where id=p_draft_id and tenant_id=p_tenant_id for update;
  if not found then raise exception 'NOT_FOUND' using errcode = 'P0002'; end if;
  if v_draft.created_by=v_actor then
    raise exception 'SELF_REVIEW_FORBIDDEN' using errcode = '42501';
  end if;
  if v_draft.payload_hash <> p_expected_hash then
    raise exception 'STALE_PAYLOAD' using errcode = '22023';
  end if;
  v_next := case when p_decision='review' then 'reviewed' else 'rejected' end;
  if v_draft.status <> 'draft' then
    if v_draft.status = v_next then
      return jsonb_build_object('id',v_draft.id,'status',v_next,
                               'replayed',true,'external_side_effects',0);
    end if;
    raise exception 'REVIEW_ALREADY_FINAL' using errcode = '22023';
  end if;
  update public.maxx_offer_drafts set status=v_next,reviewed_by=v_actor,reviewed_at=now()
    where id=v_draft.id;
  insert into public.maxx_offer_draft_events
    (tenant_id,draft_id,event_type,actor_id,payload_hash)
  values (p_tenant_id,v_draft.id,v_next,v_actor,v_draft.payload_hash);
  return jsonb_build_object('id',v_draft.id,'status',v_next,
                            'replayed',false,'external_side_effects',0);
end; $$;

-- Limit privileged RPCs to tenant-authenticated callers. The checks above
-- are authoritative; the wrapper is NOT a second authorization bypass.
revoke all on function maxx_internal.maxx_create_offer_draft(uuid,text,jsonb,text,uuid,uuid)
  from public, anon, authenticated;
revoke all on function maxx_internal.maxx_review_offer_draft(uuid,uuid,text,text)
  from public, anon, authenticated;
grant execute on function maxx_internal.maxx_create_offer_draft(uuid,text,jsonb,text,uuid,uuid)
  to authenticated;
grant execute on function maxx_internal.maxx_review_offer_draft(uuid,uuid,text,text)
  to authenticated;

-- PostgREST only needs unprivileged public invoker wrappers. Do not place
-- SECURITY DEFINER functions in the API exposed schema.
create or replace function public.maxx_create_offer_draft(
  p_tenant_id uuid, p_kind text, p_artifact jsonb, p_idempotency_key text,
  p_request_id uuid, p_source_draft_id uuid default null
) returns jsonb
language sql security invoker set search_path = ''
as $$
  select maxx_internal.maxx_create_offer_draft($1,$2,$3,$4,$5,$6);
$$;
create or replace function public.maxx_review_offer_draft(
  p_tenant_id uuid, p_draft_id uuid, p_decision text, p_expected_hash text
) returns jsonb
language sql security invoker set search_path = ''
as $$
  select maxx_internal.maxx_review_offer_draft($1,$2,$3,$4);
$$;

revoke all on function public.maxx_create_offer_draft(uuid,text,jsonb,text,uuid,uuid)
  from public, anon, authenticated;
grant execute on function public.maxx_create_offer_draft(uuid,text,jsonb,text,uuid,uuid)
  to authenticated;
revoke all on function public.maxx_review_offer_draft(uuid,uuid,text,text)
  from public, anon, authenticated;
grant execute on function public.maxx_review_offer_draft(uuid,uuid,text,text)
  to authenticated;

-- Deliberately no seed of real client membership, no backfill and no public interface.
-- Rollback only after checking for audit records: first disable routes, export evidence;
-- then drop functions/tables in reverse dependency order in approved staging.
