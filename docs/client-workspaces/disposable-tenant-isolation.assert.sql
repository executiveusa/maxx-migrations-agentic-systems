-- Real PostgreSQL RLS/authenticated-role integration assertions.
-- Called ONLY from the localhost disposable runner, in a transaction
-- that is explicitly ROLLBACKed by its shell wrapper.
INSERT INTO auth.users(id) VALUES
('11111111-1111-4111-8111-111111111111'),
('22222222-2222-4222-8222-222222222222'),
('33333333-3333-4333-8333-333333333333');
-- Alice is an org owner; Bob is an org operator with ONLY Bunna access.
-- Charlie has an auth.users record but no MAXX organization membership.
INSERT INTO maxx.memberships(organization_id,user_id,role,status) VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','owner','active'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','22222222-2222-4222-8222-222222222222','operator','active');
INSERT INTO maxx.project_memberships(organization_id,project_id,user_id,role,status)
SELECT p.organization_id,p.id,'22222222-2222-4222-8222-222222222222','operator','active'
FROM maxx.projects p WHERE p.slug='bunna-restaurant';
-- Fixtures for both parent-linked protected child tables.
INSERT INTO maxx.workflow_runs(id,organization_id,project_id,status)
SELECT '55555555-5555-4555-8555-555555555555',p.organization_id,p.id,'running'
FROM maxx.projects p WHERE p.slug='bunna-restaurant';
INSERT INTO maxx.workflow_runs(id,organization_id,project_id,status)
SELECT '66666666-6666-4666-8666-666666666666',p.organization_id,p.id,'completed'
FROM maxx.projects p WHERE p.slug='crown-and-core';
INSERT INTO maxx.run_steps(organization_id,run_id)
SELECT organization_id,id FROM maxx.workflow_runs;
INSERT INTO maxx.action_proposals(id,organization_id,project_id)
SELECT '77777777-7777-4777-8777-777777777777',organization_id,id
FROM maxx.projects WHERE slug='bunna-restaurant';
INSERT INTO maxx.action_proposals(id,organization_id,project_id)
SELECT '88888888-8888-4888-8888-888888888888',organization_id,id
FROM maxx.projects WHERE slug='crown-and-core';
INSERT INTO maxx.approvals(organization_id,action_proposal_id,status)
SELECT organization_id,id,'pending' FROM maxx.action_proposals;
-- Bob can see exactly his assigned client, including its run/approval,
-- but not another project within the SAME organization.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
DO $bob$
DECLARE n integer; affected integer; denied boolean := false;
BEGIN
  SELECT count(*) INTO n FROM maxx.projects;
  IF n <> 1 THEN RAISE EXCEPTION 'Bob sees % projects; expected 1',n; END IF;
  SELECT count(*) INTO n FROM maxx.projects WHERE slug='bunna-restaurant';
  IF n <> 1 THEN RAISE EXCEPTION 'Bob Bunna read denied'; END IF;
  SELECT count(*) INTO n FROM maxx.run_steps;
  IF n <> 1 THEN RAISE EXCEPTION 'Bob sees % run steps; expected Bunna only',n; END IF;
  SELECT count(*) INTO n FROM maxx.approvals;
  IF n <> 1 THEN RAISE EXCEPTION 'Bob sees % approvals; expected Bunna only',n; END IF;
  UPDATE maxx.approvals SET status='approved'
  WHERE action_proposal_id='88888888-8888-4888-8888-888888888888';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Bob updated a foreign client approval'; END IF;
  UPDATE maxx.projects SET name='CROSS CLIENT WRITE'
  WHERE slug='crown-and-core';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Bob updated a foreign project'; END IF;
  BEGIN
    INSERT INTO maxx.projects(organization_id,slug,name,project_type)
    VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','bob-unapproved','Unapproved','client');
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'Bob inserted a project without owner role'; END IF;
END
$bob$;
RESET ROLE;
-- Charlie has a valid JWT subject but absolutely no organization membership.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
DO $charlie$
BEGIN
  IF (SELECT count(*) FROM maxx.projects) <> 0
     OR (SELECT count(*) FROM maxx.approvals) <> 0
     OR (SELECT count(*) FROM maxx.run_steps) <> 0 THEN
    RAISE EXCEPTION 'Unaffiliated authenticated user can see private tenant data';
  END IF;
END
$charlie$;
RESET ROLE;
-- Alice (owner) must retain all seven project records.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
DO $alice$
BEGIN
  IF (SELECT count(*) FROM maxx.projects) <> 7 THEN
    RAISE EXCEPTION 'Org owner lost project access';
  END IF;
END
$alice$;
RESET ROLE;
-- The RPCs require the non-browser service role, even with a JWT.
SET LOCAL ROLE authenticated;
DO $deny_rpc$
DECLARE denied boolean := false;
BEGIN
  BEGIN
    PERFORM public.maxx_service_client_workspaces('11111111-1111-4111-8111-111111111111');
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'Authenticated role can execute service-only RPC'; END IF;
END
$deny_rpc$;
RESET ROLE;
SET LOCAL ROLE service_role;
DO $service$
DECLARE a jsonb; b jsonb; c jsonb; request jsonb; project uuid;
BEGIN
  a := public.maxx_service_client_workspaces('11111111-1111-4111-8111-111111111111');
  b := public.maxx_service_client_workspaces('22222222-2222-4222-8222-222222222222');
  c := public.maxx_service_client_workspaces('33333333-3333-4333-8333-333333333333');
  IF jsonb_array_length(a) <> 7 OR jsonb_array_length(b) <> 1 OR jsonb_array_length(c) <> 0 THEN
    RAISE EXCEPTION 'Scoped service workspace listing failed: alice %, bob %, charlie %',
      jsonb_array_length(a),jsonb_array_length(b),jsonb_array_length(c);
  END IF;
  SELECT id INTO project FROM maxx.projects WHERE slug='bunna-restaurant';
  -- Archive denied when a real mission and a pending client approval exist.
  request := public.maxx_service_archive_client_step(
    '11111111-1111-4111-8111-111111111111',project,'start');
  PERFORM public.maxx_service_archive_client_step(
    '11111111-1111-4111-8111-111111111111',project,'acknowledge',(request->>'requestId')::uuid);
  PERFORM public.maxx_service_archive_client_step(
    '11111111-1111-4111-8111-111111111111',project,'type_name',
    (request->>'requestId')::uuid,'BUNNA RESTAURANT');
  BEGIN
    PERFORM public.maxx_service_archive_client_step(
      '11111111-1111-4111-8111-111111111111',project,'archive',
      (request->>'requestId')::uuid);
    RAISE EXCEPTION 'Archive accepted a pending mission or approval';
  EXCEPTION WHEN object_not_in_prerequisite_state THEN NULL;
  END;
  -- Finish the fixtures, then archive and restore, checking recovery metadata.
  UPDATE maxx.workflow_runs SET status='completed' WHERE project_id=project;
  UPDATE maxx.approvals SET status='approved'
  WHERE action_proposal_id='77777777-7777-4777-8777-777777777777';
  PERFORM public.maxx_service_archive_client_step(
    '11111111-1111-4111-8111-111111111111',project,'archive',
    (request->>'requestId')::uuid);
  IF NOT EXISTS (
    SELECT 1 FROM maxx.project_archive_requests
    WHERE id=(request->>'requestId')::uuid
      AND state='archived'
      AND recovery_until>=archived_at+interval '30 days'
  ) THEN RAISE EXCEPTION 'Archive is missing >=30-day recovery'; END IF;
  IF NOT EXISTS (SELECT 1 FROM maxx.projects WHERE id=project AND status='archived') THEN
    RAISE EXCEPTION 'Project did not archive'; END IF;
  IF public.maxx_service_archive_client_step(
      '11111111-1111-4111-8111-111111111111',project,'restore',
      (request->>'requestId')::uuid)->>'status' <> 'restored'
  THEN RAISE EXCEPTION 'Restore did not return expected status'; END IF;
  IF NOT EXISTS (SELECT 1 FROM maxx.projects WHERE id=project AND status='active') THEN
    RAISE EXCEPTION 'Restore did not reactivate client'; END IF;
  IF (SELECT count(*) FROM maxx.projects) <> 7 THEN
    RAISE EXCEPTION 'Archive/restore lost client data'; END IF;
  IF (SELECT count(*) FROM maxx.project_memberships) <> 1 THEN
    RAISE EXCEPTION 'Archive/restore mutated project memberships'; END IF;
END
$service$;
RESET ROLE;
DO $pass$
BEGIN
  RAISE NOTICE 'PASS: PostgreSQL 17 live two-identity RLS, read/write/approval isolation, service RPC boundaries and 30-day archive restore';
END
$pass$;
