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
# Refuse remote connections BEFORE invoking psql. The SQL loopback check alone
# runs only after a connection has already been established.
# Deliberately require a simple loopback URI with no query-string overrides.
[[ "$MAXX_TEST_DATABASE_URL" =~ ^postgres(ql)?://([^/@]*@)?(localhost|127\\.0\\.0\\.1)(:[0-9]+)?/([A-Za-z0-9_-]+)$ ]] || { echo 'REFUSED: explicit loopback PostgreSQL URI required' >&2; exit 2; }
[[ "${BASH_REMATCH[5]}" =~ (disposable|throwaway|maxx_test) ]] && [[ ! "${BASH_REMATCH[5]}" =~ (prod|staging|stage|live|primary) ]] || { echo 'REFUSED: disposable database name required' >&2; exit 2; }
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
-- Fail closed if the probe is accidentally run as an RLS-bypassing role,
-- or if the session has row-level security disabled.
SELECT 1 / (CASE WHEN
  current_user = 'authenticated'
  AND current_setting('row_security') = 'on'
  AND NOT (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user)
  THEN 1 ELSE 0 END) AS rls_execution_context;
-- The identity check is meaningless if the target relation has RLS disabled.
-- Assert the actual projects table is protected, not just the session setting.
SELECT 1 / (CASE WHEN EXISTS (
  SELECT 1 FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'maxx' AND c.relname = 'projects'
    AND c.relkind IN ('r', 'p') AND c.relrowsecurity
    -- Table owners bypass RLS unless FORCE ROW LEVEL SECURITY is set.
    AND (c.relforcerowsecurity OR c.relowner <> (SELECT oid FROM pg_roles WHERE rolname = current_user))
) THEN 1 ELSE 0 END) AS projects_rls_enabled;
-- A session with the authenticated DB role but no JWT subject must not
-- inherit access to either workspace. This catches fail-open policy helpers.
SELECT set_config('request.jwt.claim.sub', '', true);
SELECT 1 / (CASE WHEN
  NOT EXISTS (SELECT 1 FROM maxx.projects WHERE id=:'alice_project'::uuid)
  AND NOT EXISTS (SELECT 1 FROM maxx.projects WHERE id=:'bob_project'::uuid)
  THEN 1 ELSE 0 END) AS missing_subject_denied;
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
