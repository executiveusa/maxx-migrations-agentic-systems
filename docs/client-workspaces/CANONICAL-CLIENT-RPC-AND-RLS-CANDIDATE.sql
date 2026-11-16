-- REVIEW REQUIRED: one canonical read API for Agent MAXX, not a second
-- app/server. Private maxx tables should not need to be added to Data API
-- exposed schemas. Only the service role may call this public schema RPC.
-- Apply AFTER project_memberships and project_prompt_templates tables.
-- No changes to Bunna's other schemas, no client user grants.
CREATE OR REPLACE FUNCTION public.maxx_service_client_workspaces(p_user_id uuid)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = pg_catalog, maxx, public
AS $$
 SELECT COALESCE(jsonb_agg(
   jsonb_build_object(
      'id', p.id::text,
      'organizationId', p.organization_id::text,
      'slug', p.slug,
      'name', p.name,
      'role', CASE WHEN m.role IN ('owner','admin') THEN m.role ELSE pm.role END,
      'status', p.status,
      'archiveRequestId', (
        SELECT ar.id::text FROM maxx.project_archive_requests ar
        WHERE ar.project_id=p.id AND ar.organization_id=p.organization_id
          AND ar.state='archived' ORDER BY ar.archived_at DESC LIMIT 1
      ),
      'recoveryUntil', (
        SELECT ar.recovery_until FROM maxx.project_archive_requests ar
        WHERE ar.project_id=p.id AND ar.organization_id=p.organization_id
          AND ar.state='archived' ORDER BY ar.archived_at DESC LIMIT 1
      ),
      'suggestedTasks', COALESCE((
        SELECT jsonb_agg(t.title ORDER BY t.position)
        FROM maxx.project_prompt_templates t
        WHERE t.project_id = p.id
          AND t.organization_id = p.organization_id AND t.active
      ), '[]'::jsonb),
      -- Templates are operator-authored suggestions, not verified historical tasks.
      'promptsSource', 'operator_template',
      'pendingApprovalCount', (
        SELECT COUNT(*)::int
        FROM maxx.approvals a
        JOIN maxx.action_proposals ap
          ON ap.id = a.action_proposal_id
         AND ap.organization_id = a.organization_id
        WHERE ap.organization_id = p.organization_id
          AND ap.project_id = p.id
          AND a.status = 'pending'
      ),
      -- Scope is verified for `maxx.approvals`, but historical
      -- `public.maxx_approvals` is an operator-level store without project_id.
      -- Do not call a zero scoped count the absence of *all* approvals.
      'approvalCoverage', 'maxx_only',
      'urgentApprovalCount', (
        SELECT COUNT(*)::int
        FROM maxx.approvals a
        JOIN maxx.action_proposals ap
          ON ap.id = a.action_proposal_id
         AND ap.organization_id = a.organization_id
        WHERE ap.organization_id = p.organization_id
          AND ap.project_id = p.id
          AND a.status = 'pending'
          AND a.expires_at <= now() + interval '24 hours'
      )
   ) ORDER BY p.name
 ), '[]'::jsonb)
 FROM maxx.memberships m
 JOIN maxx.organizations o
   ON o.id = m.organization_id AND o.status = 'active'
 JOIN maxx.projects p
   ON p.organization_id = m.organization_id
 LEFT JOIN maxx.project_memberships pm
   ON pm.project_id = p.id
  AND pm.organization_id = p.organization_id
  AND pm.user_id = m.user_id AND pm.status='active'
 WHERE m.user_id = p_user_id AND m.status='active'
   AND (m.role IN ('owner','admin') OR pm.id IS NOT NULL)
   AND p.status IN ('active','paused','archived');
$$;

REVOKE ALL ON FUNCTION public.maxx_service_client_workspaces(uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_client_workspaces(uuid) TO service_role;

-- These restrictive policies narrow existing permissive organization-wide
-- RLS; the service role bypasses RLS, so backend membership verification is
-- independently required and remains the primary authorization boundary.
-- Scoped permission helper: org owner/admin sees all clients; other org
-- members see only explicit active project assignments.
CREATE OR REPLACE FUNCTION maxx.can_access_client_project(
  p_organization_id uuid, p_project_id uuid, p_roles text[]
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, maxx
AS $$
 SELECT EXISTS (
   SELECT 1 FROM maxx.memberships m
   WHERE m.organization_id = p_organization_id
     AND m.user_id = auth.uid() AND m.status = 'active'
     AND m.role IN ('owner','admin')
 ) OR EXISTS (
   SELECT 1
   FROM maxx.memberships m
   JOIN maxx.project_memberships pm
     ON pm.organization_id = m.organization_id
    AND pm.user_id = m.user_id AND pm.status = 'active'
   WHERE m.organization_id = p_organization_id
     AND m.user_id = auth.uid() AND m.status = 'active'
     AND pm.project_id = p_project_id
     AND pm.role = ANY(p_roles)
 );
$$;
REVOKE ALL ON FUNCTION maxx.can_access_client_project(uuid,uuid,text[])
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION maxx.can_access_client_project(uuid,uuid,text[])
  TO authenticated,service_role;

DROP POLICY IF EXISTS maxx_v3_project_read_scope ON maxx.projects;
CREATE POLICY maxx_v3_project_read_scope ON maxx.projects
AS RESTRICTIVE FOR SELECT TO authenticated
USING (maxx.can_access_client_project(organization_id,id,
  ARRAY['owner','admin','operator','reviewer','viewer']::text[]));

DROP POLICY IF EXISTS maxx_v3_project_write_scope ON maxx.projects;
CREATE POLICY maxx_v3_project_write_scope ON maxx.projects
AS RESTRICTIVE FOR UPDATE TO authenticated
USING (maxx.has_role(organization_id,ARRAY['owner','admin']::text[]))
WITH CHECK (maxx.has_role(organization_id,ARRAY['owner','admin']::text[]));

DROP POLICY IF EXISTS maxx_v3_project_insert_scope ON maxx.projects;
CREATE POLICY maxx_v3_project_insert_scope ON maxx.projects
AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (maxx.has_role(organization_id,ARRAY['owner','admin']::text[]));

DROP POLICY IF EXISTS maxx_v3_project_delete_scope ON maxx.projects;
CREATE POLICY maxx_v3_project_delete_scope ON maxx.projects
AS RESTRICTIVE FOR DELETE TO authenticated USING (false);

-- All project-linked tables: org-wide RLS alone is insufficient for client
-- isolation. For NULL project refs, only org owner/admin may see the row.
DO $scope$
DECLARE t text;
BEGIN
 FOREACH t IN ARRAY ARRAY[
  'action_proposals','artifacts','audit_log','context_snapshots',
  'events','evidence_receipts','external_refs','workflow_runs'
 ] LOOP
  EXECUTE format('DROP POLICY IF EXISTS maxx_v3_scope_select ON maxx.%I',t);
  EXECUTE format(
   'CREATE POLICY maxx_v3_scope_select ON maxx.%I
    AS RESTRICTIVE FOR SELECT TO authenticated
    USING (maxx.has_role(organization_id,ARRAY[''owner'',''admin'']::text[])
      OR (project_id IS NOT NULL
        AND maxx.can_access_client_project(organization_id,project_id,
          ARRAY[''owner'',''admin'',''operator'',''reviewer'',''viewer'']::text[])))',t);
  EXECUTE format('DROP POLICY IF EXISTS maxx_v3_scope_insert ON maxx.%I',t);
  EXECUTE format(
   'CREATE POLICY maxx_v3_scope_insert ON maxx.%I
    AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK
      (maxx.has_role(organization_id,ARRAY[''owner'',''admin'']::text[])
      OR (project_id IS NOT NULL
        AND maxx.can_access_client_project(organization_id,project_id,
          ARRAY[''owner'',''admin'',''operator'']::text[])))',t);
  EXECUTE format('DROP POLICY IF EXISTS maxx_v3_scope_update ON maxx.%I',t);
  EXECUTE format(
   'CREATE POLICY maxx_v3_scope_update ON maxx.%I
    AS RESTRICTIVE FOR UPDATE TO authenticated
    USING (maxx.has_role(organization_id,ARRAY[''owner'',''admin'']::text[])
      OR (project_id IS NOT NULL AND maxx.can_access_client_project(
       organization_id,project_id,ARRAY[''owner'',''admin'',''operator'']::text[])))
    WITH CHECK (maxx.has_role(organization_id,ARRAY[''owner'',''admin'']::text[])
      OR (project_id IS NOT NULL AND maxx.can_access_client_project(
       organization_id,project_id,ARRAY[''owner'',''admin'',''operator'']::text[])))',t);
 END LOOP;
END
$scope$;

-- Project-unassigned intake leads contain direct personal data. Do not show
-- them to non-admin operators until they have a verified project assignment.
DROP POLICY IF EXISTS maxx_v3_intake_scope ON maxx.lead_intakes;
CREATE POLICY maxx_v3_intake_scope ON maxx.lead_intakes
AS RESTRICTIVE FOR SELECT TO authenticated
USING (maxx.has_role(organization_id,ARRAY['owner','admin']::text[]));

DROP POLICY IF EXISTS maxx_v3_membership_scope ON maxx.memberships;
CREATE POLICY maxx_v3_membership_scope ON maxx.memberships
AS RESTRICTIVE FOR SELECT TO authenticated
USING (user_id=auth.uid() OR maxx.has_role(organization_id,ARRAY['owner','admin']::text[]));

-- Separate scoping of run_steps and approvals requires joins to their parent
-- run/proposal and is intentionally NOT covered by the above loop. These are
-- release blockers until their RLS rules and current app assumptions are reviewed.

-- Parent-linked tenant isolation covers two high-risk child tables that lack
-- their own project_id. Do not release the migration without these policies.
-- Organization ownership remains allowed; non-owner roles require an active
-- project membership at the corresponding parent.
DROP POLICY IF EXISTS maxx_v3_run_steps_select ON maxx.run_steps;
CREATE POLICY maxx_v3_run_steps_select ON maxx.run_steps
AS RESTRICTIVE FOR SELECT TO authenticated
USING (
  maxx.has_role(organization_id,ARRAY['owner','admin']::text[])
  OR EXISTS (
    SELECT 1 FROM maxx.workflow_runs parent
    WHERE parent.id=run_id AND parent.organization_id=run_steps.organization_id
      AND parent.project_id IS NOT NULL
      AND maxx.can_access_client_project(parent.organization_id,parent.project_id,
        ARRAY['owner','admin','operator','reviewer','viewer']::text[])
  )
);

DROP POLICY IF EXISTS maxx_v3_run_steps_insert ON maxx.run_steps;
CREATE POLICY maxx_v3_run_steps_insert ON maxx.run_steps
AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (
  maxx.has_role(organization_id,ARRAY['owner','admin']::text[])
  OR EXISTS (
    SELECT 1 FROM maxx.workflow_runs parent
    WHERE parent.id=run_id AND parent.organization_id=run_steps.organization_id
      AND parent.project_id IS NOT NULL
      AND maxx.can_access_client_project(parent.organization_id,parent.project_id,
        ARRAY['owner','admin','operator']::text[])
  )
);

DROP POLICY IF EXISTS maxx_v3_run_steps_update ON maxx.run_steps;
CREATE POLICY maxx_v3_run_steps_update ON maxx.run_steps
AS RESTRICTIVE FOR UPDATE TO authenticated
USING (
  maxx.has_role(organization_id,ARRAY['owner','admin']::text[])
  OR EXISTS (
    SELECT 1 FROM maxx.workflow_runs parent
    WHERE parent.id=run_id AND parent.organization_id=run_steps.organization_id
      AND parent.project_id IS NOT NULL
      AND maxx.can_access_client_project(parent.organization_id,parent.project_id,
        ARRAY['owner','admin','operator']::text[])
  )
)
WITH CHECK (
  maxx.has_role(organization_id,ARRAY['owner','admin']::text[])
  OR EXISTS (
    SELECT 1 FROM maxx.workflow_runs parent
    WHERE parent.id=run_id AND parent.organization_id=run_steps.organization_id
      AND parent.project_id IS NOT NULL
      AND maxx.can_access_client_project(parent.organization_id,parent.project_id,
        ARRAY['owner','admin','operator']::text[])
  )
);

DROP POLICY IF EXISTS maxx_v3_approvals_select ON maxx.approvals;
CREATE POLICY maxx_v3_approvals_select ON maxx.approvals
AS RESTRICTIVE FOR SELECT TO authenticated
USING (
  maxx.has_role(organization_id,ARRAY['owner','admin']::text[])
  OR EXISTS (
    SELECT 1 FROM maxx.action_proposals parent
    WHERE parent.id=action_proposal_id
      AND parent.organization_id=approvals.organization_id
      AND parent.project_id IS NOT NULL
      AND maxx.can_access_client_project(parent.organization_id,parent.project_id,
        ARRAY['owner','admin','operator','reviewer','viewer']::text[])
  )
);

DROP POLICY IF EXISTS maxx_v3_approvals_insert ON maxx.approvals;
CREATE POLICY maxx_v3_approvals_insert ON maxx.approvals
AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (
  maxx.has_role(organization_id,ARRAY['owner','admin']::text[])
  OR EXISTS (
    SELECT 1 FROM maxx.action_proposals parent
    WHERE parent.id=action_proposal_id
      AND parent.organization_id=approvals.organization_id
      AND parent.project_id IS NOT NULL
      AND maxx.can_access_client_project(parent.organization_id,parent.project_id,
        ARRAY['owner','admin','reviewer']::text[])
  )
);

DROP POLICY IF EXISTS maxx_v3_approvals_update ON maxx.approvals;
CREATE POLICY maxx_v3_approvals_update ON maxx.approvals
AS RESTRICTIVE FOR UPDATE TO authenticated
USING (
  maxx.has_role(organization_id,ARRAY['owner','admin']::text[])
  OR EXISTS (
    SELECT 1 FROM maxx.action_proposals parent
    WHERE parent.id=action_proposal_id
      AND parent.organization_id=approvals.organization_id
      AND parent.project_id IS NOT NULL
      AND maxx.can_access_client_project(parent.organization_id,parent.project_id,
        ARRAY['owner','admin','reviewer']::text[])
  )
)
WITH CHECK (
  maxx.has_role(organization_id,ARRAY['owner','admin']::text[])
  OR EXISTS (
    SELECT 1 FROM maxx.action_proposals parent
    WHERE parent.id=action_proposal_id
      AND parent.organization_id=approvals.organization_id
      AND parent.project_id IS NOT NULL
      AND maxx.can_access_client_project(parent.organization_id,parent.project_id,
        ARRAY['owner','admin','reviewer']::text[])
  )
);

-- NOTE: Updating RLS of legacy parent/child tables is potentially
-- behavior-changing for MAXX apps other than Agent MAXX. Independent review
-- must compare old and new access using actual role-scoped tests. No assumption
-- that the presence of an RLS policy alone constitutes a working isolation test.
