\set ON_ERROR_STOP on
-- Run as the authenticated role, NOT superuser. A failed guard raises an error.
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);

do $proof$
declare
  crown constant uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  foreign_tenant constant uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  request_id constant uuid := 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
  audit jsonb := jsonb_build_object('offer_id','maxx-vibe-audit-v1','kind','audit','price',null,'external_side_effects',0,
                    'sources',jsonb_build_array(jsonb_build_object('id','public-site','url','https://crownandcore.com/')),
                    'findings',jsonb_build_array());
  receipt jsonb;
  replay jsonb;
  proposed jsonb;
  audit_id uuid;
  audit_hash text;
  rejected boolean;
  sample_count int;
  i int;
begin
  -- Author creates one synthetic, internal-only audit.
  select public.maxx_create_offer_draft(crown,'audit',audit,'proof-idempotency-001',request_id,null)
    into receipt;
  if receipt->>'status' <> 'draft' or receipt->>'external_side_effects' <> '0' then
    raise exception 'Audit receipt is not a protected zero-effect draft';
  end if;
  audit_id := (receipt->>'id')::uuid;
  audit_hash := receipt->>'payload_hash';
  if length(audit_hash) <> 64 then raise exception 'SHA256 digest missing'; end if;

  select public.maxx_create_offer_draft(crown,'audit',audit,'proof-idempotency-001',request_id,null)
    into replay;
  if replay->>'replayed' <> 'true' or replay->>'id' <> receipt->>'id' then
    raise exception 'Idempotency failed';
  end if;
  select count(*) into sample_count from public.maxx_offer_drafts where id=audit_id;
  if sample_count <> 1 then raise exception 'Idempotency duplicated rows'; end if;

  -- Same idempotency key with modified payload must conflict.
  rejected := false;
  begin
    perform public.maxx_create_offer_draft(crown,'audit',jsonb_set(audit,'{sources}','[]'::jsonb),
              'proof-idempotency-001',request_id,null);
  exception when sqlstate '23505' then rejected := true;
  end;
  if not rejected then raise exception 'Conflicting idempotency key accepted'; end if;

  -- Cannot write in a foreign tenant even when its ID is supplied.
  rejected := false;
  begin
    perform public.maxx_create_offer_draft(foreign_tenant,'audit',audit,'foreign-tenant-key-01',request_id,null);
  exception when sqlstate '42501' then rejected := true;
  end;
  if not rejected then raise exception 'Foreign tenant write accepted'; end if;

  -- Cannot self-review or create a proposal before independent review.
  rejected := false;
  begin
    perform public.maxx_review_offer_draft(crown,audit_id,'review',audit_hash,
      'Author cannot independently verify own internal preaudit');
  exception when sqlstate '42501' then rejected := true;
  end;
  if not rejected then raise exception 'Author self-review accepted'; end if;

  rejected := false;
  begin
    perform public.maxx_create_offer_draft(crown,'proposal',
      jsonb_build_object('offer_id','maxx-vibe-audit-v1','kind','proposal','price',null,'external_side_effects',0,
        'source_audit_id',audit_id,'source_audit_digest',audit_hash),
      'unreviewed-proposal-key-01',request_id,audit_id);
  exception when sqlstate '22023' then rejected := true;
  end;
  if not rejected then raise exception 'Proposal created from unreviewed draft'; end if;

  -- A missing rationale must fail, even for a real independent reviewer.
  perform set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
  rejected := false;
  begin
    perform public.maxx_review_offer_draft(crown,audit_id,'review',audit_hash,'too short');
  exception when sqlstate '22023' then rejected := true;
  end;
  if not rejected then raise exception 'Review without rationale accepted'; end if;

  -- No one may review an artifact with a stale hash.
  rejected := false;
  begin
    perform public.maxx_review_offer_draft(crown,audit_id,'review',repeat('0',64),
      'Evidence references reviewed; unsupported facts remain unverified');
  exception when sqlstate '22023' then rejected := true;
  end;
  if not rejected then raise exception 'Stale artifact hash accepted'; end if;

  -- Separate human reviewer approves internal draft only, with durable rationale.
  select public.maxx_review_offer_draft(crown,audit_id,'review',audit_hash,
      'Checked public sources; findings remain hypotheses pending owner consent')
    into receipt;
  if receipt->>'status' <> 'reviewed' or receipt->>'external_side_effects' <> '0' then
    raise exception 'Independent review did not return safe status';
  end if;
  select count(*) into sample_count from public.maxx_offer_draft_events
    where draft_id=audit_id and event_type='reviewed'
      and review_note='Checked public sources; findings remain hypotheses pending owner consent';
  if sample_count <> 1 then raise exception 'Review rationale ledger missing'; end if;

  -- Cross-tenant actor cannot read the Crown audit even via a known ID.
  perform set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
  select count(*) into sample_count from public.maxx_offer_drafts where id=audit_id;
  if sample_count <> 0 then raise exception 'RLS exposed Crown record across tenants'; end if;
  select count(*) into sample_count from public.maxx_offer_draft_events where draft_id=audit_id;
  if sample_count <> 0 then raise exception 'RLS exposed Crown audit ledger across tenants'; end if;
  rejected := false;
  begin
    perform public.maxx_review_offer_draft(crown,audit_id,'reject',audit_hash,
      'Foreign reviewer must not influence client account or evidence status');
  exception when sqlstate '42501' then rejected := true;
  end;
  if not rejected then raise exception 'Cross-tenant review accepted'; end if;

  -- Owner may create an unpriced proposal only after review, with linked digest.
  perform set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
  select public.maxx_create_offer_draft(crown,'proposal',
    jsonb_build_object('offer_id','maxx-vibe-audit-v1','kind','proposal','price',null,'external_side_effects',0,
      'source_audit_id',audit_id,'source_audit_digest',audit_hash),
    'reviewed-proposal-key-01',request_id,audit_id)
    into proposed;
  if proposed->>'status' <> 'draft' or proposed->>'external_side_effects' <> '0' then
    raise exception 'Proposed offer is not an unpriced internal draft';
  end if;

  -- Bound an author to 20 new drafts per rolling hour; retries do not count.
  select count(*) into sample_count from public.maxx_offer_drafts
    where tenant_id=crown and created_by=auth.uid()
      and created_at>now()-interval '1 hour';
  for i in 1..(20-sample_count) loop
    perform public.maxx_create_offer_draft(crown,'audit',audit,
      'rate-limit-key-'||lpad(i::text,3,'0'),gen_random_uuid(),null);
  end loop;
  rejected := false;
  begin
    perform public.maxx_create_offer_draft(crown,'audit',audit,
      'rate-limit-overage-001',gen_random_uuid(),null);
  exception when sqlstate '22023' then rejected := true;
  end;
  if not rejected then raise exception 'Rate limit ignored'; end if;

  raise notice 'CROWN CORE PG17 PASS: auth, membership, RLS, SHA, idempotency, review, provenance, rate limit and zero effects';
end $proof$;
rollback;
