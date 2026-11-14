#!/usr/bin/env bash
set -euo pipefail
: "${MAXX_TEST_DATABASE_URL:?Set a disposable PostgreSQL connection URL}"
if [[ "${MAXX_TEST_DB_LABEL:-}" != "maxx-disposable" ]]; then
  echo "REFUSED: MAXX_TEST_DB_LABEL must equal maxx-disposable" >&2
  exit 2
fi
if ! command -v psql >/dev/null 2>&1; then
  echo "REFUSED: psql is required" >&2
  exit 2
fi
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
sql="$root/docs/client-workspaces"
# Require a database name containing a disposable marker; a label alone is
# insufficient. Do not echo credentials or the connection string.
db_name="$(psql "$MAXX_TEST_DATABASE_URL" -X -A -t -v ON_ERROR_STOP=1 -c 'select current_database()')"
case "$db_name" in
  *disposable*|*throwaway*|*maxx_test*) ;;
  *) echo "REFUSED: database name is not explicitly disposable" >&2; exit 2 ;;
esac
echo "Preflight: disposable database marker verified"
psql "$MAXX_TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
  IF to_regclass('maxx.projects') IS NULL
     OR to_regclass('maxx.organizations') IS NULL
     OR to_regclass('maxx.memberships') IS NULL
     OR to_regclass('auth.users') IS NULL THEN
    RAISE EXCEPTION 'Missing required MAXX baseline schema';
  END IF;
END $$;
SQL
# Transaction rollback ensures this gate cannot leave candidate DDL or seeded
# clients behind even if a later assertion fails.
{
  echo 'BEGIN;'
  cat "$sql/PROPOSED-SCHEMA-AND-SEED.sql" | sed '/^BEGIN;$/d; /^COMMIT;$/d'
  cat "$sql/CANONICAL-CLIENT-RPC-AND-RLS-CANDIDATE.sql"
  cat "$sql/MANAGEMENT-RPC-CANDIDATE.sql"
  cat <<'SQL'
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n FROM maxx.project_memberships;
  IF n <> 0 THEN
    RAISE NOTICE 'Existing memberships: % (not interpreted as verified)', n;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies
      WHERE schemaname='maxx' AND tablename='approvals'
        AND policyname='maxx_v3_approvals_select') THEN
    RAISE EXCEPTION 'Missing approvals SELECT isolation policy';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies
      WHERE schemaname='maxx' AND tablename='run_steps'
        AND policyname='maxx_v3_run_steps_select') THEN
    RAISE EXCEPTION 'Missing run_steps isolation policy';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace ns ON ns.oid=c.relnamespace
      WHERE ns.nspname='maxx' AND c.relname='project_memberships' AND c.relrowsecurity) THEN
    RAISE EXCEPTION 'Membership RLS not enabled';
  END IF;
END $$;
ROLLBACK;
SQL
} | psql "$MAXX_TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f -
echo "PASS: candidate SQL parsed and executed, transaction rolled back."
echo "NOT PROVEN: two-user JWT/RLS access denial, recovery, production safety."
