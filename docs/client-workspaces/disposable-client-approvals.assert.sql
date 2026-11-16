-- Synthetic PostgreSQL approval-read isolation and permission check.
-- Executed only inside disposable local transaction; never production.
SET LOCAL ROLE service_role;
DO $approval$
DECLARE b uuid; c uuid; rows jsonb; denied boolean := false;
BEGIN
 SELECT id INTO b FROM maxx.projects WHERE slug='bunna-restaurant';
 SELECT id INTO c FROM maxx.projects WHERE slug='crown-and-core';
 INSERT INTO maxx.action_proposals(id,organization_id,project_id,status)
 VALUES('10101010-1010-4010-8010-101010101010',
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',b,'proposed');
 INSERT INTO maxx.approvals(organization_id,action_proposal_id,status)
 VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        '10101010-1010-4010-8010-101010101010','pending');
 rows:=public.maxx_service_client_pending_approvals(
   '22222222-2222-4222-8222-222222222222',b,20);
 IF jsonb_array_length(rows)<>1 THEN RAISE EXCEPTION 'Bob missing Bunna pending approval'; END IF;
 IF rows->0->>'actionKey'<>'disposable-example-action' THEN
   RAISE EXCEPTION 'Approval data contract changed unexpectedly'; END IF;
 rows:=public.maxx_service_client_pending_approvals(
   '11111111-1111-4111-8111-111111111111',c,20);
 IF jsonb_array_length(rows)<>1 THEN RAISE EXCEPTION 'Owner missing Crown pending approval'; END IF;
 BEGIN
   PERFORM public.maxx_service_client_pending_approvals(
     '22222222-2222-4222-8222-222222222222',c,20);
 EXCEPTION WHEN insufficient_privilege THEN denied:=true;
 END;
 IF NOT denied THEN RAISE EXCEPTION 'Bob can read foreign-client approvals'; END IF;
 denied:=false;
 BEGIN
   PERFORM public.maxx_service_client_pending_approvals(
     '33333333-3333-4333-8333-333333333333',b,20);
 EXCEPTION WHEN insufficient_privilege THEN denied:=true;
 END;
 IF NOT denied THEN RAISE EXCEPTION 'Unaffiliated user can read client approvals'; END IF;
END
$approval$;
RESET ROLE;
SET LOCAL ROLE authenticated;
DO $deny$
BEGIN
 IF has_function_privilege('authenticated',
      'public.maxx_service_client_pending_approvals(uuid,uuid,integer)','EXECUTE') THEN
   RAISE EXCEPTION 'Authenticated browser role can invoke private approval RPC';
 END IF;
END
$deny$;
RESET ROLE;
DO $pass$
BEGIN RAISE NOTICE 'PASS: read-only client approval summaries exclude foreign project and unaffiliated identity'; END
$pass$;
