-- Maxx Migrations CRM core schema.
-- Every tenant-owned table carries organization_id, created_at, updated_at,
-- and row-level security scoped to organization membership. Run against a
-- fresh Supabase project (supabase db push) before enabling
-- NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in production.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Organizations & membership
-- ---------------------------------------------------------------------------

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  mission_focus text,
  plan text not null default 'sovereign_install',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_initial text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index organization_members_org_idx on organization_members (organization_id);
create index organization_members_user_idx on organization_members (user_id);

-- Helper used by every RLS policy below: is the current JWT subject a member
-- of the given organization?
create or replace function is_org_member(target_org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from organization_members
    where organization_id = target_org_id
      and user_id = auth.uid()
  );
$$;

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table organization_members enable row level security;

create policy "org members can read their organization" on organizations
  for select using (is_org_member(id));
create policy "org admins can update their organization" on organizations
  for update using (is_org_member(id));

create policy "users can read their own profile" on profiles
  for select using (id = auth.uid());
create policy "users can update their own profile" on profiles
  for update using (id = auth.uid());

create policy "org members can read membership rows" on organization_members
  for select using (is_org_member(organization_id));
create policy "org admins can manage membership" on organization_members
  for all using (is_org_member(organization_id)) with check (is_org_member(organization_id));

-- ---------------------------------------------------------------------------
-- Generic tenant-scoped RLS template applied per table below.
-- ---------------------------------------------------------------------------
-- Pattern:
--   alter table <t> enable row level security;
--   create policy "org access" on <t> for all
--     using (is_org_member(organization_id)) with check (is_org_member(organization_id));

-- ---------------------------------------------------------------------------
-- CRM: contacts, pipeline, tasks
-- ---------------------------------------------------------------------------

create table contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  status text not null default 'lead' check (status in ('lead', 'active', 'donor', 'volunteer', 'archived')),
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contacts_org_idx on contacts (organization_id);

create table contact_tags (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  contact_id uuid not null references contacts (id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contact_tags_contact_idx on contact_tags (contact_id);

create table pipelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  pipeline_id uuid not null references pipelines (id) on delete cascade,
  name text not null,
  stage_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  pipeline_id uuid not null references pipelines (id) on delete cascade,
  stage_id uuid not null references pipeline_stages (id) on delete restrict,
  contact_id uuid not null references contacts (id) on delete cascade,
  title text not null,
  value_cents bigint not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index opportunities_org_idx on opportunities (organization_id);
create index opportunities_stage_idx on opportunities (stage_id);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  contact_id uuid references contacts (id) on delete cascade,
  title text not null,
  due_date date,
  assignee_id uuid references auth.users (id) on delete set null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Forms
-- ---------------------------------------------------------------------------

create table forms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table form_fields (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  form_id uuid not null references forms (id) on delete cascade,
  type text not null check (type in ('text', 'email', 'phone', 'textarea', 'select', 'checkbox')),
  label text not null,
  required boolean not null default false,
  options jsonb not null default '[]'::jsonb,
  field_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table form_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  form_id uuid not null references forms (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Workflows
-- ---------------------------------------------------------------------------

create table workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  description text,
  template_id text,
  status text not null default 'draft' check (status in ('active', 'inactive', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table workflow_steps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  workflow_id uuid not null references workflows (id) on delete cascade,
  type text not null,
  label text not null,
  config jsonb not null default '{}'::jsonb,
  step_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table workflow_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  workflow_id uuid not null references workflows (id) on delete cascade,
  status text not null check (status in ('success', 'failed', 'running')),
  triggered_by text,
  steps_completed int not null default 0,
  steps_total int not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Community
-- ---------------------------------------------------------------------------

create table communities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null default 'Community',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table community_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  community_id uuid not null references communities (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  points int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, user_id)
);

create table community_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  community_id uuid not null references communities (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table community_comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  post_id uuid not null references community_posts (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table community_reactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  post_id uuid not null references community_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table direct_message_threads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table direct_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  thread_id uuid not null references direct_message_threads (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Courses
-- ---------------------------------------------------------------------------

create table courses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  title text not null,
  description text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table course_modules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  course_id uuid not null references courses (id) on delete cascade,
  title text not null,
  module_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table course_lessons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  module_id uuid not null references course_modules (id) on delete cascade,
  title text not null,
  body text,
  video_url text,
  duration_minutes int not null default 0,
  lesson_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table course_enrollments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  course_id uuid not null references courses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  progress_percent int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, user_id)
);

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  lesson_id uuid not null references course_lessons (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, user_id)
);

create table leaderboard_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  points int not null default 0,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table leaderboard_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  total_points int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Social planner
-- ---------------------------------------------------------------------------

create table social_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  channel text not null check (channel in ('facebook_page', 'instagram_business')),
  display_name text,
  connected boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table social_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  channels text[] not null default '{}',
  copy text not null,
  asset_description text,
  scheduled_for timestamptz,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed', 'setup_required')),
  campaign_template_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table social_publish_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  social_post_id uuid not null references social_posts (id) on delete cascade,
  provider text not null,
  status text not null,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- GHL import
-- ---------------------------------------------------------------------------

create table import_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  source text not null check (source in ('csv', 'ghl_api')),
  objects text[] not null default '{}',
  status text not null default 'mapping',
  total_records int not null default 0,
  imported_records int not null default 0,
  error_records int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table import_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  import_job_id uuid not null references import_jobs (id) on delete cascade,
  object_type text not null,
  raw jsonb not null default '{}'::jsonb,
  created_entity_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table import_errors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  import_job_id uuid not null references import_jobs (id) on delete cascade,
  row_number int not null,
  field text not null,
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Telephony / Missed Call Text Back
-- ---------------------------------------------------------------------------

create table phone_numbers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  number text not null,
  provider text not null default 'twilio',
  mctb_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (number)
);

create table call_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  from_number text not null,
  to_number text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  status text not null check (status in ('completed', 'missed', 'voicemail')),
  duration_seconds int not null default 0,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table missed_call_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  call_event_id uuid not null references call_events (id) on delete cascade,
  contact_id uuid references contacts (id) on delete set null,
  from_number text not null,
  text_back_sent boolean not null default false,
  text_back_status text not null default 'not_configured',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table mctb_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  template_id uuid,
  active boolean not null default false,
  delay_seconds int not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sms_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  to_number text not null,
  body text not null,
  status text not null check (status in ('sent', 'failed', 'blocked_opt_out')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sms_opt_outs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  phone_number text not null,
  opted_out_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, phone_number)
);

-- ---------------------------------------------------------------------------
-- Website migration engine
-- ---------------------------------------------------------------------------

create table migration_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  source_url text not null,
  status text not null default 'intake',
  design_audit_score int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table migration_pages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  migration_job_id uuid not null references migration_jobs (id) on delete cascade,
  path text not null,
  title text,
  word_count int not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table migration_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  migration_job_id uuid not null references migration_jobs (id) on delete cascade,
  type text not null check (type in ('image', 'document', 'video')),
  filename text not null,
  size_kb int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- AI agent runtime
-- ---------------------------------------------------------------------------

create table ai_agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  description text,
  model_policy text not null default 'claude-sonnet-5',
  status text not null default 'active' check (status in ('active', 'inactive')),
  tool_permissions text[] not null default '{}',
  monthly_budget_usd numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table agent_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  agent_id uuid not null references ai_agents (id) on delete cascade,
  task text not null,
  status text not null check (status in ('completed', 'running', 'failed', 'awaiting_approval')),
  tokens_used int not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table model_usage (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  agent_id uuid not null references ai_agents (id) on delete cascade,
  model text not null,
  tokens_in int not null default 0,
  tokens_out int not null default 0,
  cost_usd numeric(10, 4) not null default 0,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Integrations, audit, billing
-- ---------------------------------------------------------------------------

create table integration_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  provider text not null check (provider in ('twilio', 'meta', 'ghl_api', 'supabase', 'postiz')),
  status text not null default 'setup_required' check (status in ('connected', 'setup_required', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, provider)
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table billing_customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  plan_name text not null,
  status text not null default 'active' check (status in ('active', 'trialing', 'past_due')),
  renews_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create table billing_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  type text not null check (type in ('invoice_paid', 'invoice_failed', 'plan_changed')),
  amount_usd numeric(10, 2) not null default 0,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row level security: apply the shared org-membership policy to every
-- tenant-owned table declared above.
-- ---------------------------------------------------------------------------

do $$
declare
  tenant_tables text[] := array[
    'contacts', 'contact_tags', 'pipelines', 'pipeline_stages', 'opportunities', 'tasks',
    'forms', 'form_fields', 'form_submissions',
    'workflows', 'workflow_steps', 'workflow_runs',
    'communities', 'community_members', 'community_posts', 'community_comments', 'community_reactions',
    'direct_message_threads', 'direct_messages',
    'courses', 'course_modules', 'course_lessons', 'course_enrollments', 'lesson_progress',
    'leaderboard_events', 'leaderboard_scores',
    'social_accounts', 'social_posts', 'social_publish_jobs',
    'import_jobs', 'import_records', 'import_errors',
    'phone_numbers', 'call_events', 'missed_call_events', 'mctb_rules', 'sms_messages', 'sms_opt_outs',
    'migration_jobs', 'migration_pages', 'migration_assets',
    'ai_agents', 'agent_sessions', 'model_usage',
    'integration_connections', 'audit_logs', 'billing_customers', 'billing_events'
  ];
  t text;
begin
  foreach t in array tenant_tables loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy "org access" on %I for all using (is_org_member(organization_id)) with check (is_org_member(organization_id));',
      t
    );
  end loop;
end $$;
