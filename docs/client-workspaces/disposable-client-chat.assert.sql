-- Isolated, transactional review-only test. Synthetic users and no live data.
-- Membership fixtures are created by disposable-tenant-isolation.assert.sql.
SET LOCAL ROLE service_role;
DO $proof$
DECLARE
  bunna uuid;
  crown uuid;
  exchange uuid := '99999999-9999-4999-8999-999999999999';
  rows jsonb;
  denied boolean := false;
BEGIN
  SELECT id INTO bunna FROM maxx.projects WHERE slug='bunna-restaurant';
  SELECT id INTO crown FROM maxx.projects WHERE slug='crown-and-core';
  rows := public.maxx_service_record_client_chat_exchange(
    '22222222-2222-4222-8222-222222222222',bunna,exchange,
    'Draft a campaign for approval','DRAFT ONLY; no external actions taken');
  IF jsonb_array_length(rows)<>2 THEN RAISE EXCEPTION 'Exchange write not atomic'; END IF;
  -- Exactly two durable rows after an idempotent retry.
  PERFORM public.maxx_service_record_client_chat_exchange(
    '22222222-2222-4222-8222-222222222222',bunna,exchange,
    'Draft a campaign for approval','DRAFT ONLY; no external actions taken');
  IF (SELECT count(*) FROM maxx.project_chat_messages WHERE exchange_id=exchange)<>2 THEN
    RAISE EXCEPTION 'Duplicate message on retry';
  END IF;
  rows := public.maxx_service_client_chat_history(
    '22222222-2222-4222-8222-222222222222',bunna,100);
  IF jsonb_array_length(rows)<>2 THEN RAISE EXCEPTION 'Bob cannot reload his history'; END IF;
  rows := public.maxx_service_client_chat_history(
    '11111111-1111-4111-8111-111111111111',bunna,100);
  IF jsonb_array_length(rows)<>0 THEN RAISE EXCEPTION 'Bob history leaked to Alice owner'; END IF;
  BEGIN
    PERFORM public.maxx_service_client_chat_history(
      '22222222-2222-4222-8222-222222222222',crown,100);
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'Bob read foreign client chat'; END IF;
  denied := false;
  BEGIN
    PERFORM public.maxx_service_record_client_chat_exchange(
      '22222222-2222-4222-8222-222222222222',crown,exchange,'foreign','foreign');
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'Bob wrote foreign client chat'; END IF;
  denied := false;
  BEGIN
    PERFORM public.maxx_service_record_client_chat_exchange(
      '33333333-3333-4333-8333-333333333333',bunna,exchange,'unknown','unknown');
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'Unassigned Charlie wrote client chat'; END IF;
  denied := false;
  BEGIN
    PERFORM public.maxx_service_record_client_chat_exchange(
      '22222222-2222-4222-8222-222222222222',bunna,exchange,'altered','altered');
  EXCEPTION WHEN unique_violation THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'Exchange id reused with different content'; END IF;
  -- Revocation must immediately invalidate still-valid JWT subjects.
  UPDATE maxx.project_memberships SET status='revoked'
   WHERE project_id=bunna AND user_id='22222222-2222-4222-8222-222222222222';
  denied := false;
  BEGIN
    PERFORM public.maxx_service_client_chat_history(
      '22222222-2222-4222-8222-222222222222',bunna,100);
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'Revoked member kept chat access'; END IF;
END
$proof$;
RESET ROLE;

-- Browser JWT roles must not be able to SELECT messages or call service RPCs.
SET LOCAL ROLE authenticated;
DO $deny_browser$
DECLARE denied boolean := false;
BEGIN
 BEGIN PERFORM 1 FROM maxx.project_chat_messages LIMIT 1;
 EXCEPTION WHEN insufficient_privilege THEN denied := true;
 END;
 IF NOT denied THEN RAISE EXCEPTION 'Authenticated role read private chat table'; END IF;
 IF has_function_privilege('authenticated',
   'public.maxx_service_client_chat_history(uuid,uuid,integer)','EXECUTE')
   OR has_function_privilege('authenticated',
   'public.maxx_service_record_client_chat_exchange(uuid,uuid,uuid,text,text)','EXECUTE')
 THEN RAISE EXCEPTION 'Browser can invoke private service chat RPC'; END IF;
END
$deny_browser$;
RESET ROLE;
DO $success$
BEGIN RAISE NOTICE 'PASS: per-client chat exchange persistence, idempotency, operator isolation, revocation and RPC permission checks'; END
$success$;
