#!/usr/bin/env bash
set -euo pipefail
script="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/run-disposable-security-gate.sh"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
cat > "$work/psql" <<'MOCK'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$MAXX_MOCK_LOG"
case "$*" in
  *current_database\(\)*) printf '%s\n' "$MAXX_MOCK_DATABASE" ;;
  *inet_server_addr\(\)*) printf '%s\n' "$MAXX_MOCK_SERVER" ;;
  *) cat > "$MAXX_MOCK_SQL"; if grep -Fq "Missing required MAXX baseline schema" "$MAXX_MOCK_SQL"; then exit 0; fi; echo 'MOCK: candidate SQL execution would be reached' >&2; exit 97 ;;
esac
MOCK
chmod +x "$work/psql"
export PATH="$work:$PATH" MAXX_TEST_DATABASE_URL='postgresql://mock@localhost/maxx_disposable' MAXX_TEST_DB_LABEL=maxx-disposable MAXX_MOCK_LOG="$work/calls"
assert_refusal() {
  local name="$1" expected_calls="$2" output rc
  : > "$MAXX_MOCK_LOG"
  rc=0
  output="$(bash "$script" 2>&1)" || rc=$?
  if [[ "$rc" -ne 2 ]] || [[ "$(wc -l < "$MAXX_MOCK_LOG")" -ne "$expected_calls" ]] || [[ "$output" != *REFUSED* ]]; then
    echo "FAIL: $name (exit=$rc, calls=$(wc -l < "$MAXX_MOCK_LOG"))" >&2
    echo "$output" >&2
    exit 1
  fi
  echo "PASS: $name"
}
export MAXX_MOCK_DATABASE=maxx_disposable MAXX_MOCK_SERVER=203.0.113.10
assert_refusal remote_server 2
export MAXX_MOCK_DATABASE=production MAXX_MOCK_SERVER=127.0.0.1
assert_refusal production_named_database 2
export MAXX_MOCK_DATABASE=production_disposable MAXX_MOCK_SERVER=127.0.0.1
assert_refusal ambiguous_production_disposable 2
export MAXX_MOCK_DATABASE=staging_maxx_test MAXX_MOCK_SERVER=127.0.0.1
assert_refusal ambiguous_staging_test 2
export MAXX_MOCK_DATABASE=maxx_disposable MAXX_MOCK_SERVER=2001:db8::1
assert_refusal remote_ipv6_server 2
export MAXX_MOCK_DATABASE=maxx_disposable MAXX_MOCK_SERVER='::ffff:203.0.113.10'
assert_refusal ipv4_mapped_remote_ipv6_server 2
export MAXX_MOCK_DATABASE=primary_maxx_test MAXX_MOCK_SERVER=127.0.0.1
assert_refusal ambiguous_primary_test 2
export MAXX_MOCK_DATABASE=maxx_disposable MAXX_MOCK_SERVER=127.0.0.1 MAXX_TEST_DB_LABEL=production
assert_refusal missing_disposable_label 0
echo 'PASS: eight refusal negative controls; no SQL mutations reached'

# Inspect the actual SQL streamed to psql after all guards pass. A prior
# regression emitted "DO $ ... END $;" which PostgreSQL rejects immediately.
# This mock is NOT evidence of successful PostgreSQL execution or RLS isolation.
export MAXX_MOCK_SQL="$work/candidate.sql" MAXX_MOCK_DATABASE=maxx_disposable MAXX_MOCK_SERVER=127.0.0.1 MAXX_TEST_DB_LABEL=maxx-disposable
rc=0
bash "$script" >/dev/null 2>&1 || rc=$?
if [[ "$rc" -ne 97 ]] || [[ ! -s "$MAXX_MOCK_SQL" ]]; then
  echo "FAIL: disposable SQL did not reach mocked psql as expected (exit=$rc)" >&2
  exit 1
fi
if ! grep -Fq 'DO $$' "$MAXX_MOCK_SQL" || ! grep -Fq 'END $$;' "$MAXX_MOCK_SQL" || grep -Fxq 'DO $' "$MAXX_MOCK_SQL" || grep -Fxq 'END $;' "$MAXX_MOCK_SQL"; then
  echo 'FAIL: membership snapshot has malformed PostgreSQL dollar quotes' >&2
  exit 1
fi
if ! grep -Fq 'CREATE TEMP TABLE maxx_gate_memberships_before' "$MAXX_MOCK_SQL" || ! grep -Fxq 'ROLLBACK;' "$MAXX_MOCK_SQL"; then
  echo 'FAIL: membership snapshot or transaction rollback missing' >&2
  exit 1
fi
echo 'PASS: generated SQL uses valid DO dollar delimiters and rollback (mock only)'
