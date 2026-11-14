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
  *) echo 'MOCK: SQL execution would be reached' >&2; exit 97 ;;
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
export MAXX_MOCK_DATABASE=maxx_disposable MAXX_MOCK_SERVER=127.0.0.1 MAXX_TEST_DB_LABEL=production
assert_refusal missing_disposable_label 0
echo 'PASS: three refusal negative controls; no SQL mutations reached'
