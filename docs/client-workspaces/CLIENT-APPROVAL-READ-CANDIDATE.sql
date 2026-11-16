-- REVIEW-ONLY: permitted client-specific pending approval summaries.
-- This is a read-only list. Decision/execution remains BLOCKED until
-- tenant-scoped ICM approval transitions and executor receipts are verified.
CREATE OR REPLACE FUNCTION public.maxx_service_client_pending_approvals(
  p_actor uuid,p_project_id uuid,p_limit integer DEFAULT 20
) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
DECLARE v_org uuid; v_items jsonb;
BEGIN
 IF p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 50 THEN
   RAISE EXCEPTION 'invalid_approval_limit' USING errcode='22023';
 END IF;
 SELECT p.organization_id INTO v_org FROM maxx.projects p
 JOIN maxx.organizations o ON o.id=p.organization_id AND o.status='active'
 WHERE p.id=p_project_id AND p.status='active';
 IF v_org IS NULL OR NOT EXISTS (
   SELECT 1 FROM maxx.memberships m
   WHERE m.organization_id=v_org AND m.user_id=p_actor AND m.status='active'
     AND (m.role IN ('owner','admin') OR EXISTS (
       SELECT 1 FROM maxx.project_memberships pm
       WHERE pm.organization_id=v_org AND pm.project_id=p_project_id
         AND pm.user_id=p_actor AND pm.status='active'
     ))
 ) THEN RAISE EXCEPTION 'client_approval_read_denied' USING errcode='42501'; END IF;
 SELECT coalesce(jsonb_agg(jsonb_build_object(
   'id',items.id::text,
   'actionKey',items.action_key,
   'actionClass',items.action_class,
   'riskClass',items.risk_class,
   'requestedAt',items.requested_at,
   'expiresAt',items.expires_at,
   'status','pending'
 ) ORDER BY items.requested_at DESC,items.id),'[]'::jsonb)
 INTO v_items
 FROM (
   SELECT a.id,ap.action_key,ap.action_class,ap.risk_class,a.requested_at,a.expires_at
   FROM maxx.approvals a
   JOIN maxx.action_proposals ap
     ON ap.id=a.action_proposal_id AND ap.organization_id=a.organization_id
   WHERE a.organization_id=v_org AND ap.project_id=p_project_id
     AND a.status='pending' AND a.expires_at>now()
   ORDER BY a.requested_at DESC,a.id DESC LIMIT p_limit
 ) items;
 RETURN v_items;
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_client_pending_approvals(uuid,uuid,integer)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_client_pending_approvals(uuid,uuid,integer)
 TO service_role;
