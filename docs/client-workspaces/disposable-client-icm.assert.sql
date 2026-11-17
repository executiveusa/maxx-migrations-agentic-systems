-- Run after the existing live tenant isolation fixtures, in the SAME
-- rollback-only PostgreSQL 17 transaction. All users and missions are fake.
INSERT INTO auth.users(id) VALUES ('44444444-4444-4444-8444-444444444444');
INSERT INTO maxx.memberships(organization_id,user_id,role,status)
VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '44444444-4444-4444-8444-444444444444','reviewer','active');
INSERT INTO maxx.project_memberships(organization_id,project_id,user_id,role,status)
SELECT organization_id,id,'44444444-4444-4444-8444-444444444444','reviewer','active'
FROM maxx.projects WHERE slug='bunna-restaurant';
-- The database, not an attacker-supplied tool key, defines the allowed action.
DO $test_client_icm$
DECLARE
 bunna uuid; crown uuid;
 bob uuid:='22222222-2222-4222-8222-222222222222';
 alice uuid:='11111111-1111-4111-8111-111111111111';
 reviewer uuid:='44444444-4444-4444-8444-444444444444';
 outsider uuid:='33333333-3333-4333-8333-333333333333';
 mission uuid:='99999999-9999-4999-8999-999999999999';
 mission2 uuid:='90909090-9090-4090-8090-909090909090';
 mission3 uuid:='aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
 mission4 uuid:='bbbbbbbb-cccc-4ddd-8eee-ffffffffffff';
 mission5 uuid:='cccccccc-dddd-4eee-8fff-aaaaaaaaaaaa';
 receipt uuid:='abababab-abab-4bab-8bab-abababababab';
 proposed jsonb; repeat_proposed jsonb; decided jsonb;
 claimed jsonb; finished jsonb; viewed jsonb;
 refused boolean;
BEGIN
 SELECT id INTO STRICT bunna FROM maxx.projects WHERE slug='bunna-restaurant';
 SELECT id INTO STRICT crown FROM maxx.projects WHERE slug='crown-and-core';
 refused:=false;
 BEGIN
   PERFORM public.maxx_service_client_mission_propose(
     bob,crown,mission,'Wrong project must be forbidden');
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Cross-project mission proposal succeeded'; END IF;
 refused:=false;
 BEGIN
   PERFORM public.maxx_service_client_mission_propose(
     outsider,bunna,mission,'Unassigned identity must be forbidden');
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Unaffiliated mission proposal succeeded'; END IF;
 proposed:=public.maxx_service_client_mission_propose(
    bob,bunna,mission,'Draft an internal Bunna menu response');
 repeat_proposed:=public.maxx_service_client_mission_propose(
    bob,bunna,mission,'Draft an internal Bunna menu response');
 IF jsonb_array_length(public.maxx_service_client_missions(bob,bunna,30))<>1 OR
    jsonb_array_length(public.maxx_service_client_missions(reviewer,bunna,30))<>1 THEN
    RAISE EXCEPTION 'Durable project mission inbox did not reveal scoped request';
 END IF;
 refused:=false;
 BEGIN
   PERFORM public.maxx_service_client_missions(outsider,bunna,30);
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Unaffiliated client can list private missions'; END IF;
 IF proposed<>repeat_proposed OR proposed->>'status'<>'pending'
   OR proposed->>'action'<>'client_draft_only' THEN
   RAISE EXCEPTION 'Proposal idempotency or approval gating failed';
 END IF;
 refused:=false;
 BEGIN
  PERFORM public.maxx_service_client_mission_propose(
    bob,bunna,mission,'Different objective with same idempotency key');
 EXCEPTION WHEN unique_violation THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Proposal id reused with changed objective'; END IF;
 refused:=false;
 BEGIN
  PERFORM public.maxx_service_client_mission_claim(bob,bunna,mission);
 EXCEPTION WHEN object_not_in_prerequisite_state THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Unapproved mission was claimable'; END IF;
 refused:=false;
 BEGIN
  PERFORM public.maxx_service_client_mission_decide(bob,bunna,mission,'approved');
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Self-approved mission succeeded'; END IF;
 refused:=false;
 BEGIN
  PERFORM public.maxx_service_client_mission_decide(reviewer,crown,mission,'approved');
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Reviewer approved foreign project'; END IF;
 decided:=public.maxx_service_client_mission_decide(reviewer,bunna,mission,'approved');
 IF decided->>'status'<>'approved' THEN RAISE EXCEPTION 'Independent approval failed'; END IF;
 claimed:=public.maxx_service_client_mission_claim(bob,bunna,mission);
 PERFORM public.maxx_service_client_mission_record_dispatch(
    bob,bunna,mission,'hermes','hermes-draft-123');
 IF (public.maxx_service_client_mission_status(reviewer,bunna,mission)->'dispatch'->>'externalRunId')
     <> 'hermes-draft-123' THEN
   RAISE EXCEPTION 'Dispatch ACK is not persisted';
 END IF;
 IF claimed->>'action'<>'client_draft_only' OR
    claimed->'allowedTools'<>'[]'::jsonb OR
    claimed->>'projectId'<>bunna::text OR
    claimed->>'approvedBy'<>reviewer::text THEN
   RAISE EXCEPTION 'Claim did not return a server-bounded, approved mission';
 END IF;
 refused:=false;
 BEGIN
  PERFORM public.maxx_service_client_mission_claim(bob,bunna,mission);
 EXCEPTION WHEN object_not_in_prerequisite_state THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Double mission claim succeeded'; END IF;
 refused:=false;
 BEGIN
  PERFORM public.maxx_service_client_mission_finish(
    alice,bunna,mission,receipt,'completed',
    jsonb_build_object('source','hermes','externalRunId','safe-id',
      'summary','No external action','projectId',bunna::text,'missionId',mission::text));
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Nonclaiming actor completed mission'; END IF;
 finished:=public.maxx_service_client_mission_finish(
    bob,bunna,mission,receipt,'completed',
    jsonb_build_object('source','hermes','externalRunId','hermes-draft-123',
      'summary','An internal draft was produced, awaiting review',
      'projectId',bunna::text,'missionId',mission::text));
 IF finished->>'status'<>'completed' OR
   finished->>'verification'<>'human_review_required' THEN
    RAISE EXCEPTION 'Receipt falsely certified or completion failed';
 END IF;
 IF (SELECT status FROM maxx.evidence_receipts WHERE id=receipt)<>'partial' THEN
   RAISE EXCEPTION 'Unreviewed executor text must NOT be a verified pass';
 END IF;
 finished:=public.maxx_service_client_mission_finish(
    bob,bunna,mission,receipt,'completed',
    jsonb_build_object('source','hermes','externalRunId','hermes-draft-123',
      'summary','An internal draft was produced, awaiting review',
      'projectId',bunna::text,'missionId',mission::text));
 IF finished->>'duplicate'<>'true' THEN
    RAISE EXCEPTION 'Duplicate receipt was not idempotent';
 END IF;
 viewed:=public.maxx_service_client_mission_status(reviewer,bunna,mission);
 IF viewed->>'status'<>'completed' OR viewed->>'receiptId'<>receipt::text THEN
   RAISE EXCEPTION 'Scoped mission status or evidence lookup failed';
 END IF;
 refused:=false;
 BEGIN
  PERFORM public.maxx_service_client_mission_status(outsider,bunna,mission);
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Outsider can inspect mission evidence'; END IF;
 -- Ambiguous remote ACK must be quarantined, NEVER automatically retried.
 PERFORM public.maxx_service_client_mission_propose(
   bob,bunna,mission3,'Draft another internal Bunna note');
 PERFORM public.maxx_service_client_mission_decide(
   reviewer,bunna,mission3,'approved');
 PERFORM public.maxx_service_client_mission_claim(bob,bunna,mission3);
 IF public.maxx_service_client_mission_dispatch_block(
    bob,bunna,mission3)->>'requiresReconciliation'<>'true' THEN
    RAISE EXCEPTION 'Ambiguous remote dispatch not quarantined';
 END IF;
 IF public.maxx_service_client_mission_dispatch_block(
    bob,bunna,mission3)->>'duplicate'<>'true' THEN
    RAISE EXCEPTION 'Blocked dispatch was not idempotent';
 END IF;
 refused:=false;
 BEGIN
   PERFORM public.maxx_service_client_mission_claim(bob,bunna,mission3);
 EXCEPTION WHEN object_not_in_prerequisite_state THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Ambiguous dispatch was retried'; END IF;
 -- Verify revocation AFTER prior approval cannot be bypassed by a cached claim.
 PERFORM public.maxx_service_client_mission_propose(
   bob,bunna,mission2,'Another internal Bunna drafting task');
 PERFORM public.maxx_service_client_mission_decide(reviewer,bunna,mission2,'approved');
 -- Seed a claimed but unacknowledged run, and a distinct acknowledged
 -- run, so revocation applies to BOTH dispatch and final receipt transitions.
 PERFORM public.maxx_service_client_mission_propose(
   bob,bunna,mission4,'Draft an internal Bunna staffing update');
 PERFORM public.maxx_service_client_mission_decide(reviewer,bunna,mission4,'approved');
 PERFORM public.maxx_service_client_mission_claim(bob,bunna,mission4);
 PERFORM public.maxx_service_client_mission_propose(
   bob,bunna,mission5,'Draft an internal Bunna weekly report');
 PERFORM public.maxx_service_client_mission_decide(reviewer,bunna,mission5,'approved');
 PERFORM public.maxx_service_client_mission_claim(bob,bunna,mission5);
 PERFORM public.maxx_service_client_mission_record_dispatch(
   bob,bunna,mission5,'hermes','hermes-approved-before-revoke');
 UPDATE maxx.project_memberships SET status='revoked'
 WHERE project_id=bunna AND user_id=bob;
 refused:=false;
 BEGIN
  PERFORM public.maxx_service_client_mission_claim(bob,bunna,mission2);
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Revoked identity claimed approved action'; END IF;
 refused:=false;
 BEGIN
   PERFORM public.maxx_service_client_mission_record_dispatch(
      bob,bunna,mission4,'hermes','hermes-unknown');
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Revoked actor recorded a runtime ACK'; END IF;
 refused:=false;
 BEGIN
   PERFORM public.maxx_service_client_mission_finish(
     bob,bunna,mission5,'dddddddd-eeee-4fff-8aaa-111111111111','completed',
     jsonb_build_object('source','hermes',
       'externalRunId','hermes-approved-before-revoke',
       'summary','Attempt to finalize after revocation',
       'projectId',bunna::text,'missionId',mission5::text));
 EXCEPTION WHEN insufficient_privilege THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'Revoked actor finalized signed evidence'; END IF;
 UPDATE maxx.project_memberships SET status='active'
 WHERE project_id=bunna AND user_id=bob;
 RAISE NOTICE 'PASS: ICM client proposal, independent approval, single-claim, immutable unverified evidence, replay and revoke gates';
END
$test_client_icm$;
-- Service-only RPC grants are enforced by actual PostgreSQL ACLs.
DO $acl$
DECLARE f text;
BEGIN
 FOREACH f IN ARRAY ARRAY[
  'public.maxx_service_client_mission_propose(uuid,uuid,uuid,text)',
  'public.maxx_service_client_mission_decide(uuid,uuid,uuid,text)',
  'public.maxx_service_client_mission_claim(uuid,uuid,uuid)',
  'public.maxx_service_client_mission_record_dispatch(uuid,uuid,uuid,text,text)',
  'public.maxx_service_client_mission_dispatch_block(uuid,uuid,uuid)',
  'public.maxx_service_client_mission_finish(uuid,uuid,uuid,uuid,text,jsonb)',
  'public.maxx_service_client_mission_status(uuid,uuid,uuid)',
  'public.maxx_service_client_missions(uuid,uuid,integer)'
 ] LOOP
  IF has_function_privilege('anon',f,'EXECUTE')
     OR has_function_privilege('authenticated',f,'EXECUTE')
     OR NOT has_function_privilege('service_role',f,'EXECUTE') THEN
    RAISE EXCEPTION 'Client execution RPC grant mismatch: %',f;
  END IF;
 END LOOP;
 RAISE NOTICE 'PASS: client ICM RPCs are service_role-only';
END
$acl$;
