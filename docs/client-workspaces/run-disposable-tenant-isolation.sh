#!/usr/bin/env bash
# Real PostgreSQL test against an independently disposable localhost instance.
# NO shared Supabase SQL or migration history is touched.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${MAXX_TEST_DATABASE_URL:?Disposable localhost database is required}"
# Reuse the existing hardened guard and baseline schema/SQL validity checks.
# Fail closed before touching any candidate SQL if identity or host is unsafe.
bash "$here/run-disposable-security-gate.sh"
# All fixtures, membership grants, candidate DDL, data mutations and recovery
# actions are inside one transaction. Database disconnect also rolls back.
{
  echo 'BEGIN;'
  sed '/^BEGIN;$/d; /^COMMIT;$/d' "$here/PROPOSED-SCHEMA-AND-SEED.sql"
  cat "$here/CANONICAL-CLIENT-RPC-AND-RLS-CANDIDATE.sql"
  cat "$here/MANAGEMENT-RPC-CANDIDATE.sql"
  cat "$here/CLIENT-CHAT-PERSISTENCE-CANDIDATE.sql"
  cat "$here/CLIENT-APPROVAL-READ-CANDIDATE.sql"
  cat "$here/CLIENT-ICM-EXECUTION-CANDIDATE.sql"
  cat "$here/disposable-tenant-isolation.assert.sql"
  cat "$here/disposable-client-icm.assert.sql"
  cat "$here/disposable-client-approvals.assert.sql"
  cat "$here/disposable-client-chat.assert.sql"
  echo 'ROLLBACK;'
} | psql "$MAXX_TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f -
echo 'PASS: isolated PostgreSQL tenant/RLS integration completed and rolled back'
