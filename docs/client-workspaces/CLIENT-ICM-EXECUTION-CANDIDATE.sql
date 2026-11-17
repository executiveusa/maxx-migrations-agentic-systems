-- REVIEW ONLY: add a scoped, explicitly approved draft mission on EXISTING
-- maxx.workflow_runs + action_proposals + approvals + evidence_receipts.
-- No second scheduler, approval store or external-agent database.
-- Apply only AFTER the five reviewed client workspace/chat/approval candidates.
-- All RPCs are service_role-only, fail closed and require active membership.
-- The only executable action in v1 is client_draft_only (NO external tools,
-- source reads, messages, publishing, spending or user-mutable tool profile).
CREATE OR REPLACE FUNCTION maxx.service_client_authorized(
 p_actor uuid,p_project uuid,p_roles text[]
) RETURNS boolean
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
 SELECT EXISTS (
  SELECT 1 FROM maxx.projects p
  JOIN maxx.organizations o ON o.id=p.organization_id AND o.status='active'
  JOIN maxx.memberships m
    ON m.organization_id=p.organization_id
   AND m.user_id=p_actor AND m.status='active'
  LEFT JOIN maxx.project_memberships pm
    ON pm.organization_id=p.organization_id AND pm.project_id=p.id
   AND pm.user_id=p_actor AND pm.status='active'
  WHERE p.id=p_project AND p.status='active'
    AND (
      (m.role IN ('owner','admin') AND m.role=ANY(p_roles))
      OR (pm.role=ANY(p_roles))
    )
 );
$$;
REVOKE ALL ON FUNCTION maxx.service_client_authorized(uuid,uuid,text[])
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION maxx.service_client_authorized(uuid,uuid,text[])
  TO service_role;

CREATE OR REPLACE FUNCTION public.maxx_service_client_mission_propose(
 p_actor uuid,p_project_id uuid,p_mission_id uuid,p_objective text
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY INVOKER
SET search_path=pg_catalog,maxx,public,extensions
AS $$
DECLARE
 v_org uuid; v_hash text; v_key text; v_run maxx.workflow_runs%ROWTYPE;
 v_proposal maxx.action_proposals%ROWTYPE; v_approval maxx.approvals%ROWTYPE;
BEGIN
 IF p_mission_id IS NULL OR p_objective IS NULL OR
    length(btrim(p_objective)) NOT BETWEEN 3 AND 2000 THEN
   RAISE EXCEPTION 'invalid_client_mission' USING errcode='22023';
 END IF;
 IF NOT maxx.service_client_authorized(
    p_actor,p_project_id,ARRAY['owner','admin','operator']::text[]) THEN
   RAISE EXCEPTION 'client_mission_denied' USING errcode='42501';
 END IF;
 SELECT organization_id INTO STRICT v_org FROM maxx.projects WHERE id=p_project_id;
 v_key:='agent-maxx-client-draft:'||p_mission_id::text;
 v_hash:=encode(digest(
   p_project_id::text||':'||p_actor::text||':'||p_mission_id::text||':'||p_objective,'sha256'),'hex');
 INSERT INTO maxx.workflow_runs(
   id,organization_id,project_id,workflow_key,objective,status,
   started_by,policy_snapshot,input_manifest,budget_usd,spent_usd
 ) VALUES (
   p_mission_id,v_org,p_project_id,'maxx.client_draft.v1',p_objective,'waiting_approval',
   p_actor,jsonb_build_object('action','client_draft_only','allowedTools','[]'::jsonb,
     'sourceAccess','none','budgetUsd',0,'requiresApproval',true),
   jsonb_build_object('requestHash',v_hash,'requestedBy',p_actor::text),
   0,0
 ) ON CONFLICT(id) DO NOTHING;
 SELECT * INTO STRICT v_run FROM maxx.workflow_runs WHERE id=p_mission_id;
 IF v_run.organization_id<>v_org OR v_run.project_id<>p_project_id
   OR v_run.workflow_key<>'maxx.client_draft.v1' OR v_run.started_by<>p_actor
   OR v_run.objective<>p_objective OR v_run.input_manifest->>'requestHash'<>v_hash THEN
   RAISE EXCEPTION 'client_mission_idempotency_conflict' USING errcode='23505';
 END IF;
 INSERT INTO maxx.action_proposals(
   organization_id,project_id,run_id,action_key,action_class,tool_key,
   risk_class,requires_approval,payload_redacted,action_hash,idempotency_key,
   status,requested_by_user_id,expires_at
 ) VALUES (
   v_org,p_project_id,p_mission_id,'maxx.client_draft.v1','draft','hermes',
   'low',true,jsonb_build_object('requestHash',v_hash,'noExternalTools',true),
   v_hash,v_key,'proposed',p_actor,now()+interval '24 hours'
 ) ON CONFLICT(idempotency_key) DO NOTHING;
 SELECT * INTO STRICT v_proposal FROM maxx.action_proposals WHERE idempotency_key=v_key;
 IF v_proposal.run_id<>p_mission_id OR v_proposal.project_id<>p_project_id
  OR v_proposal.organization_id<>v_org OR v_proposal.action_hash<>v_hash
  OR v_proposal.action_key<>'maxx.client_draft.v1' THEN
  RAISE EXCEPTION 'client_mission_proposal_conflict' USING errcode='23505';
 END IF;
 INSERT INTO maxx.approvals(organization_id,action_proposal_id,action_hash,status,expires_at)
 VALUES(v_org,v_proposal.id,v_hash,'pending',coalesce(v_proposal.expires_at,now()+interval '24 hours'))
 ON CONFLICT(action_proposal_id,action_hash) DO NOTHING;
 SELECT * INTO STRICT v_approval FROM maxx.approvals
 WHERE action_proposal_id=v_proposal.id AND action_hash=v_hash;
 RETURN jsonb_build_object(
  'missionId',p_mission_id::text,'projectId',p_project_id::text,
  'approvalId',v_approval.id::text,'actionHash',v_hash,
  'status',v_approval.status,'expiresAt',v_approval.expires_at,
  'action','client_draft_only'
 );
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_client_mission_propose(uuid,uuid,uuid,text)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_client_mission_propose(uuid,uuid,uuid,text)
  TO service_role;

CREATE OR REPLACE FUNCTION public.maxx_service_client_mission_decide(
 p_actor uuid,p_project_id uuid,p_mission_id uuid,p_decision text
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
DECLARE v_run maxx.workflow_runs%ROWTYPE; v_prop maxx.action_proposals%ROWTYPE;
        v_ap maxx.approvals%ROWTYPE;
BEGIN
 IF p_decision NOT IN ('approved','rejected') THEN
   RAISE EXCEPTION 'invalid_decision' USING errcode='22023';
 END IF;
 IF NOT maxx.service_client_authorized(
  p_actor,p_project_id,ARRAY['owner','admin','reviewer']::text[]) THEN
   RAISE EXCEPTION 'client_approval_denied' USING errcode='42501';
 END IF;
 SELECT * INTO STRICT v_run FROM maxx.workflow_runs WHERE id=p_mission_id FOR UPDATE;
 IF v_run.project_id<>p_project_id OR v_run.workflow_key<>'maxx.client_draft.v1' OR
    v_run.started_by=p_actor THEN
   RAISE EXCEPTION 'independent_client_review_required' USING errcode='42501';
 END IF;
 SELECT * INTO STRICT v_prop FROM maxx.action_proposals
 WHERE run_id=p_mission_id AND action_key='maxx.client_draft.v1' FOR UPDATE;
 SELECT * INTO STRICT v_ap FROM maxx.approvals WHERE action_proposal_id=v_prop.id FOR UPDATE;
 IF v_ap.organization_id<>v_run.organization_id OR v_prop.organization_id<>v_run.organization_id
    OR v_ap.action_hash<>v_prop.action_hash THEN
   RAISE EXCEPTION 'client_approval_scope_mismatch' USING errcode='42501';
 END IF;
 IF v_ap.status IN ('approved','rejected') AND v_ap.decision_by=p_actor
    AND v_ap.status=p_decision THEN
   RETURN jsonb_build_object('missionId',p_mission_id::text,'projectId',p_project_id::text,
     'status',p_decision,'approvalId',v_ap.id::text,'duplicate',true);
 END IF;
 IF v_run.status<>'waiting_approval' OR v_ap.status<>'pending' OR
    v_ap.expires_at<=now() OR v_prop.status<>'proposed' THEN
   RAISE EXCEPTION 'client_approval_not_pending' USING errcode='55000';
 END IF;
 UPDATE maxx.approvals SET status=p_decision,decision_by=p_actor,
   decided_at=now() WHERE id=v_ap.id;
 UPDATE maxx.action_proposals SET status=p_decision,updated_at=now()
  WHERE id=v_prop.id;
 UPDATE maxx.workflow_runs SET status=CASE WHEN p_decision='approved' THEN 'queued' ELSE 'blocked' END,
  updated_at=now() WHERE id=p_mission_id;
 INSERT INTO maxx.audit_log(organization_id,project_id,actor_type,actor_id,action,
   object_type,object_id,payload_redacted)
 VALUES(v_run.organization_id,p_project_id,'human',p_actor::text,
   'client_mission_'||p_decision,'action_proposal',v_prop.id::text,
   jsonb_build_object('approvalId',v_ap.id::text,'actionHash',v_prop.action_hash));
 RETURN jsonb_build_object('missionId',p_mission_id::text,'projectId',p_project_id::text,
   'status',p_decision,'approvalId',v_ap.id::text,'duplicate',false);
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_client_mission_decide(uuid,uuid,uuid,text)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_client_mission_decide(uuid,uuid,uuid,text)
  TO service_role;

CREATE OR REPLACE FUNCTION public.maxx_service_client_mission_claim(
 p_actor uuid,p_project_id uuid,p_mission_id uuid
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
DECLARE v_run maxx.workflow_runs%ROWTYPE; v_prop maxx.action_proposals%ROWTYPE;
        v_ap maxx.approvals%ROWTYPE;
BEGIN
 IF NOT maxx.service_client_authorized(
  p_actor,p_project_id,ARRAY['owner','admin','operator']::text[]) THEN
   RAISE EXCEPTION 'client_claim_denied' USING errcode='42501';
 END IF;
 SELECT * INTO STRICT v_run FROM maxx.workflow_runs WHERE id=p_mission_id FOR UPDATE;
 IF v_run.project_id<>p_project_id OR v_run.workflow_key<>'maxx.client_draft.v1' THEN
   RAISE EXCEPTION 'client_claim_scope_mismatch' USING errcode='42501';
 END IF;
 SELECT * INTO STRICT v_prop FROM maxx.action_proposals
 WHERE run_id=p_mission_id AND action_key='maxx.client_draft.v1' FOR UPDATE;
 SELECT * INTO STRICT v_ap FROM maxx.approvals WHERE action_proposal_id=v_prop.id FOR UPDATE;
 IF v_run.status<>'queued' OR v_prop.status<>'approved' OR
   v_ap.status<>'approved' OR v_ap.decision_by IS NULL OR
   v_ap.decision_by=v_run.started_by OR v_prop.action_hash<>v_ap.action_hash OR
   v_ap.expires_at<=now() OR v_prop.expires_at<=now() OR
   v_ap.organization_id<>v_run.organization_id OR v_prop.organization_id<>v_run.organization_id THEN
   RAISE EXCEPTION 'client_mission_not_approved_or_claimed' USING errcode='55000';
 END IF;
 UPDATE maxx.workflow_runs SET status='running',started_at=now(),
   input_manifest=input_manifest||jsonb_build_object('claimedBy',p_actor::text),
   updated_at=now() WHERE id=p_mission_id;
 UPDATE maxx.action_proposals SET status='executing',updated_at=now() WHERE id=v_prop.id;
 RETURN jsonb_build_object(
   'missionId',p_mission_id::text,'projectId',p_project_id::text,
   'organizationId',v_run.organization_id::text,'approvedBy',v_ap.decision_by::text,
   'objective',v_run.objective,'actionHash',v_prop.action_hash,
   'action','client_draft_only','allowedTools','[]'::jsonb,
   'externalSideEffects',false,'budgetUsd',0
 );
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_client_mission_claim(uuid,uuid,uuid)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_client_mission_claim(uuid,uuid,uuid)
  TO service_role;

CREATE OR REPLACE FUNCTION public.maxx_service_client_mission_finish(
 p_actor uuid,p_project_id uuid,p_mission_id uuid,p_receipt_id uuid,
 p_outcome text,p_receipt jsonb
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
DECLARE v_run maxx.workflow_runs%ROWTYPE; v_prop maxx.action_proposals%ROWTYPE;
        v_receipt maxx.evidence_receipts%ROWTYPE;
BEGIN
 IF p_outcome NOT IN ('completed','failed') OR p_receipt_id IS NULL OR
    jsonb_typeof(p_receipt)<>'object' OR
    p_receipt->>'source' NOT IN ('hermes','instinct') OR
    length(coalesce(p_receipt->>'externalRunId','')) NOT BETWEEN 1 AND 150 OR
    length(coalesce(p_receipt->>'summary','')) NOT BETWEEN 1 AND 1000 OR
    p_receipt->>'projectId' IS DISTINCT FROM p_project_id::text OR
    p_receipt->>'missionId' IS DISTINCT FROM p_mission_id::text THEN
   RAISE EXCEPTION 'invalid_client_receipt' USING errcode='22023';
 END IF;
 SELECT * INTO STRICT v_run FROM maxx.workflow_runs WHERE id=p_mission_id FOR UPDATE;
 IF v_run.project_id<>p_project_id OR v_run.workflow_key<>'maxx.client_draft.v1' OR
   v_run.input_manifest->>'claimedBy'<>p_actor::text THEN
   RAISE EXCEPTION 'client_finish_scope_denied' USING errcode='42501';
 END IF;
 SELECT * INTO STRICT v_prop FROM maxx.action_proposals
 WHERE run_id=p_mission_id AND action_key='maxx.client_draft.v1' FOR UPDATE;
 IF v_run.status IN ('completed','failed') THEN
   SELECT * INTO v_receipt FROM maxx.evidence_receipts
   WHERE id=p_receipt_id AND action_proposal_id=v_prop.id;
   IF NOT FOUND THEN RAISE EXCEPTION 'client_receipt_conflict' USING errcode='23505'; END IF;
   RETURN jsonb_build_object('missionId',p_mission_id::text,'receiptId',v_receipt.id::text,
      'status',v_run.status,'verification','human_review_required','duplicate',true);
 END IF;
 IF v_run.status<>'running' OR v_prop.status<>'executing' THEN
   RAISE EXCEPTION 'client_mission_not_running' USING errcode='55000';
 END IF;
 INSERT INTO maxx.evidence_receipts(
   id,organization_id,project_id,run_id,action_proposal_id,status,summary,
   tests,artifacts,verification,cost
 ) VALUES(p_receipt_id,v_run.organization_id,p_project_id,p_mission_id,v_prop.id,
   CASE WHEN p_outcome='failed' THEN 'fail' ELSE 'partial' END,p_receipt->>'summary',
   '[]'::jsonb,'[]'::jsonb,
   jsonb_build_object('runtimeSource',p_receipt->>'source',
      'externalRunId',p_receipt->>'externalRunId',
      'approvalRechecked',true,'independentReview',false,
      'noExternalToolProof',false),
   jsonb_build_object('budgetUsd',0,'verifiedSpendUsd',null)
 );
 UPDATE maxx.action_proposals SET status=CASE WHEN p_outcome='failed' THEN 'failed' ELSE 'executed' END,
  result_redacted=jsonb_build_object('receiptId',p_receipt_id::text,
     'source',p_receipt->>'source','externalRunId',p_receipt->>'externalRunId'),
  updated_at=now() WHERE id=v_prop.id;
 UPDATE maxx.workflow_runs SET status=p_outcome,completed_at=now(),
   output_manifest=jsonb_build_object('receiptId',p_receipt_id::text,
     'runtimeSource',p_receipt->>'source','externalRunId',p_receipt->>'externalRunId',
     'independentReview',false),
   updated_at=now() WHERE id=p_mission_id;
 INSERT INTO maxx.audit_log(organization_id,project_id,actor_type,actor_id,action,
    object_type,object_id,payload_redacted)
 VALUES(v_run.organization_id,p_project_id,'system',p_actor::text,
   'client_mission_'||p_outcome,'evidence_receipt',p_receipt_id::text,
   jsonb_build_object('missionId',p_mission_id::text,'source',p_receipt->>'source'));
 RETURN jsonb_build_object('missionId',p_mission_id::text,'receiptId',p_receipt_id::text,
   'status',p_outcome,'verification','human_review_required','duplicate',false);
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_client_mission_finish(uuid,uuid,uuid,uuid,text,jsonb)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_client_mission_finish(uuid,uuid,uuid,uuid,text,jsonb)
  TO service_role;

CREATE OR REPLACE FUNCTION public.maxx_service_client_mission_status(
 p_actor uuid,p_project_id uuid,p_mission_id uuid
) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
DECLARE v_run maxx.workflow_runs%ROWTYPE; v_prop maxx.action_proposals%ROWTYPE;
        v_ap maxx.approvals%ROWTYPE; v_receipt maxx.evidence_receipts%ROWTYPE;
BEGIN
 IF NOT maxx.service_client_authorized(p_actor,p_project_id,
   ARRAY['owner','admin','operator','reviewer','viewer']::text[]) THEN
   RAISE EXCEPTION 'client_status_denied' USING errcode='42501';
 END IF;
 SELECT * INTO STRICT v_run FROM maxx.workflow_runs
 WHERE id=p_mission_id AND project_id=p_project_id
   AND workflow_key='maxx.client_draft.v1';
 SELECT * INTO STRICT v_prop FROM maxx.action_proposals
 WHERE run_id=p_mission_id AND project_id=p_project_id AND organization_id=v_run.organization_id;
 SELECT * INTO STRICT v_ap FROM maxx.approvals WHERE action_proposal_id=v_prop.id;
 SELECT * INTO v_receipt FROM maxx.evidence_receipts
 WHERE action_proposal_id=v_prop.id ORDER BY signed_at DESC LIMIT 1;
 RETURN jsonb_build_object('missionId',p_mission_id::text,'projectId',p_project_id::text,
  'status',v_run.status,'approvalStatus',v_ap.status,
  'approvalId',v_ap.id::text,
  'receiptId',CASE WHEN v_receipt.id IS NULL THEN null ELSE v_receipt.id::text END,
  'verification',CASE WHEN v_receipt.id IS NULL THEN 'not_yet_executed'
     ELSE 'human_review_required' END);
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_client_mission_status(uuid,uuid,uuid)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_client_mission_status(uuid,uuid,uuid)
  TO service_role;
