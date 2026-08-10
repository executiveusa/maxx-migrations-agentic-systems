-- MAXX Client Zero: durable Stage 00 intake, isolated ICM tenant context,
-- approval-gated benign action, evidence ledger, and portable export.
-- This migration is intentionally additive and reversible.

create extension if not exists pgcrypto;

create table if not exists public.maxx_icm_tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  organization_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.maxx_icm_memberships (
  tenant_id uuid not null references public.maxx_icm_tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'operator' check (role in ('owner','operator','reviewer','reader')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table if not exists public.maxx_intake_submissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.maxx_icm_tenants(id) on delete restrict,
  receipt_token uuid not null default gen_random_uuid() unique,
  status text not null default 'received' check (status in ('received','normalized','ready','archived')),
  schema_version text not null default '1.0',
  answers jsonb not null default '{}'::jsonb,
  icm jsonb not null default '{}'::jsonb,
  ontology jsonb not null default '{}'::jsonb,
  open_questions jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '{}'::jsonb,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.maxx_action_proposals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.maxx_icm_tenants(id) on delete restrict,
  intake_submission_id uuid not null references public.maxx_intake_submissions(id) on delete cascade,
  action_type text not null check (action_type in ('create_client_note')),
  action_payload jsonb not null default '{}'::jsonb,
  proposed_actor text not null default 'maxx-agent',
  proposed_by uuid null references auth.users(id) on delete set null,
  status text not null default 'proposed' check (status in ('proposed','rejected','executed','failed')),
  idempotency_key text not null,
  reviewed_by uuid null references auth.users(id) on delete set null,
  reviewed_at timestamptz null,
  result jsonb null,
  created_at timestamptz not null default now(),
  unique (tenant_id, idempotency_key)
);

create table if not exists public.maxx_client_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.maxx_icm_tenants(id) on delete restrict,
  intake_submission_id uuid not null references public.maxx_intake_submissions(id) on delete cascade,
  proposal_id uuid not null unique references public.maxx_action_proposals(id) on delete restrict,
  note text not null,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.maxx_evidence_ledger (
  id bigserial primary key,
  tenant_id uuid not null references public.maxx_icm_tenants(id) on delete restrict,
  intake_submission_id uuid null references public.maxx_intake_submissions(id) on delete cascade,
  proposal_id uuid null references public.maxx_action_proposals(id) on delete cascade,
  event_type text not null,
  actor_type text not null default 'system',
  actor_user_id uuid null references auth.users(id) on delete set null,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists maxx_intake_submissions_tenant_created_idx
  on public.maxx_intake_submissions (tenant_id, created_at desc);
create index if not exists maxx_action_proposals_tenant_status_idx
  on public.maxx_action_proposals (tenant_id, status, created_at desc);
create index if not exists maxx_evidence_ledger_tenant_created_idx
  on public.maxx_evidence_ledger (tenant_id, created_at desc);

alter table public.maxx_icm_tenants enable row level security;
alter table public.maxx_icm_memberships enable row level security;
alter table public.maxx_intake_submissions enable row level security;
alter table public.maxx_action_proposals enable row level security;
alter table public.maxx_client_notes enable row level security;
alter table public.maxx_evidence_ledger enable row level security;

create or replace function public.maxx_is_icm_member(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null
     and exists (
       select 1
       from public.maxx_icm_memberships m
       where m.tenant_id = p_tenant_id
         and m.user_id = auth.uid()
     );
$$;

create or replace function public.maxx_icm_role(p_tenant_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select m.role
  from public.maxx_icm_memberships m
  where m.tenant_id = p_tenant_id
    and m.user_id = auth.uid()
  limit 1;
$$;

drop policy if exists maxx_icm_tenants_select on public.maxx_icm_tenants;
create policy maxx_icm_tenants_select on public.maxx_icm_tenants
  for select using (public.maxx_is_icm_member(id));

drop policy if exists maxx_icm_memberships_select on public.maxx_icm_memberships;
create policy maxx_icm_memberships_select on public.maxx_icm_memberships
  for select using (user_id = auth.uid() or public.maxx_is_icm_member(tenant_id));

drop policy if exists maxx_intake_submissions_select on public.maxx_intake_submissions;
create policy maxx_intake_submissions_select on public.maxx_intake_submissions
  for select using (public.maxx_is_icm_member(tenant_id));

drop policy if exists maxx_action_proposals_select on public.maxx_action_proposals;
create policy maxx_action_proposals_select on public.maxx_action_proposals
  for select using (public.maxx_is_icm_member(tenant_id));

drop policy if exists maxx_client_notes_select on public.maxx_client_notes;
create policy maxx_client_notes_select on public.maxx_client_notes
  for select using (public.maxx_is_icm_member(tenant_id));

drop policy if exists maxx_evidence_ledger_select on public.maxx_evidence_ledger;
create policy maxx_evidence_ledger_select on public.maxx_evidence_ledger
  for select using (public.maxx_is_icm_member(tenant_id));

create or replace function public.maxx_review_action_proposal(
  p_proposal_id uuid,
  p_decision text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_proposal public.maxx_action_proposals%rowtype;
  v_role text;
  v_note_id uuid;
  v_result jsonb;
begin
  if v_user is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select *
    into v_proposal
    from public.maxx_action_proposals
   where id = p_proposal_id
   for update;

  if not found then
    raise exception 'proposal_not_found' using errcode = 'P0002';
  end if;

  select role into v_role
    from public.maxx_icm_memberships
   where tenant_id = v_proposal.tenant_id
     and user_id = v_user
   limit 1;

  if coalesce(v_role, '') not in ('owner','operator','reviewer') then
    raise exception 'review_not_authorized' using errcode = '42501';
  end if;

  if v_proposal.proposed_by = v_user then
    raise exception 'self_approval_forbidden' using errcode = '42501';
  end if;

  if p_decision not in ('approve','reject') then
    raise exception 'decision_must_be_approve_or_reject' using errcode = '22023';
  end if;

  if v_proposal.status = 'executed' then
    return jsonb_build_object(
      'proposal_id', v_proposal.id,
      'status', v_proposal.status,
      'replayed', true,
      'result', v_proposal.result
    );
  end if;

  if v_proposal.status = 'rejected' then
    return jsonb_build_object(
      'proposal_id', v_proposal.id,
      'status', 'rejected',
      'replayed', true,
      'result', v_proposal.result
    );
  end if;

  if p_decision = 'reject' then
    update public.maxx_action_proposals
       set status = 'rejected',
           reviewed_by = v_user,
           reviewed_at = now(),
           result = jsonb_build_object('decision','rejected','side_effects',0)
     where id = v_proposal.id
     returning result into v_result;

    insert into public.maxx_evidence_ledger(
      tenant_id, intake_submission_id, proposal_id, event_type,
      actor_type, actor_user_id, evidence
    )
    values (
      v_proposal.tenant_id, v_proposal.intake_submission_id, v_proposal.id,
      'action_rejected', 'human', v_user,
      jsonb_build_object('decision','reject','side_effects',0)
    );

    return jsonb_build_object(
      'proposal_id', v_proposal.id,
      'status', 'rejected',
      'replayed', false,
      'result', v_result
    );
  end if;

  if v_proposal.action_type <> 'create_client_note' then
    raise exception 'unsupported_action_type' using errcode = '22023';
  end if;

  insert into public.maxx_client_notes(
    tenant_id, intake_submission_id, proposal_id, note, created_by
  )
  values (
    v_proposal.tenant_id,
    v_proposal.intake_submission_id,
    v_proposal.id,
    coalesce(v_proposal.action_payload->>'note','Client Zero intake reviewed.'),
    v_user
  )
  on conflict (proposal_id) do nothing
  returning id into v_note_id;

  if v_note_id is null then
    select id into v_note_id
      from public.maxx_client_notes
     where proposal_id = v_proposal.id;
  end if;

  v_result := jsonb_build_object(
    'decision', 'approved',
    'action_type', v_proposal.action_type,
    'note_id', v_note_id,
    'side_effects', 1
  );

  update public.maxx_action_proposals
     set status = 'executed',
         reviewed_by = v_user,
         reviewed_at = now(),
         result = v_result
   where id = v_proposal.id;

  insert into public.maxx_evidence_ledger(
    tenant_id, intake_submission_id, proposal_id, event_type,
    actor_type, actor_user_id, evidence
  )
  values (
    v_proposal.tenant_id, v_proposal.intake_submission_id, v_proposal.id,
    'action_executed', 'human', v_user, v_result
  );

  return jsonb_build_object(
    'proposal_id', v_proposal.id,
    'status', 'executed',
    'replayed', false,
    'result', v_result
  );
end;
$$;

create or replace function public.maxx_export_intake_context(p_submission_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_submission public.maxx_intake_submissions%rowtype;
  v_tenant public.maxx_icm_tenants%rowtype;
begin
  if auth.uid() is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select * into v_submission
    from public.maxx_intake_submissions
   where id = p_submission_id;

  if not found then
    raise exception 'submission_not_found' using errcode = 'P0002';
  end if;

  if not public.maxx_is_icm_member(v_submission.tenant_id) then
    raise exception 'export_not_authorized' using errcode = '42501';
  end if;

  select * into v_tenant from public.maxx_icm_tenants where id = v_submission.tenant_id;

  return jsonb_build_object(
    'schema_version', '1.0',
    'exported_at', now(),
    'tenant', jsonb_build_object(
      'id', v_tenant.id,
      'slug', v_tenant.slug,
      'name', v_tenant.name
    ),
    'intake', to_jsonb(v_submission) - 'receipt_token',
    'proposals', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.created_at)
      from public.maxx_action_proposals p
      where p.intake_submission_id = v_submission.id
    ), '[]'::jsonb),
    'client_notes', coalesce((
      select jsonb_agg(to_jsonb(n) order by n.created_at)
      from public.maxx_client_notes n
      where n.intake_submission_id = v_submission.id
    ), '[]'::jsonb),
    'evidence_ledger', coalesce((
      select jsonb_agg(to_jsonb(e) order by e.created_at)
      from public.maxx_evidence_ledger e
      where e.intake_submission_id = v_submission.id
    ), '[]'::jsonb)
  );
end;
$$;

insert into public.maxx_icm_tenants (slug, name)
values ('macs-digital-media', 'Macs Digital Media')
on conflict (slug) do update set
  name = excluded.name,
  updated_at = now();
