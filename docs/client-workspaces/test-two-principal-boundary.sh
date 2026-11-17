#!/usr/bin/env bash
set -euo pipefail
# Read-only identity boundary smoke test. Requires a separately provisioned,
# disposable local DB with reviewed candidate SQL and explicit test memberships.
: "${MAXX_TEST_DATABASE_URL:?Disposable PostgreSQL URL required}"
: "${MAXX_ALICE_USER_ID:?Alice UUID required}"
: "${MAXX_BOB_USER_ID:?Bob UUID required}"
: "${MAXX_ALICE_PROJECT_ID:?Alice project UUID required}"
: "${MAXX_BOB_PROJECT_ID:?Bob project UUID required}"
[[ "${MAXX_TEST_DB_LABEL:-}" == "maxx-disposable" ]] || { echo 'REFUSED: disposable label required' >&2; exit 2; }
for value in "$MAXX_ALICE_USER_ID" "$MAXX_BOB_USER_ID" "$MAXX_ALICE_PROJECT_ID" "$MAXX_BOB_PROJECT_ID"; do
  [[ "$value" =~ ^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$ ]] || { echo 'REFUSED: invalid UUID' >&2; exit 2; }
done
[[ "$MAXX_ALICE_USER_ID" != "$MAXX_BOB_USER_ID" && "$MAXX_ALICE_PROJECT_ID" != "$MAXX_BOB_PROJECT_ID" ]] || { echo 'REFUSED: distinct identities and projects required' >&2; exit 2; }
command -v psql >/dev/null || { echo 'REFUSED: psql required' >&2; exit 2; }
psql "$MAXX_TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 \
  -v alice="$MAXX_ALICE_USER_ID" -v bob="$MAXX_BOB_USER_ID" \
  -v alice_project="$MAXX_ALICE_PROJECT_ID" -v bob_project="$MAXX_BOB_PROJECT_ID" <<'SQL'
BEGIN TRANSACTION READ ONLY;
DO $$ BEGIN
  IF current_database() !~* '(disposable|throwaway|maxx_test)' OR
     current_database() ~* '(prod|staging|stage|live|primary)' OR
     inet_server_addr() IS DISTINCT FROM '127.0.0.1'::inet AND
     inet_server_addr() IS DISTINCT FROM '::1'::inet AND
     inet_server_addr() IS NOT NULL THEN
    RAISE EXCEPTION 'Refusing non-disposable/non-loopback database';
  END IF;
END $$;
-- SET LOCAL ROLE and request.jwt.claim.sub emulate Supabase authenticated
-- requests; this tests the real SQL policy helper, not OAuth signature checks.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', :'alice', true);
SELECT 1 / (CASE WHEN
  EXISTS (SELECT 1 FROM maxx.projects WHERE id=:'alice_project'::uuid)
  AND NOT EXISTS (SELECT 1 FROM maxx.projects WHERE id=:'bob_project'::uuid)
  THEN 1 ELSE 0 END) AS alice_isolated;
SELECT set_config('request.jwt.claim.sub', :'bob', true);
SELECT 1 / (CASE WHEN
  EXISTS (SELECT 1 FROM maxx.projects WHERE id=:'bob_project'::uuid)
  AND NOT EXISTS (SELECT 1 FROM maxx.projects WHERE id=:'alice_project'::uuid)
  THEN 1 ELSE 0 END) AS bob_isolated;
RESET ROLE;
ROLLBACK;
SQL
echo 'PASS: two-principal project SELECT boundary (read-only transaction rolled back).'
echo 'NOT PROVEN: write denial, OAuth, archive, tools, or production.'
