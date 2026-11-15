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
# Require a local socket/loopback server, not merely a caller-supplied label.
# This is a defense in depth, not proof that a forwarded local port is safe.
server_ip="$(psql "$MAXX_TEST_DATABASE_URL" -X -A -t -v ON_ERROR_STOP=1 -c "select coalesce(inet_server_addr()::text, 'local-socket')")"
case "$server_ip" in
  local-socket|127.*|::1) ;;
  *) echo "REFUSED: SQL gate only accepts local/loopback PostgreSQL" >&2; exit 2 ;;
esac
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
  # Snapshot existing membership assignments; the candidate must never grant
  # access implicitly while seeding the seven workspaces.
  # The baseline production schema has no project_memberships table yet.
  # Capture a zero-row baseline safely in that case, while preserving every
  # existing row when re-testing a partially migrated disposable clone.
  cat <<'SQL'
CREATE TEMP TABLE maxx_gate_memberships_before (membership jsonb) ON COMMIT DROP;
DO $
BEGIN
  IF to_regclass('maxx.project_memberships') IS NOT NULL THEN
    INSERT INTO maxx_gate_memberships_before(membership)
    SELECT to_jsonb(m) FROM maxx.project_memberships m;
  END IF;
END $;
SQL
  cat "$sql/PROPOSED-SCHEMA-AND-SEED.sql" | sed '/^BEGIN;$/d; /^COMMIT;$/d'
  cat "$sql/CANONICAL-CLIENT-RPC-AND-RLS-CANDIDATE.sql"
  cat "$sql/MANAGEMENT-RPC-CANDIDATE.sql"
  cat <<'SQL'
DO $$
DECLARE
  n integer;
BEGIN
  IF EXISTS (
    (SELECT to_jsonb(m) FROM maxx.project_memberships m
     EXCEPT ALL SELECT membership FROM maxx_gate_memberships_before)
    UNION ALL
    (SELECT membership FROM maxx_gate_memberships_before
     EXCEPT ALL SELECT to_jsonb(m) FROM maxx.project_memberships m)
  ) THEN
    RAISE EXCEPTION 'Candidate SQL unexpectedly modified project memberships';
  END IF;
  SELECT count(*) INTO n FROM maxx.project_memberships;
  IF n <> 0 THEN
    RAISE NOTICE 'Existing memberships: % (not interpreted as verified)', n;
  END IF;
  -- Confirm the seed actually created the seven named clients and 28 prompts.
  -- A missing MACS organization must fail rather than silently pass.
  IF (SELECT count(*) FROM maxx.projects p
      JOIN maxx.organizations o ON o.id=p.organization_id
      WHERE o.slug='macs-digital-media' AND p.slug IN (
        'crown-and-core','thp-flooring','bunna-restaurant',
        'macs-digital-media','asc3nd','3x-plumbers','tangles-and-locs')) <> 7 THEN
    RAISE EXCEPTION 'Seven MAXX workspace seeds not present';
  END IF;
  IF (SELECT count(*) FROM maxx.project_prompt_templates t
      JOIN maxx.projects p ON p.id=t.project_id AND p.organization_id=t.organization_id
      JOIN maxx.organizations o ON o.id=p.organization_id
      WHERE o.slug='macs-digital-media' AND p.slug IN (
        'crown-and-core','thp-flooring','bunna-restaurant',
        'macs-digital-media','asc3nd','3x-plumbers','tangles-and-locs')
        AND t.provenance='operator_template') <> 28 THEN
    RAISE EXCEPTION 'Expected 28 operator-template prompts';
  END IF;
  -- Public client RPC is callable by service_role only, never browser roles.
  IF has_function_privilege('anon',
      'public.maxx_service_client_workspaces(uuid)', 'EXECUTE')
     OR has_function_privilege('authenticated',
      'public.maxx_service_client_workspaces(uuid)', 'EXECUTE')
     OR NOT has_function_privilege('service_role',
      'public.maxx_service_client_workspaces(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Unsafe MAXX workspace RPC execute grants';
  END IF;
  -- A policy name alone is not security evidence: enforce restrictive
  -- semantics, authenticated target, and a project-scoped predicate.
  IF EXISTS (
    SELECT 1 FROM (VALUES
      ('approvals','maxx_v3_approvals_select'),
      ('run_steps','maxx_v3_run_steps_select'),
      ('projects','maxx_v3_project_read_scope')
    ) AS expected(table_name,policy_name)
    WHERE NOT EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname='maxx' AND p.tablename=expected.table_name
        AND p.policyname=expected.policy_name
        AND p.permissive='RESTRICTIVE'
        AND p.cmd='SELECT'
        AND 'authenticated'=ANY(p.roles)
        AND p.qual LIKE '%can_access_client_project%'
    )
  ) THEN
    RAISE EXCEPTION 'Missing or weakened restrictive project SELECT isolation policy';
  END IF;
  -- Parent project-linked tables must not inherit legacy org-wide visibility.
  -- Check the complete set, not just the three headline policies.
  IF EXISTS (
    SELECT 1 FROM unnest(ARRAY[
      'action_proposals','artifacts','audit_log','context_snapshots',
      'events','evidence_receipts','external_refs','workflow_runs'
    ]) AS expected(table_name)
    WHERE NOT EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname='maxx'
        AND p.tablename=expected.table_name
        AND p.policyname='maxx_v3_scope_select'
        AND p.permissive='RESTRICTIVE'
        AND p.cmd='SELECT'
        AND 'authenticated'=ANY(p.roles)
        AND p.qual LIKE '%can_access_client_project%'
    )
  ) THEN
    RAISE EXCEPTION 'Missing restrictive project SELECT policy on a parent table';
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
