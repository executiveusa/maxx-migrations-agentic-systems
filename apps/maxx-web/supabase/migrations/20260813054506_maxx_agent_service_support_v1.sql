create or replace function public.maxx_service_set_membership(
  p_organization_id uuid,
  p_user_id uuid,
  p_role text,
  p_status text default 'active'
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, maxx
as $$
declare
  v_row maxx.memberships%rowtype;
begin
  if p_role not in ('owner','admin','operator','reviewer','member','viewer') then
    raise exception 'invalid role' using errcode = '22023';
  end if;
  if p_status not in ('active','invited','suspended','revoked') then
    raise exception 'invalid status' using errcode = '22023';
  end if;

  insert into maxx.memberships (organization_id,user_id,role,status)
  values (p_organization_id,p_user_id,p_role,p_status)
  on conflict (organization_id,user_id)
  do update set role=excluded.role,status=excluded.status,updated_at=now()
  returning * into v_row;

  return jsonb_build_object(
    'organization_id',v_row.organization_id,
    'user_id',v_row.user_id,
    'role',v_row.role,
    'status',v_row.status
  );
end;
$$;

revoke all on function public.maxx_service_set_membership(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.maxx_service_set_membership(uuid,uuid,text,text) to service_role;

create or replace function public.maxx_service_execution_proof(p_action_proposal_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, maxx, maxx_private
as $$
  select jsonb_build_object(
    'execution_count', (select count(*) from maxx_private.execution_ledger e where e.action_proposal_id = p_action_proposal_id),
    'evidence_count', (select count(*) from maxx.evidence_receipts er where er.action_proposal_id = p_action_proposal_id),
    'executed_event_count', (select count(*) from maxx.events ev where ev.payload_redacted->>'proposal_id' = p_action_proposal_id::text and ev.event_type='action.executed'),
    'proposal_status', (select ap.status from maxx.action_proposals ap where ap.id = p_action_proposal_id),
    'approval_status', (select a.status from maxx.approvals a where a.action_proposal_id = p_action_proposal_id)
  );
$$;

revoke all on function public.maxx_service_execution_proof(uuid) from public, anon, authenticated;
grant execute on function public.maxx_service_execution_proof(uuid) to service_role;
