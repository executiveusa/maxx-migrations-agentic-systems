-- REVIEW CANDIDATE ONLY. DO NOT RUN AGAINST SHARED botanic-creations.
-- Generate a versioned migration using Supabase CLI AFTER independent security
-- review and a disposable database dry-run.
-- Current legacy `maxx.projects` org RLS is too broad for client records.
-- ALL existing query/writing surfaces must also enforce project identity.
BEGIN;
-- A composite key prevents a membership, prompt or archive row from referring
-- to a project belonging to another organization. Mandatory on the final
-- reviewed migration, even when the service role can bypass RLS.
CREATE UNIQUE INDEX IF NOT EXISTS maxx_projects_org_id_id_unique
 ON maxx.projects (organization_id,id);
CREATE TABLE IF NOT EXISTS maxx.project_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES maxx.organizations(id),
  project_id uuid NOT NULL,
  CONSTRAINT project_scope_fk FOREIGN KEY (organization_id, project_id)
    REFERENCES maxx.projects(organization_id,id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('owner','admin','operator','reviewer','viewer')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id,user_id)
);
CREATE INDEX IF NOT EXISTS project_memberships_active_user_idx
  ON maxx.project_memberships(user_id,project_id) WHERE status='active';
ALTER TABLE maxx.project_memberships ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON maxx.project_memberships FROM PUBLIC, anon, authenticated;
-- All access through approved MAXX control plane only, using server-only creds,
-- authenticated Google subject ID and both org AND project memberships.

CREATE TABLE IF NOT EXISTS maxx.project_prompt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES maxx.organizations(id),
  project_id uuid NOT NULL,
  CONSTRAINT project_scope_fk FOREIGN KEY (organization_id, project_id)
    REFERENCES maxx.projects(organization_id,id),
  title text NOT NULL CHECK (length(title) BETWEEN 3 AND 300),
  provenance text NOT NULL DEFAULT 'operator_template',
  position integer NOT NULL CHECK (position BETWEEN 1 AND 20),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, position)
);
ALTER TABLE maxx.project_prompt_templates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON maxx.project_prompt_templates FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS maxx.project_archive_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES maxx.organizations(id),
  project_id uuid NOT NULL,
  CONSTRAINT project_scope_fk FOREIGN KEY (organization_id, project_id)
    REFERENCES maxx.projects(organization_id,id),
  requested_by uuid NOT NULL REFERENCES auth.users(id),
  state text NOT NULL DEFAULT 'requested'
    CHECK (state IN ('requested','confirmed_one','confirmed_two','archived','restored','cancelled')),
  expected_project_name text NOT NULL,
  action_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  recovery_until timestamptz,
  restored_at timestamptz,
  CHECK (
    (state <> 'archived' AND (recovery_until IS NULL OR archived_at IS NOT NULL))
    OR (state = 'archived' AND archived_at IS NOT NULL
      AND recovery_until IS NOT NULL
      AND recovery_until >= archived_at + interval '30 days')
  )
);
ALTER TABLE maxx.project_archive_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON maxx.project_archive_requests FROM PUBLIC, anon, authenticated;

-- New private MAXX tables: the browser's anon/authenticated clients cannot
-- access them directly. Grant only the control-plane's server role.
GRANT SELECT,INSERT,UPDATE,DELETE ON
  maxx.project_memberships,maxx.project_prompt_templates,
  maxx.project_archive_requests TO service_role;

-- Seed seven USER-NAMED clients under one EXISTING MACS organization.
-- Only names are user-confirmed; prompts remain proposed examples.
WITH seed(slug,name,kind) AS (
  VALUES
  ('crown-and-core','CROWN AND CORE','client'),
  ('thp-flooring','THP FLOORING','client'),
  ('bunna-restaurant','BUNNA RESTAURANT','client'),
  ('macs-digital-media','MACS DIGITAL MEDIA','internal'),
  ('asc3nd','ASC3ND','client'),
  ('3x-plumbers','3X PLUMBERS','client'),
  ('tangles-and-locs','TANGLES AND LOCS','client')
)
INSERT INTO maxx.projects(organization_id,slug,name,project_type,status,metadata)
SELECT o.id,seed.slug,seed.name,seed.kind,'active',
  jsonb_build_object('source','operator-named-client','integrations_verified',false)
FROM seed CROSS JOIN maxx.organizations o
WHERE o.slug='macs-digital-media' AND o.status='active'
ON CONFLICT (organization_id,slug) DO NOTHING;
-- Seed reusable company-specific task prompts. Source is operator-approved
-- template, NOT evidence of historical frequently executed missions.
WITH seed(slug,position,title) AS (
 VALUES
 ('crown-and-core',1,'Review consultation requests and booking questions.'),
 ('crown-and-core',2,'Draft a follow-up for approval.'),
 ('crown-and-core',3,'Show pending company decisions.'),
 ('crown-and-core',4,'Prepare a salon promotion with verified services.'),
 ('thp-flooring',1,'Review open flooring estimates.'),
 ('thp-flooring',2,'Prepare follow-ups for unanswered project leads.'),
 ('thp-flooring',3,'Draft a before-and-after post from approved photos.'),
 ('thp-flooring',4,'Show flooring jobs waiting for approval.'),
 ('bunna-restaurant',1,'Audit the online ordering path.'),
 ('bunna-restaurant',2,'Reconcile recorded cash and card receipts.'),
 ('bunna-restaurant',3,'Draft a group-meal campaign for owner approval.'),
 ('bunna-restaurant',4,'Show Bunna decisions awaiting approval.'),
 ('macs-digital-media',1,'Show urgent approvals across authorized clients.'),
 ('macs-digital-media',2,'Prepare a verified delivery and revenue report.'),
 ('macs-digital-media',3,'Identify client follow-ups awaiting owner approval.'),
 ('macs-digital-media',4,'Suggest the next revenue-generating task.'),
 ('asc3nd',1,'Review onboarding and activation issues.'),
 ('asc3nd',2,'Draft a community engagement campaign.'),
 ('asc3nd',3,'Summarize verified weekly progress.'),
 ('asc3nd',4,'Show ASC3ND decisions awaiting review.'),
 ('3x-plumbers',1,'Review unanswered service requests.'),
 ('3x-plumbers',2,'Follow up on estimates and callbacks.'),
 ('3x-plumbers',3,'Draft a local plumbing FAQ using approved facts.'),
 ('3x-plumbers',4,'Show urgent pending owner actions.'),
 ('tangles-and-locs',1,'Review appointment gaps and cancellations.'),
 ('tangles-and-locs',2,'Draft a client win-back message for approval.'),
 ('tangles-and-locs',3,'Prepare an educational haircare post.'),
 ('tangles-and-locs',4,'Show booking follow-ups awaiting review.')
)
INSERT INTO maxx.project_prompt_templates(organization_id,project_id,title,position,provenance)
SELECT p.organization_id,p.id,seed.title,seed.position,'operator_template'
FROM seed JOIN maxx.projects p ON p.slug=seed.slug
JOIN maxx.organizations o ON o.id=p.organization_id
WHERE o.slug='macs-digital-media'
ON CONFLICT (project_id,position) DO NOTHING;
-- NO automatic user membership, provider credentials or fake approvals seeded.
-- NO purge job. Three separate server-bound confirmations are mandatory before
-- `archived`, and automatic restoration remains available for >=30 days.
COMMIT;

-- Acceptance before executing on the shared project:
-- 1) Review existing maxx.projects/project-linked RLS for cross-project leaks
-- 2) Server endpoints enforce auth.uid() from verified JWT, not metadata
-- 3) Verify membership two-tenant test with independent user principals
-- 4) Verify archive expires >=30 days and no hard delete/side-effect purge
-- 5) Preserve existing Client Zero and Bunna RLS + shareable recovery backup
-- 6) Verify row/column grants and non-exposed private schema boundaries
