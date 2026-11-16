# MAXX disposable RLS acceptance gate — 2026-11-15

Status: NOT READY. This is a test contract, not proof of execution.

## Baseline
- Candidate: executiveusa/maxx-migrations-agentic-systems PR #45 at `808c72f06b23467d50d1033e481a63f804954cad`.
- Portal: executiveusa/macs-agent-portal PR #113 at `8d2260822d4e4b697280f9164d8640e28d095049`.
- CI observed: portal four successful workflows; backend static preflight, lint, semantic commits and patch successful. Backend MariaDB job had no final conclusion when queried.
- Original PR #43 retained; no merge, shared SQL or production changes.

## Required independent executable gate
Use an ephemeral PostgreSQL/Supabase-compatible instance, never `cyxdevcjycmffhmwxojh`. Record database version, migrations/checksums, full setup commands, test harness, sanitized stdout/stderr, and teardown. Run each assertion under real authenticated JWT principals, not service-role or table owner bypass.

Create principals A (member of CROWN AND CORE only), B (member of BUNNA RESTAURANT only), and C (no membership). Seed distinguishable synthetic records for both workspaces. Test each principal against all seven workspaces and every scoped resource: projects, messages, settings, approvals, archive/recovery, receipts and tool invocation. Assert:
1. A can read/write only A-scoped permitted resources; B only B-scoped resources.
2. A cannot SELECT/INSERT/UPDATE/DELETE B data; B cannot operate on A data; C cannot access either.
3. Spoofing `project_id`, owner ID, headers, request body or JWT claims does not bypass policy.
4. Non-owner cannot change owner settings or grant membership. Unapproved actions cannot execute.
5. Archived items remain isolated and recoverable only within the 30-day policy.
6. RPCs, joins, realtime, storage, backend service endpoints and ICM tools cannot cross tenant boundaries.
7. Missing or expired credentials fail closed. Tests include at least one positive authorized control per denial category.
8. A second independent reviewer validates the negative tests, RLS definitions, and bypass roles.

## Release decision
Fail any denial => NOT READY. Passing static CI alone => NOT READY. Passing disposable integration gate plus review permits consideration of READY FOR PREVIEW, never PRODUCTION VERIFIED.

## Rollback
Close this documentation-only PR and delete its isolated branch. No migration or production state is changed.

## Next slice
Implement an automated disposable-database test harness for the candidate migrations, preserving the source SQL unchanged until independent review.
