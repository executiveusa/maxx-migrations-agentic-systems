create or replace function maxx.compute_action_hash(
  p_organization_id uuid,
  p_project_id uuid,
  p_action_key text,
  p_action_class text,
  p_tool_key text,
  p_risk_class text,
  p_requires_approval boolean,
  p_payload_redacted jsonb,
  p_idempotency_key text
) returns text
language sql
immutable
security invoker
set search_path = pg_catalog, extensions
as $$
  select encode(
    extensions.digest(
      convert_to(
        jsonb_build_object(
          'organization_id', p_organization_id,
          'project_id', p_project_id,
          'action_key', p_action_key,
          'action_class', p_action_class,
          'tool_key', p_tool_key,
          'risk_class', p_risk_class,
          'requires_approval', p_requires_approval,
          'payload_redacted', coalesce(p_payload_redacted, '{}'::jsonb),
          'idempotency_key', p_idempotency_key
        )::text,
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );
$$;

revoke all on function maxx.compute_action_hash(uuid,uuid,text,text,text,text,boolean,jsonb,text) from public, anon;
grant execute on function maxx.compute_action_hash(uuid,uuid,text,text,text,text,boolean,jsonb,text) to authenticated, service_role;

create unique index if not exists approvals_one_per_action_proposal_idx
  on maxx.approvals(action_proposal_id);

create table if not exists maxx_private.execution_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references maxx.organizations(id) on delete cascade,
  action_proposal_id uuid not null unique references maxx.action_proposals(id) on delete cascade,
  action_hash text not null,
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  side_effect_key text not null unique,
  result_redacted jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table maxx_private.execution_ledger enable row level security;
revoke all on maxx_private.execution_ledger from public, anon, authenticated;
grant select, insert, update, delete on maxx_private.execution_ledger to service_role;

create or replace function public.maxx_agent_snapshot(p_organization_id uuid)
returns jsonb
language sql
stable
security invoker
set search_path = pg_catalog, public, maxx
as $$
  select jsonb_build_object(
    'user_id', auth.uid(),
    'organization', (
      select jsonb_build_object(
        'id', o.id,
        'slug', o.slug,
        'name', o.name,
        'status', o.status,
        'data_residency', o.data_residency,
        'migration_target', o.migration_target
      )
      from maxx.organizations o
      where o.id = p_organization_id
    ),
    'projects', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'slug', p.slug,
          'name', p.name,
          'project_type', p.project_type,
          'status', p.status,
          'repository', p.repository,
          'updated_at', p.updated_at
        ) order by p.updated_at desc
      )
      from maxx.projects p
      where p.organization_id = p_organization_id
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'proposal_id', ap.id,
          'action_key', ap.action_key,
          'action_class', ap.action_class,
          'risk_class', ap.risk_class,
          'action_hash', ap.action_hash,
          'proposal_status', ap.status,
          'approval_status', coalesce(a.status, 'pending'),
          'created_at', ap.created_at,
          'expires_at', a.expires_at
        ) order by ap.created_at desc
      )
      from maxx.action_proposals ap
      left join maxx.approvals a on a.action_proposal_id = ap.id
      where ap.organization_id = p_organization_id
        and ap.requires_approval = true
        and coalesce(a.status, 'pending') = 'pending'
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.maxx_agent_snapshot(uuid) from public, anon;
grant execute on function public.maxx_agent_snapshot(uuid) to authenticated, service_role;

create or replace function public.maxx_agent_create_proposal(
  p_organization_id uuid,
  p_project_id uuid,
  p_action_key text,
  p_action_class text,
  p_tool_key text,
  p_risk_class text,
  p_payload_redacted jsonb,
  p_idempotency_key text,
  p_requested_by_agent text default 'agent-maxx',
  p_requires_approval boolean default true,
  p_expires_at timestamptz default null
) returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public, maxx
as $$
declare
  v_hash text;
  v_row maxx.action_proposals%rowtype;
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if p_risk_class not in ('low','medium','high','critical') then
    raise exception 'invalid risk_class' using errcode = '22023';
  end if;
  if coalesce(length(trim(p_action_key)),0) = 0 or coalesce(length(trim(p_action_class)),0) = 0 then
    raise exception 'action_key and action_class are required' using errcode = '22023';
  end if;
  if coalesce(length(trim(p_idempotency_key)),0) = 0 then
    raise exception 'idempotency_key is required' using errcode = '22023';
  end if;

  v_hash := maxx.compute_action_hash(
    p_organization_id,
    p_project_id,
    p_action_key,
    p_action_class,
    p_tool_key,
    p_risk_class,
    p_requires_approval,
    coalesce(p_payload_redacted, '{}'::jsonb),
    p_idempotency_key
  );

  begin
    insert into maxx.action_proposals (
      organization_id, project_id, action_key, action_class, tool_key,
      risk_class, requires_approval, payload_redacted, action_hash,
      idempotency_key, requested_by_agent, requested_by_user_id, expires_at
    ) values (
      p_organization_id, p_project_id, p_action_key, p_action_class, p_tool_key,
      p_risk_class, p_requires_approval, coalesce(p_payload_redacted, '{}'::jsonb), v_hash,
      p_idempotency_key, p_requested_by_agent, auth.uid(), p_expires_at
    ) returning * into v_row;
  exception when unique_violation then
    select * into v_row
    from maxx.action_proposals
    where idempotency_key = p_idempotency_key;

    if not found or v_row.action_hash <> v_hash then
      raise exception 'idempotency key already exists for a different action' using errcode = '23505';
    end if;
  end;

  return jsonb_build_object(
    'id', v_row.id,
    'organization_id', v_row.organization_id,
    'project_id', v_row.project_id,
    'action_hash', v_row.action_hash,
    'status', v_row.status,
    'requires_approval', v_row.requires_approval,
    'idempotency_key', v_row.idempotency_key
  );
end;
$$;

revoke all on function public.maxx_agent_create_proposal(uuid,uuid,text,text,text,text,jsonb,text,text,boolean,timestamptz) from public, anon;
grant execute on function public.maxx_agent_create_proposal(uuid,uuid,text,text,text,text,jsonb,text,text,boolean,timestamptz) to authenticated;

create or replace function public.maxx_agent_decide_proposal(
  p_action_proposal_id uuid,
  p_decision text,
  p_rationale text default null
) returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public, maxx
as $$
declare
  v_proposal maxx.action_proposals%rowtype;
  v_approval maxx.approvals%rowtype;
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if p_decision not in ('approved','rejected') then
    raise exception 'decision must be approved or rejected' using errcode = '22023';
  end if;

  select * into v_proposal
  from maxx.action_proposals
  where id = p_action_proposal_id;

  if not found then
    raise exception 'proposal not found or not visible' using errcode = 'P0002';
  end if;

  begin
    insert into maxx.approvals (
      organization_id, action_proposal_id, action_hash, status,
      decision_by, rationale, decided_at,
      expires_at
    ) values (
      v_proposal.organization_id,
      v_proposal.id,
      v_proposal.action_hash,
      p_decision,
      auth.uid(),
      p_rationale,
      now(),
      coalesce(v_proposal.expires_at, now() + interval '24 hours')
    ) returning * into v_approval;
  exception when unique_violation then
    select * into v_approval
    from maxx.approvals
    where action_proposal_id = v_proposal.id;

    if v_approval.status <> p_decision or v_approval.action_hash <> v_proposal.action_hash then
      raise exception 'proposal already has a different persisted decision' using errcode = '23505';
    end if;
  end;

  return jsonb_build_object(
    'approval_id', v_approval.id,
    'proposal_id', v_approval.action_proposal_id,
    'action_hash', v_approval.action_hash,
    'status', v_approval.status,
    'decision_by', v_approval.decision_by,
    'decided_at', v_approval.decided_at,
    'expires_at', v_approval.expires_at
  );
end;
$$;

revoke all on function public.maxx_agent_decide_proposal(uuid,text,text) from public, anon;
grant execute on function public.maxx_agent_decide_proposal(uuid,text,text) to authenticated;

create or replace function public.maxx_execute_approved_test_action(
  p_action_proposal_id uuid,
  p_actor_user_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, maxx, maxx_private, extensions
as $$
declare
  v_proposal maxx.action_proposals%rowtype;
  v_approval maxx.approvals%rowtype;
  v_hash text;
  v_execution maxx_private.execution_ledger%rowtype;
  v_existing maxx_private.execution_ledger%rowtype;
begin
  select * into v_proposal
  from maxx.action_proposals
  where id = p_action_proposal_id
  for update;

  if not found then
    raise exception 'proposal not found' using errcode = 'P0002';
  end if;

  if not exists (
    select 1
    from maxx.memberships m
    where m.organization_id = v_proposal.organization_id
      and m.user_id = p_actor_user_id
      and m.status = 'active'
      and m.role in ('owner','admin','operator')
  ) then
    raise exception 'actor is not authorized to execute this proposal' using errcode = '42501';
  end if;

  select * into v_existing
  from maxx_private.execution_ledger
  where action_proposal_id = v_proposal.id;

  if found then
    return jsonb_build_object(
      'executed', true,
      'idempotent', true,
      'execution_id', v_existing.id,
      'proposal_id', v_proposal.id,
      'action_hash', v_existing.action_hash
    );
  end if;

  v_hash := maxx.compute_action_hash(
    v_proposal.organization_id,
    v_proposal.project_id,
    v_proposal.action_key,
    v_proposal.action_class,
    v_proposal.tool_key,
    v_proposal.risk_class,
    v_proposal.requires_approval,
    v_proposal.payload_redacted,
    v_proposal.idempotency_key
  );

  if v_hash <> v_proposal.action_hash then
    raise exception 'persisted action hash failed exact revalidation' using errcode = '22000';
  end if;

  if v_proposal.requires_approval then
    select * into v_approval
    from maxx.approvals
    where action_proposal_id = v_proposal.id
      and status = 'approved'
      and action_hash = v_hash
      and decided_at is not null
      and expires_at > now();

    if not found then
      raise exception 'exact persisted approval is missing, rejected, expired, or hash-mismatched' using errcode = '42501';
    end if;
  end if;

  insert into maxx_private.execution_ledger (
    organization_id, action_proposal_id, action_hash, actor_user_id,
    side_effect_key, result_redacted
  ) values (
    v_proposal.organization_id,
    v_proposal.id,
    v_hash,
    p_actor_user_id,
    'test-action:' || v_proposal.id::text,
    jsonb_build_object('kind','controlled_internal_test_side_effect','status','recorded')
  ) returning * into v_execution;

  update maxx.action_proposals
  set status = 'executed',
      result_redacted = jsonb_build_object(
        'execution_id', v_execution.id,
        'side_effect_key', v_execution.side_effect_key,
        'status', 'recorded'
      ),
      updated_at = now()
  where id = v_proposal.id;

  insert into maxx.evidence_receipts (
    organization_id, project_id, run_id, step_id, action_proposal_id,
    status, summary, tests, verification, cost
  ) values (
    v_proposal.organization_id,
    v_proposal.project_id,
    v_proposal.run_id,
    v_proposal.step_id,
    v_proposal.id,
    'pass',
    'Exact persisted approval revalidated immediately before controlled execution.',
    jsonb_build_array('action_hash_match','approval_present_and_unexpired','unique_execution_ledger_insert'),
    jsonb_build_object('action_hash', v_hash, 'execution_id', v_execution.id),
    '{}'::jsonb
  );

  insert into maxx.events (
    organization_id, project_id, run_id, event_type, source_type, source_key,
    payload_redacted, idempotency_key
  ) values (
    v_proposal.organization_id,
    v_proposal.project_id,
    v_proposal.run_id,
    'action.executed',
    'human',
    p_actor_user_id::text,
    jsonb_build_object('proposal_id', v_proposal.id, 'execution_id', v_execution.id, 'action_hash', v_hash),
    'action.executed:' || v_proposal.id::text
  );

  insert into maxx.audit_log (
    organization_id, project_id, run_id, actor_type, actor_id,
    action, object_type, object_id, payload_redacted
  ) values (
    v_proposal.organization_id,
    v_proposal.project_id,
    v_proposal.run_id,
    'human',
    p_actor_user_id::text,
    'execute_approved_action',
    'action_proposal',
    v_proposal.id::text,
    jsonb_build_object('action_hash', v_hash, 'execution_id', v_execution.id)
  );

  return jsonb_build_object(
    'executed', true,
    'idempotent', false,
    'execution_id', v_execution.id,
    'proposal_id', v_proposal.id,
    'action_hash', v_hash
  );
end;
$$;

revoke all on function public.maxx_execute_approved_test_action(uuid,uuid) from public, anon, authenticated;
grant execute on function public.maxx_execute_approved_test_action(uuid,uuid) to service_role;
