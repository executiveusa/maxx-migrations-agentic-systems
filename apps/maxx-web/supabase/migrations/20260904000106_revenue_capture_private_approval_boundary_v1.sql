-- Keep privileged Revenue Capture approval mutations outside the exposed public schema.
-- Public RPCs are SECURITY INVOKER wrappers. The private functions perform all auth,
-- membership, role, expiry, state, and exact-hash checks before bypassing table RLS.

create schema if not exists maxx_private;
revoke all on schema maxx_private from public, anon;
grant usage on schema maxx_private to authenticated, service_role;

create or replace function maxx_private.revenue_create_action_proposal(
  p_organization_id uuid,
  p_tool_key text,
  p_payload jsonb,
  p_idempotency_key text,
  p_risk_class text,
  p_expires_at timestamptz
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, maxx_private
as $$
declare
  v_user uuid := auth.uid();
  v_hash text;
  v_row public.maxx_action_proposals%rowtype;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if not public.maxx_is_org_member(p_organization_id) then raise exception 'organization_membership_required' using errcode='42501'; end if;
  if p_tool_key not in ('create_contact','move_deal','delete_contact') then raise exception 'unsupported_revenue_write_tool' using errcode='22023'; end if;
  if p_risk_class not in ('low','medium','high','critical') then raise exception 'invalid_risk_class' using errcode='22023'; end if;
  if coalesce(length(trim(p_idempotency_key)),0)=0 then raise exception 'idempotency_key_required' using errcode='22023'; end if;

  v_hash := public.maxx_revenue_action_hash(p_organization_id,p_tool_key,coalesce(p_payload,'{}'::jsonb),p_idempotency_key);
  begin
    insert into public.maxx_action_proposals(
      tenant_id,intake_submission_id,organization_id,action_type,action_payload,
      proposed_actor,proposed_by,status,idempotency_key,tool_key,risk_class,action_hash,expires_at
    ) values (
      null,null,p_organization_id,p_tool_key,coalesce(p_payload,'{}'::jsonb),
      'popebot',v_user,'proposed',p_idempotency_key,p_tool_key,p_risk_class,v_hash,
      coalesce(p_expires_at,now()+interval '24 hours')
    ) returning * into v_row;
  exception when unique_violation then
    select * into v_row from public.maxx_action_proposals
    where organization_id=p_organization_id and idempotency_key=p_idempotency_key;
    if not found or v_row.action_hash is distinct from v_hash then raise exception 'idempotency_key_conflict' using errcode='23505'; end if;
  end;

  return jsonb_build_object(
    'proposal_id',v_row.id,'organization_id',v_row.organization_id,'tool_key',v_row.tool_key,
    'action_hash',v_row.action_hash,'status',v_row.status,'expires_at',v_row.expires_at
  );
end;
$$;

create or replace function maxx_private.revenue_decide_action_proposal(
  p_proposal_id uuid,
  p_decision text
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, maxx_private
as $$
declare
  v_user uuid := auth.uid();
  v_row public.maxx_action_proposals%rowtype;
  v_role text;
  v_target_status text;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if p_decision not in ('approve','reject') then raise exception 'invalid_decision' using errcode='22023'; end if;
  v_target_status := case when p_decision='approve' then 'approved' else 'rejected' end;

  select * into v_row from public.maxx_action_proposals
  where id=p_proposal_id and organization_id is not null for update;
  if not found then raise exception 'proposal_not_found' using errcode='P0002'; end if;

  select role into v_role from public.maxx_organization_members
  where organization_id=v_row.organization_id and user_id=v_user limit 1;
  if coalesce(v_role,'') not in ('owner','admin') then raise exception 'approval_requires_owner_or_admin' using errcode='42501'; end if;
  if v_row.expires_at is not null and v_row.expires_at<=now() then raise exception 'proposal_expired' using errcode='42501'; end if;
  if v_row.status=v_target_status then
    return jsonb_build_object('proposal_id',v_row.id,'status',v_row.status,'action_hash',v_row.action_hash,'idempotent',true);
  end if;
  if v_row.status<>'proposed' then raise exception 'proposal_decision_is_immutable' using errcode='23505'; end if;

  update public.maxx_action_proposals
    set status=v_target_status,reviewed_by=v_user,reviewed_at=now(),result=jsonb_build_object('decision',p_decision,'side_effects',0)
    where id=v_row.id returning * into v_row;
  return jsonb_build_object('proposal_id',v_row.id,'status',v_row.status,'action_hash',v_row.action_hash,'idempotent',false);
end;
$$;

create or replace function maxx_private.revenue_claim_approved_action(p_proposal_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, maxx_private
as $$
declare
  v_user uuid := auth.uid();
  v_row public.maxx_action_proposals%rowtype;
  v_hash text;
  v_role text;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  select * into v_row from public.maxx_action_proposals
  where id=p_proposal_id and organization_id is not null for update;
  if not found then raise exception 'proposal_not_found' using errcode='P0002'; end if;

  select role into v_role from public.maxx_organization_members
  where organization_id=v_row.organization_id and user_id=v_user limit 1;
  if coalesce(v_role,'') not in ('owner','admin') then raise exception 'execution_requires_owner_or_admin' using errcode='42501'; end if;
  if v_row.reviewed_by is distinct from v_user then raise exception 'approval_actor_mismatch' using errcode='42501'; end if;
  if v_row.status<>'approved' then raise exception 'exact_approval_missing' using errcode='42501'; end if;
  if v_row.expires_at is not null and v_row.expires_at<=now() then raise exception 'proposal_expired' using errcode='42501'; end if;

  v_hash := public.maxx_revenue_action_hash(v_row.organization_id,v_row.tool_key,v_row.action_payload,v_row.idempotency_key);
  if v_hash is distinct from v_row.action_hash then raise exception 'action_hash_mismatch' using errcode='22000'; end if;

  update public.maxx_action_proposals set status='executing' where id=v_row.id;
  return jsonb_build_object(
    'proposal_id',v_row.id,'organization_id',v_row.organization_id,'tool_key',v_row.tool_key,
    'action_payload',v_row.action_payload,'action_hash',v_hash,'idempotency_key',v_row.idempotency_key
  );
end;
$$;

create or replace function maxx_private.revenue_finish_action(
  p_proposal_id uuid,
  p_status text,
  p_result jsonb
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, maxx_private
as $$
declare
  v_user uuid := auth.uid();
  v_row public.maxx_action_proposals%rowtype;
  v_role text;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if p_status not in ('executed','failed') then raise exception 'invalid_finish_status' using errcode='22023'; end if;

  select * into v_row from public.maxx_action_proposals
  where id=p_proposal_id and organization_id is not null for update;
  if not found then raise exception 'proposal_not_found' using errcode='P0002'; end if;
  select role into v_role from public.maxx_organization_members
  where organization_id=v_row.organization_id and user_id=v_user limit 1;
  if coalesce(v_role,'') not in ('owner','admin') then raise exception 'execution_receipt_requires_owner_or_admin' using errcode='42501'; end if;
  if v_row.reviewed_by is distinct from v_user then raise exception 'execution_actor_mismatch' using errcode='42501'; end if;
  if v_row.status<>'executing' then raise exception 'proposal_not_executing' using errcode='22023'; end if;

  update public.maxx_action_proposals set status=p_status,result=coalesce(p_result,'{}'::jsonb)
  where id=v_row.id returning * into v_row;
  return jsonb_build_object('proposal_id',v_row.id,'status',v_row.status,'action_hash',v_row.action_hash,'result',v_row.result);
end;
$$;

-- Expose only invoker-level wrappers through PostgREST.
create or replace function public.maxx_revenue_create_action_proposal(
  p_organization_id uuid,p_tool_key text,p_payload jsonb,p_idempotency_key text,
  p_risk_class text default 'medium',p_expires_at timestamptz default null
) returns jsonb
language sql
security invoker
set search_path = pg_catalog, maxx_private
as $$ select maxx_private.revenue_create_action_proposal($1,$2,$3,$4,$5,$6); $$;

create or replace function public.maxx_revenue_decide_action_proposal(p_proposal_id uuid,p_decision text)
returns jsonb language sql security invoker set search_path=pg_catalog,maxx_private
as $$ select maxx_private.revenue_decide_action_proposal($1,$2); $$;

create or replace function public.maxx_revenue_claim_approved_action(p_proposal_id uuid)
returns jsonb language sql security invoker set search_path=pg_catalog,maxx_private
as $$ select maxx_private.revenue_claim_approved_action($1); $$;

create or replace function public.maxx_revenue_finish_action(p_proposal_id uuid,p_status text,p_result jsonb)
returns jsonb language sql security invoker set search_path=pg_catalog,maxx_private
as $$ select maxx_private.revenue_finish_action($1,$2,$3); $$;

revoke all on function maxx_private.revenue_create_action_proposal(uuid,text,jsonb,text,text,timestamptz) from public, anon;
revoke all on function maxx_private.revenue_decide_action_proposal(uuid,text) from public, anon;
revoke all on function maxx_private.revenue_claim_approved_action(uuid) from public, anon;
revoke all on function maxx_private.revenue_finish_action(uuid,text,jsonb) from public, anon;
grant execute on function maxx_private.revenue_create_action_proposal(uuid,text,jsonb,text,text,timestamptz) to authenticated, service_role;
grant execute on function maxx_private.revenue_decide_action_proposal(uuid,text) to authenticated, service_role;
grant execute on function maxx_private.revenue_claim_approved_action(uuid) to authenticated, service_role;
grant execute on function maxx_private.revenue_finish_action(uuid,text,jsonb) to authenticated, service_role;

revoke all on function public.maxx_revenue_create_action_proposal(uuid,text,jsonb,text,text,timestamptz) from public, anon;
revoke all on function public.maxx_revenue_decide_action_proposal(uuid,text) from public, anon;
revoke all on function public.maxx_revenue_claim_approved_action(uuid) from public, anon;
revoke all on function public.maxx_revenue_finish_action(uuid,text,jsonb) from public, anon;
grant execute on function public.maxx_revenue_create_action_proposal(uuid,text,jsonb,text,text,timestamptz) to authenticated;
grant execute on function public.maxx_revenue_decide_action_proposal(uuid,text) to authenticated;
grant execute on function public.maxx_revenue_claim_approved_action(uuid) to authenticated;
grant execute on function public.maxx_revenue_finish_action(uuid,text,jsonb) to authenticated;
