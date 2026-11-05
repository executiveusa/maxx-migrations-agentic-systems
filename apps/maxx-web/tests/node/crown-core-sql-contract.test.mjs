import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const sql = readFileSync(
  new URL(
    "../../supabase/migrations/20261104000000_maxx_offer_drafts.sql",
    import.meta.url
  ),
  "utf8"
);
test("privileged RPCs never live in public API schema", () => {
  assert.match(
    sql,
    /create or replace function maxx_internal\.maxx_create_offer_draft/
  );
  assert.match(
    sql,
    /create or replace function maxx_internal\.maxx_review_offer_draft/
  );
  assert.doesNotMatch(
    sql,
    /create or replace function public\.maxx_create_offer_draft[\s\S]*?language plpgsql security definer/i
  );
  assert.match(sql, /language sql security invoker set search_path = ''/);
});
test("audit artifacts stay tenant-scoped and member-restricted", () => {
  assert.match(
    sql,
    /maxx_offer_draft_select[\s\S]*?maxx_is_icm_member\(tenant_id\)/
  );
  assert.match(
    sql,
    /maxx_offer_event_select[\s\S]*?maxx_is_icm_member\(tenant_id\)/
  );
  assert.match(sql, /slug = 'crown-and-core'/);
  assert.match(sql, /SELF_REVIEW_FORBIDDEN/);
  assert.match(sql, /STALE_PAYLOAD/);
  assert.match(sql, /IDEMPOTENCY_CONFLICT/);
  assert.match(sql, /external_side_effects/);
});
test("public access is revoked and no client write table grant is present", () => {
  assert.match(
    sql,
    /revoke all on public\.maxx_offer_drafts from public, anon, authenticated/
  );
  assert.match(
    sql,
    /revoke all on public\.maxx_offer_draft_events from public, anon, authenticated/
  );
  assert.doesNotMatch(
    sql,
    /grant\s+(insert|update|delete)\s+on public\.maxx_offer_drafts\s+to\s+(anon|authenticated)/i
  );
});

test("review requires durable rationale and SHA256 uses PostgreSQL built-in", () => {
  assert.match(sql, /pg_catalog\.sha256\(/);
  assert.doesNotMatch(sql, /extensions\.digest/);
  assert.match(sql, /p_review_note text/);
  assert.match(sql, /REVIEW_RATIONALE_REQUIRED/);
  assert.match(sql, /review_note text null/);
  assert.match(sql, /review_rationale_recorded/);
});
