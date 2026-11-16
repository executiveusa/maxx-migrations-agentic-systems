-- REVIEW-ONLY V3 ADDITION: durable, per-operator, per-client advisory chat.
-- Run AFTER proposed client membership/schema + scoped RLS and management RPCs.
-- No changes to production, no grants to browser roles, no worker execution.
CREATE TABLE IF NOT EXISTS maxx.project_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES maxx.organizations(id),
  project_id uuid NOT NULL,
  CONSTRAINT project_chat_scope_fk FOREIGN KEY(organization_id,project_id)
    REFERENCES maxx.projects(organization_id,id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  exchange_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('stacy','maxx')),
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 20000),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id,user_id,exchange_id,role)
);
CREATE INDEX IF NOT EXISTS maxx_project_chat_history_idx
  ON maxx.project_chat_messages(project_id,user_id,created_at,id);
ALTER TABLE maxx.project_chat_messages ENABLE ROW LEVEL SECURITY;
-- Default deny for browser roles, even when legacy organization RLS is broad.
REVOKE ALL ON maxx.project_chat_messages FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT ON maxx.project_chat_messages TO service_role;
-- No UPDATE or DELETE for service role: exchanges are append-only.
-- Archive retains historical conversations until reviewed retention policy.

CREATE OR REPLACE FUNCTION public.maxx_service_client_chat_history(
 p_actor uuid, p_project_id uuid, p_limit integer DEFAULT 100
) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
DECLARE v_org uuid; v_rows jsonb;
BEGIN
 IF p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 200 THEN
   RAISE EXCEPTION 'invalid_history_limit' USING errcode='22023';
 END IF;
 SELECT p.organization_id INTO v_org FROM maxx.projects p
   JOIN maxx.organizations o ON o.id=p.organization_id AND o.status='active'
   WHERE p.id=p_project_id AND p.status='active';
 IF v_org IS NULL OR NOT EXISTS (
   SELECT 1 FROM maxx.memberships m
   WHERE m.organization_id=v_org AND m.user_id=p_actor AND m.status='active'
     AND (m.role IN ('owner','admin') OR EXISTS(
       SELECT 1 FROM maxx.project_memberships pm
       WHERE pm.organization_id=v_org AND pm.project_id=p_project_id
         AND pm.user_id=p_actor AND pm.status='active'
     ))
 ) THEN RAISE EXCEPTION 'client_chat_not_authorized' USING errcode='42501'; END IF;
 SELECT coalesce(jsonb_agg(jsonb_build_object(
   'id',q.id::text,'role',q.role,'text',q.body,'createdAt',q.created_at
 ) ORDER BY q.created_at,q.id),'[]'::jsonb) INTO v_rows
 FROM (
   SELECT x.id,x.role,x.body,x.created_at
   FROM maxx.project_chat_messages x
   WHERE x.project_id=p_project_id AND x.organization_id=v_org AND x.user_id=p_actor
   ORDER BY x.created_at DESC,x.id DESC LIMIT p_limit
 ) q;
 RETURN v_rows;
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_client_chat_history(uuid,uuid,integer)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_client_chat_history(uuid,uuid,integer) TO service_role;

CREATE OR REPLACE FUNCTION public.maxx_service_record_client_chat_exchange(
 p_actor uuid,p_project_id uuid,p_exchange_id uuid,p_request text,p_response text
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY INVOKER
SET search_path=pg_catalog,maxx,public
AS $$
DECLARE v_org uuid; v_rows jsonb;
BEGIN
 IF p_exchange_id IS NULL OR p_request IS NULL OR p_response IS NULL
    OR length(p_request) NOT BETWEEN 1 AND 20000
    OR length(p_response) NOT BETWEEN 1 AND 20000 THEN
   RAISE EXCEPTION 'invalid_chat_exchange' USING errcode='22023';
 END IF;
 SELECT p.organization_id INTO v_org FROM maxx.projects p
   JOIN maxx.organizations o ON o.id=p.organization_id AND o.status='active'
   WHERE p.id=p_project_id AND p.status='active';
 IF v_org IS NULL OR NOT EXISTS (
   SELECT 1 FROM maxx.memberships m
   WHERE m.organization_id=v_org AND m.user_id=p_actor AND m.status='active'
     AND (m.role IN ('owner','admin','operator') AND
        (m.role IN ('owner','admin') OR EXISTS (
          SELECT 1 FROM maxx.project_memberships pm
          WHERE pm.organization_id=v_org AND pm.project_id=p_project_id
            AND pm.user_id=p_actor AND pm.status='active' AND pm.role IN ('owner','admin','operator')
        )))
 ) THEN RAISE EXCEPTION 'client_chat_write_denied' USING errcode='42501'; END IF;
 -- Reject a reused exchange id with different contents; never rewrite history.
 IF EXISTS (
   SELECT 1 FROM maxx.project_chat_messages x WHERE
   x.project_id=p_project_id AND x.user_id=p_actor AND x.exchange_id=p_exchange_id
   AND ((x.role='stacy' AND x.body<>p_request) OR
        (x.role='maxx' AND x.body<>p_response))
 ) THEN RAISE EXCEPTION 'chat_exchange_id_conflict' USING errcode='23505'; END IF;
 INSERT INTO maxx.project_chat_messages(organization_id,project_id,user_id,exchange_id,role,body)
 VALUES (v_org,p_project_id,p_actor,p_exchange_id,'stacy',p_request),
        (v_org,p_project_id,p_actor,p_exchange_id,'maxx',p_response)
 ON CONFLICT (project_id,user_id,exchange_id,role) DO NOTHING;
 SELECT jsonb_agg(jsonb_build_object('id',x.id::text,'role',x.role,'text',x.body)
         ORDER BY CASE x.role WHEN 'stacy' THEN 0 ELSE 1 END)
   INTO v_rows
 FROM maxx.project_chat_messages x
 WHERE x.project_id=p_project_id AND x.organization_id=v_org
       AND x.user_id=p_actor AND x.exchange_id=p_exchange_id;
 IF jsonb_array_length(coalesce(v_rows,'[]'::jsonb))<>2 THEN
   RAISE EXCEPTION 'chat_exchange_write_incomplete' USING errcode='55000';
 END IF;
 RETURN v_rows;
END;
$$;
REVOKE ALL ON FUNCTION public.maxx_service_record_client_chat_exchange(uuid,uuid,uuid,text,text)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.maxx_service_record_client_chat_exchange(uuid,uuid,uuid,text,text)
 TO service_role;
