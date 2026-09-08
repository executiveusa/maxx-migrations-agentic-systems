-- Revenue Capture OS approval bridge.
-- Evolves the existing Client Zero public.maxx_action_proposals table instead of
-- creating a competing approval table. Legacy intake proposals remain valid.

alter table public.maxx_action_proposals
  alter column tenant_id drop not null,
  alter column intake_submission_id drop not null,
  add column if not exists organization_id uuid references public.maxx_organizations(id) on delete cascade,
  add column if not exists tool_key text,
  add column if not exists risk_class text,
  add column if not exists action_hash text,
  add column if not exists expires_at timestamptz;

alter table public.maxx_action_proposals
  drop constraint if exists maxx_action_proposals_action_type_check;
alter table public.maxx_action_proposals
  add constraint maxx_action_proposals_action_type_check
  check (action_type in ('create_client_note','create_contact','move_deal','delete_contact'));

alter table public.maxx_action_proposals
  drop constraint if exists maxx_action_proposals_status_check;
alter table public.maxx_action_proposals
  add constraint maxx_action_proposals_status_check
  check (status in ('proposed','approved','rejected','executing','executed','failed'));

alter table public.maxx_action_proposals
  drop constraint if exists maxx_action_proposals_tenant_or_org_check;
alter table public.maxx_action_proposals
  add constraint maxx_action_proposals_tenant_or_org_check
  check (tenant_id is not null or organization_id is not null);

create unique index if not exists maxx_action_proposals_org_idempotency_idx
  on public.maxx_action_proposals(organization_id, idempotency_key)
  where organization_id is not null;
create index if not exists maxx_action_proposals_org_status_idx
  on public.maxx_action_proposals(organization_id, status, created_at desc)
  where organization_id is not null;

-- Existing Client Zero policy continues to cover tenant_id proposals. Add an org policy
-- for Revenue Capture proposals using the canonical CRM organization membership helper.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='maxx_action_proposals' and policyname='revenue capture org access'
  ) then
    create policy "revenue capture org access" on public.maxx_action_proposals
      for select using (organization_id is not null and public.maxx_is_org_member(organization_id));
  end if;
end $$;

create or replace function public.maxx_revenue_action_hash(
  p_organization_id uuid,
  p_tool_key text,
  p_payload jsonb,
  p_idempotency_key text
) returns text
language sql
immutable
security invoker
set search_path = pg_catalog, public, extensions
as $$
  select encode(
    extensions.digest(
      convert_to(
        jsonb_build_object(
          'organization_id', p_organization_id,
          'tool_key', p_tool_key,
          'payload', coalesce(p_payload, '{}'::jsonb),
          'idempotency_key', p_idempotency_key
        )::text,
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );
$$;

revoke all on function public.maxx_revenue_action_hash(uuid,text,jsonb,text) from public, anon;
grant execute on function public.maxx_revenue_action_hash(uuid,text,jsonb,text) to authenticated, service_role;

create or replace function public.maxx_revenue_create_action_proposal(
  p_organization_id uuid,
  p_tool_key text,
  p_payload jsonb,
  p_idempotency_key text,
  p_risk_class text default 'medium',
  p_expires_at timestamptz default null
) returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_user uuid := auth.uid();
  v_hash text;
  v_row public.maxx_action_proposals%rowtype;
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode='42501';
  end if;
  if not public.maxx_is_org_member(p_organization_id) then
    raise exception 'organization_membership_required' using errcode='42501';
  end if;
  if p_tool_key not in ('create_contact','move_deal','delete_contact') then
    raise exception 'unsupported_revenue_write_tool' using errcode='22023';
  end if;
  if p_risk_class not in ('low','medium','high','critical') then
    raise exception 'invalid_risk_class' using errcode='22023';
  end if;
  if coalesce(length(trim(p_idempotency_key)),0)=0 then
    raise exception 'idempotency_key_required' using errcode='22023';
  end if;

  v_hash := public.maxx_revenue_action_hash(p_organization_id,p_tool_key,coalesce(p_payload,'{}'::jsonb),p_idempotency_key);

  begin
    insert into public.maxx_action_proposals(
      tenant_id, intake_submission_id, organization_id,
      action_type, action_payload, proposed_actor, proposed_by, status,
      idempotency_key, tool_key, risk_class, action_hash, expires_at
    ) values (
      null, null, p_organization_id,
      p_tool_key, coalesce(p_payload,'{}'::jsonb), 'popebot', v_user, 'proposed',
      p_idempotency_key, p_tool_key, p_risk_class, v_hash,
      coalesce(p_expires_at, now() + interval '24 hours')
    ) returning * into v_row;
  exception when unique_violation then
    select * into v_row
    from public.maxx_action_proposals
    where organization_id=p_organization_id and idempotency_key=p_idempotency_key;
    if not found or v_row.action_hash is distinct from v_hash then
      raise exception 'idempotency_key_conflict' using errcode='23505';
    end if;
  end;

  return jsonb_build_object(
    'proposal_id',v_row.id,
    'organization_id',v_row.organization_id,
    'tool_key',v_row.tool_key,
    'action_hash',v_row.action_hash,
    'status',v_row.status,
    'expires_at',v_row.expires_at
  );
end;
$$;

revoke all on function public.maxx_revenue_create_action_proposal(uuid,text,jsonb,text,text,timestamptz) from public, anon;
grant execute on function public.maxx_revenue_create_action_proposal(uuid,text,jsonb,text,text,timestamptz) to authenticated;

create or replace function public.maxx_revenue_decide_action_proposal(
  p_proposal_id uuid,
  p_decision text
) returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_user uuid := auth.uid();
  v_row public.maxx_action_proposals%rowtype;
  v_role text;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if p_decision not in ('approve','reject') then raise exception 'invalid_decision' using errcode='22023'; end if;

  select * into v_row from public.maxx_action_proposals
  where id=p_proposal_id and organization_id is not null
  for update;
  if not found then raise exception 'proposal_not_found' using errcode='P0002'; end if;

  select role into v_role from public.maxx_organization_members
  where organization_id=v_row.organization_id and user_id=v_user limit 1;
  if coalesce(v_role,'') not in ('owner','admin') then
    raise exception 'approval_requires_owner_or_admin' using errcode='42501';
  end if;
  if v_row.expires_at is not null and v_row.expires_at <= now() then
    raise exception 'proposal_expired' using errcode='42501';
  end if;
  if v_row.status not in ('proposed','approved','rejected') then
    raise exception 'proposal_not_decidable' using errcode='22023';
  end if;

  if p_decision='reject' then
    update public.maxx_action_proposals
      set status='rejected', reviewed_by=v_user, reviewed_at=now(), result=jsonb_build_object('decision','rejected','side_effects',0)
      where id=v_row.id returning * into v_row;
  else
    update public.maxx_action_proposals
      set status='approved', reviewed_by=v_user, reviewed_at=now(), result=jsonb_build_object('decision','approved','side_effects',0)
      where id=v_row.id returning * into v_row;
  end if;

  return jsonb_build_object('proposal_id',v_row.id,'status',v_row.status,'action_hash',v_row.action_hash);
end;
$$;

revoke all on function public.maxx_revenue_decide_action_proposal(uuid,text) from public, anon;
grant execute on function public.maxx_revenue_decide_action_proposal(uuid,text) to authenticated;

-- Claim is the immediate-before-side-effect revalidation boundary. It atomically
-- moves approved -> executing so request retries cannot execute the same action twice.
create or replace function public.maxx_revenue_claim_approved_action(p_proposal_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_user uuid := auth.uid();
  v_row public.maxx_action_proposals%rowtype;
  v_hash text;
  v_role text;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;

  select * into v_row from public.maxx_action_proposals
  where id=p_proposal_id and organization_id is not null
  for update;
  if not found then raise exception 'proposal_not_found' using errcode='P0002'; end if;

  select role into v_role from public.maxx_organization_members
  where organization_id=v_row.organization_id and user_id=v_user limit 1;
  if coalesce(v_role,'') not in ('owner','admin') then raise exception 'execution_requires_owner_or_admin' using errcode='42501'; end if;
  if v_row.reviewed_by is distinct from v_user then raise exception 'approval_actor_mismatch' using errcode='42501'; end if;
  if v_row.status <> 'approved' then raise exception 'exact_approval_missing' using errcode='42501'; end if;
  if v_row.expires_at is not null and v_row.expires_at <= now() then raise exception 'proposal_expired' using errcode='42501'; end if;

  v_hash := public.maxx_revenue_action_hash(v_row.organization_id,v_row.tool_key,v_row.action_payload,v_row.idempotency_key);
  if v_hash is distinct from v_row.action_hash then raise exception 'action_hash_mismatch' using errcode='22000'; end if;

  update public.maxx_action_proposals set status='executing' where id=v_row.id;

  return jsonb_build_object(
    'proposal_id',v_row.id,
    'organization_id',v_row.organization_id,
    'tool_key',v_row.tool_key,
    'action_payload',v_row.action_payload,
    'action_hash',v_hash,
    'idempotency_key',v_row.idempotency_key
  );
end;
$$;

revoke all on function public.maxx_revenue_claim_approved_action(uuid) from public, anon;
grant execute on function public.maxx_revenue_claim_approved_action(uuid) to authenticated;

create or replace function public.maxx_revenue_finish_action(
  p_proposal_id uuid,
  p_status text,
  p_result jsonb
) returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_user uuid := auth.uid();
  v_row public.maxx_action_proposals%rowtype;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if p_status not in ('executed','failed') then raise exception 'invalid_finish_status' using errcode='22023'; end if;

  select * into v_row from public.maxx_action_proposals
  where id=p_proposal_id and organization_id is not null
  for update;
  if not found then raise exception 'proposal_not_found' using errcode='P0002'; end if;
  if v_row.reviewed_by is distinct from v_user then raise exception 'execution_actor_mismatch' using errcode='42501'; end if;
  if v_row.status <> 'executing' then raise exception 'proposal_not_executing' using errcode='22023'; end if;

  update public.maxx_action_proposals
    set status=p_status, result=coalesce(p_result,'{}'::jsonb)
    where id=v_row.id returning * into v_row;

  return jsonb_build_object('proposal_id',v_row.id,'status',v_row.status,'action_hash',v_row.action_hash,'result',v_row.result);
end;
$$;

revoke all on function public.maxx_revenue_finish_action(uuid,text,jsonb) from public, anon;
grant execute on function public.maxx_revenue_finish_action(uuid,text,jsonb) to authenticated;
