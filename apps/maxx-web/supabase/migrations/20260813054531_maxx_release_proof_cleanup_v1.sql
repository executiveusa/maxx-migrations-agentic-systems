create or replace function public.maxx_service_cleanup_release_proof(
  p_user_id uuid,
  p_idempotency_prefix text
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, maxx, maxx_private
as $$
declare
  v_ids uuid[];
  v_proposals integer := 0;
  v_memberships integer := 0;
begin
  select coalesce(array_agg(ap.id), '{}'::uuid[]) into v_ids
  from maxx.action_proposals ap
  where ap.requested_by_user_id = p_user_id
    and ap.idempotency_key like p_idempotency_prefix || '%';

  delete from maxx.audit_log al
  where al.object_type = 'action_proposal'
    and al.object_id in (select x::text from unnest(v_ids) x);

  delete from maxx.events ev
  where ev.payload_redacted->>'proposal_id' in (select x::text from unnest(v_ids) x);

  delete from maxx.evidence_receipts er
  where er.action_proposal_id = any(v_ids);

  delete from maxx_private.execution_ledger el
  where el.action_proposal_id = any(v_ids);

  delete from maxx.approvals a
  where a.action_proposal_id = any(v_ids);

  delete from maxx.action_proposals ap
  where ap.id = any(v_ids);
  get diagnostics v_proposals = row_count;

  delete from maxx.memberships m
  where m.user_id = p_user_id;
  get diagnostics v_memberships = row_count;

  return jsonb_build_object(
    'deleted_proposals', v_proposals,
    'deleted_memberships', v_memberships
  );
end;
$$;

revoke all on function public.maxx_service_cleanup_release_proof(uuid,text) from public, anon, authenticated;
grant execute on function public.maxx_service_cleanup_release_proof(uuid,text) to service_role;
