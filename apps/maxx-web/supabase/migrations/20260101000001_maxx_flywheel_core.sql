-- Flywheel: multi-agency project + bead + agent session tracking.
-- Sits on top of maxx_organizations (one org per agency) from
-- 20260101000000_maxx_crm_core.sql. Seeds the 6 agencies as organizations.

create table maxx_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references maxx_organizations (id) on delete cascade,
  name text not null,
  description text,
  repo_url text,
  project_type text not null default 'other'
    check (project_type in ('website_build', 'ghl_migration', 'social_content', 'crm_setup', 'other')),
  status text not null default 'planned'
    check (status in ('planned', 'active', 'blocked', 'completed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index maxx_projects_org_idx on maxx_projects (organization_id);

create table maxx_beads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references maxx_organizations (id) on delete cascade,
  project_id uuid not null references maxx_projects (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'blocked', 'completed', 'cancelled')),
  assigned_agent text,
  depends_on uuid[] not null default '{}',
  bead_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index maxx_beads_project_idx on maxx_beads (project_id);
create index maxx_beads_org_idx on maxx_beads (organization_id);

create table maxx_flywheel_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references maxx_organizations (id) on delete cascade,
  project_id uuid not null references maxx_projects (id) on delete cascade,
  bead_id uuid references maxx_beads (id) on delete set null,
  model text not null default 'claude-sonnet-5',
  status text not null default 'running'
    check (status in ('running', 'completed', 'failed', 'awaiting_approval', 'stopped')),
  pr_url text,
  tokens_used int not null default 0,
  cost_usd numeric(10, 4) not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index maxx_flywheel_sessions_project_idx on maxx_flywheel_sessions (project_id);
create index maxx_flywheel_sessions_org_idx on maxx_flywheel_sessions (organization_id);

do $$
declare
  tenant_tables text[] := array['maxx_projects', 'maxx_beads', 'maxx_flywheel_sessions'];
  t text;
begin
  foreach t in array tenant_tables loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy "org access" on %I for all using (maxx_is_org_member(organization_id)) with check (maxx_is_org_member(organization_id));',
      t
    );
  end loop;
end $$;

-- Seed the 6 agencies as organizations.
insert into maxx_organizations (name, slug, mission_focus, plan) values
  ('The Pauli Effect', 'pauli-effect', 'Hub agency — multi-agency command center admin', 'sovereign_install_plus_partner'),
  ('Afromations', 'afromations', 'Digital media and brand storytelling', 'sovereign_install'),
  ('Macs Digital Media', 'macs-digital-media', 'Digital media agency', 'sovereign_install'),
  ('Kupuri Media', 'kupuri-media', 'Digital media agency — Mexico', 'sovereign_install'),
  ('Cheggie Media', 'cheggie-media', 'Digital media agency — Serbia', 'sovereign_install'),
  ('MyWebLane', 'myweblane', 'Digital media agency — India', 'sovereign_install');
