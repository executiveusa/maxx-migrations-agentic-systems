-- PRE-DEPLOY REVIEW CANDIDATE: service-role-only, exact-action CRUD API.
-- All functions run SECURITY INVOKER; the caller must hold the server-only
-- service_role key. The API always passes the VERIFIED Supabase JWT subject.
-- No passwords or role grants ever come from browser-provided user IDs.
-- Run only after PROPOSED-SCHEMA-AND-SEED.sql. Do not skip independent review.
CREATE OR REPLACE FUNCTION public.maxx_service_create_client_workspace(
 p_actor uuid, p_organization_id uuid, p_name text, p_slug text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
DECLARE v_id uuid;
BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM maxx.memberships m
   JOIN maxx.organizations o ON o.id=m.organization_id
   WHERE m.user_id=p_actor AND m.organization_id=p_organization_id
     AND m.status='active' AND m.role IN ('owner','admin')
     AND o.status='active' AND o.slug='macs-digital-media'
 ) THEN RAISE EXCEPTION 'client_admin_not_authorized' USING errcode='42501'; END IF;
 IF p_name IS NULL OR length(trim(p_name)) NOT BETWEEN 2 AND 100
   OR p_slug !~ '^[a-z][a-z0-9-]{2,60}$'
 THEN RAISE EXCEPTION 'invalid_client_name_or_slug' USING errcode='22023'; END IF;
 INSERT INTO maxx.projects(organization_id,slug,name,project_type,status,metadata)
 VALUES(p_organization_id,trim(p_slug),trim(p_name),'client','active',
        jsonb_build_object('source','operator-approved','integrations_verified',false))
 RETURNING id INTO v_id;
 INSERT INTO maxx.project_memberships
   (organization_id,project_id,user_id,role,status)
 VALUES(p_organization_id,v_id,p_actor,'owner','active');
 INSERT INTO maxx.audit_log
   (organization_id,project_id,actor_type,actor_id,action,object_type,object_id,payload_redacted)
 VALUES(p_organization_id,v_id,'human',p_actor::text,'client.created','project',v_id::text,
        jsonb_build_object('slug',p_slug));
 RETURN jsonb_build_object('id',v_id,'status','active','slug',p_slug);
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_create_client_workspace(uuid,uuid,text,text)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_create_client_workspace(uuid,uuid,text,text)
 TO service_role;

CREATE UNIQUE INDEX IF NOT EXISTS maxx_one_open_archive_request
 ON maxx.project_archive_requests(project_id)
 WHERE state IN ('requested','confirmed_one','confirmed_two');

CREATE OR REPLACE FUNCTION public.maxx_service_archive_client_step(
 p_actor uuid,
 p_project_id uuid,
 p_step text,
 p_request_id uuid DEFAULT NULL,
 p_typed_name text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
DECLARE
 v_project maxx.projects%rowtype;
 v_request maxx.project_archive_requests%rowtype;
BEGIN
 SELECT * INTO v_project FROM maxx.projects
 WHERE id=p_project_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'client_not_found' USING errcode='P0002'; END IF;
 IF NOT EXISTS (
   SELECT 1 FROM maxx.memberships m
   JOIN maxx.organizations o ON o.id=m.organization_id
   WHERE m.organization_id=v_project.organization_id
     AND m.user_id=p_actor AND m.status='active' AND m.role IN ('owner','admin')
     AND o.status='active' AND o.slug='macs-digital-media'
 ) THEN RAISE EXCEPTION 'client_admin_not_authorized' USING errcode='42501'; END IF;
 IF v_project.slug IN ('client-zero','macs-digital-media') THEN
   RAISE EXCEPTION 'protected_workspace_cannot_be_archived' USING errcode='42501'; END IF;

 IF p_step='start' THEN
   -- An abandoned three-step request must not block this client forever.
   -- Only expired unconfirmed requests are cancelled; no project data moves.
   UPDATE maxx.project_archive_requests SET state='cancelled'
   WHERE project_id=v_project.id
     AND state IN ('requested','confirmed_one','confirmed_two')
     AND created_at<now()-interval '24 hours';
   IF v_project.status<>'active' THEN
     RAISE EXCEPTION 'only_active_client_can_be_archived' USING errcode='22023'; END IF;
   INSERT INTO maxx.project_archive_requests
    (organization_id,project_id,requested_by,state,expected_project_name,action_hash)
   VALUES(v_project.organization_id,v_project.id,p_actor,'requested',v_project.name,
     encode(extensions.digest(convert_to(
       v_project.id::text || ':' || p_actor::text || ':' || transaction_timestamp()::text,
       'UTF8'),'sha256'),'hex'))
   RETURNING * INTO v_request;
 ELSIF p_step='cancel' THEN
   UPDATE maxx.project_archive_requests
   SET state='cancelled'
   WHERE id=p_request_id AND project_id=v_project.id
     AND requested_by=p_actor
     AND state IN ('requested','confirmed_one','confirmed_two')
   RETURNING * INTO v_request;
   IF NOT FOUND THEN RAISE EXCEPTION 'archive_request_cannot_cancel'
     USING errcode='22023'; END IF;
   RETURN jsonb_build_object('requestId',v_request.id,
     'projectId',v_project.id,'state','cancelled',
     'note','No client data was archived or deleted');
 ELSIF p_step='restore' THEN
   SELECT * INTO v_request FROM maxx.project_archive_requests
   WHERE id=p_request_id AND project_id=v_project.id
     AND state='archived' FOR UPDATE;
   IF NOT FOUND OR v_request.recovery_until<=now() OR v_project.status<>'archived' THEN
     RAISE EXCEPTION 'restore_window_unavailable' USING errcode='22023'; END IF;
   UPDATE maxx.projects SET status='active',updated_at=now()
    WHERE id=v_project.id;
   UPDATE maxx.project_archive_requests SET state='restored',restored_at=now()
    WHERE id=v_request.id;
   INSERT INTO maxx.audit_log
    (organization_id,project_id,actor_type,actor_id,action,object_type,object_id,payload_redacted)
   VALUES(v_project.organization_id,v_project.id,'human',p_actor::text,
     'client.restored','project',v_project.id::text,
     jsonb_build_object('request_id',v_request.id));
   RETURN jsonb_build_object('status','restored','projectId',v_project.id);
 ELSE
   SELECT * INTO v_request FROM maxx.project_archive_requests
   WHERE id=p_request_id AND project_id=v_project.id
    AND requested_by=p_actor FOR UPDATE;
   IF NOT FOUND OR v_request.created_at<now()-interval '24 hours'
       OR v_project.status<>'active' THEN
     RAISE EXCEPTION 'archive_request_unavailable' USING errcode='22023'; END IF;
   IF p_step='acknowledge' AND v_request.state='requested' THEN
     UPDATE maxx.project_archive_requests SET state='confirmed_one'
       WHERE id=v_request.id;
     v_request.state:='confirmed_one';
   ELSIF p_step='type_name' AND v_request.state='confirmed_one' THEN
     IF p_typed_name IS DISTINCT FROM v_request.expected_project_name THEN
       RAISE EXCEPTION 'client_name_mismatch' USING errcode='22023'; END IF;
     UPDATE maxx.project_archive_requests SET state='confirmed_two'
       WHERE id=v_request.id;
     v_request.state:='confirmed_two';
   ELSIF p_step='archive' AND v_request.state='confirmed_two' THEN
     -- No archive while actual work remains active or pending owner decision.
     IF EXISTS (
       SELECT 1 FROM maxx.workflow_runs r
       WHERE r.project_id=v_project.id
         AND r.organization_id=v_project.organization_id
         AND r.status IN ('queued','running','blocked','waiting_approval')
     ) OR EXISTS (
       SELECT 1 FROM maxx.approvals a
       JOIN maxx.action_proposals ap ON ap.id=a.action_proposal_id
       WHERE ap.project_id=v_project.id
         AND ap.organization_id=v_project.organization_id
         AND a.organization_id=v_project.organization_id
         AND a.status='pending'
     ) THEN RAISE EXCEPTION 'client_has_active_missions_or_approvals'
       USING errcode='55000'; END IF;
     UPDATE maxx.projects SET status='archived',updated_at=now()
       WHERE id=v_project.id;
     UPDATE maxx.project_archive_requests SET state='archived',
       archived_at=now(), recovery_until=now()+interval '30 days'
       WHERE id=v_request.id RETURNING * INTO v_request;
     INSERT INTO maxx.audit_log
       (organization_id,project_id,actor_type,actor_id,action,object_type,object_id,payload_redacted)
     VALUES(v_project.organization_id,v_project.id,'human',p_actor::text,
       'client.archived','project',v_project.id::text,
       jsonb_build_object('request_id',v_request.id,'recovery_until',v_request.recovery_until));
   ELSE
     RAISE EXCEPTION 'invalid_archive_state_transition' USING errcode='22023';
   END IF;
 END IF;
 RETURN jsonb_build_object('requestId',v_request.id,
   'projectId',v_project.id,'state',v_request.state,
   'recoveryUntil',v_request.recovery_until,
   'note','The project and its server records are retained; no hard deletion.');
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_archive_client_step(uuid,uuid,text,uuid,text)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_archive_client_step(uuid,uuid,text,uuid,text)
  TO service_role;

-- Important: even an expired archive record is retained until separate
-- legally reviewed retention/purge policy. No cron purge is installed.
