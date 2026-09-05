-- Finalize Revenue Capture proposal decision semantics:
-- repeating the same decision is idempotent; reversing a persisted decision is forbidden.

create or replace function public.maxx_revenue_decide_action_proposal(
  p_proposal_id uuid,
  p_decision text
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
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

  if v_row.status = v_target_status then
    return jsonb_build_object(
      'proposal_id',v_row.id,'status',v_row.status,'action_hash',v_row.action_hash,'idempotent',true
    );
  end if;
  if v_row.status <> 'proposed' then
    raise exception 'proposal_decision_is_immutable' using errcode='23505';
  end if;

  update public.maxx_action_proposals
    set status=v_target_status,
        reviewed_by=v_user,
        reviewed_at=now(),
        result=jsonb_build_object('decision',p_decision,'side_effects',0)
    where id=v_row.id
    returning * into v_row;

  return jsonb_build_object(
    'proposal_id',v_row.id,'status',v_row.status,'action_hash',v_row.action_hash,'idempotent',false
  );
end;
$$;

revoke all on function public.maxx_revenue_decide_action_proposal(uuid,text) from public, anon;
grant execute on function public.maxx_revenue_decide_action_proposal(uuid,text) to authenticated;
