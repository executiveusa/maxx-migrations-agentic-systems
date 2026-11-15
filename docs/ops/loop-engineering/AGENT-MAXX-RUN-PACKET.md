# Agent MAXX completion — verified run packet

Updated: 2026-11-15 (America/Mexico_City)
Product status: **NOT READY**
Mode: brownfield, one canonical frontend and one canonical backend; no duplicate orchestrator or scheduler.

## INTENT → BAR → LOCK
Deliver a chat/voice-first internal Agent MAXX for Stacy and team with seven isolated workspaces, owner-scoped settings, approvals, recoverable 30-day archive, ICM/Instinct connections and evidence receipts.
Acceptance requires reproducible clean installation, exact-HEAD CI, two independent authenticated identities proving both allowed access and cross-client read/write denial, role/OAuth verification, archive/restore verification, and authorized staging acceptance. No production release without independent review and explicit owner authorization.

## EVIDENCE (GitHub API read, 2026-11-15)
- Portal `executiveusa/macs-agent-portal#113`, draft, HEAD `b16cdffc3461f51345db9598a57fcb4642174630`: CI, MAXX Pups CI, MAXX release gates, MAXX Gap Closure CI all success. This is **CI evidence, not staging or production verification**.
- Backend `executiveusa/maxx-migrations-agentic-systems#43`, draft, HEAD `33caf39898a80b263785ae2657ac9f7cd0488f5a`: client boundary static preflight and Patch success; Linters and Semantic Commits failure; PostgreSQL skipped; MariaDB queued at inspection.
- Dependent backend draft `#29` HEAD `75074cb4faae791aa1cd80ee8ffcf1f8bfa309ed`: Linters, Semantic Commits and Restaurant validation failed.
- Dependent backend draft `#42` HEAD `bab6a79456d9ae8d9cddac3b341400b70b8ee084`: Linters and MAXX Web CI failed.
- Candidate SQL, disposable runner, negative controls and static assertions live in `docs/client-workspaces/`. The static preflight explicitly does **not** prove database RLS. No authorized disposable PostgreSQL execution receipt exists in this packet.
- Inspection environment could read GitHub via connected API, but direct git network access failed DNS resolution. No local test execution or new CI trigger is claimed.

## GRAPH → SPEC → SLICE
Priority dependencies:
1. Backend #43 lint and semantic-commit checks must be diagnosed from actual failing job logs; do not rewrite shared history or disable hooks just to obtain green CI.
2. Run `bash docs/client-workspaces/test-disposable-security-gate.sh` and `node docs/client-workspaces/verify-candidate-boundaries.test.mjs` on a checked-out exact HEAD; attach exit codes and stdout.
3. On a disposable **local/loopback** PostgreSQL database with the MAXX baseline schema and Supabase-equivalent roles, set `MAXX_TEST_DATABASE_URL` and `MAXX_TEST_DB_LABEL=maxx-disposable`; execute `bash docs/client-workspaces/run-disposable-security-gate.sh`. Capture sanitized exit code, database version, commit SHA and rollback proof. Do not connect it to the shared botanic-creations database.
4. Separately test two actual identities across all seven projects: allowed own-project reads/writes, denied other-project reads/writes, membership non-escalation, approvals, owner settings and archive/restore. Record SQL assertions and receipts; static policy-name inspection is insufficient.
5. Verify OAuth/roles, chat/voice/hands-free behavior, ICM tools and Instinct bridge in staging; require independent review before owner-approved release.

## BUILD → VERIFY → GAUNTLET
This packet is documentation-only; no SQL was applied and no product behavior changed. The previous candidate SQL fixes are source-level, not executable database evidence. Treat all unverified external connections and client data as unverified. Never manufacture evidence or access.

## RELEASE → LEARN
Release blocked by backend CI and missing disposable database identity/RLS evidence. Required human action if a server-side agent cannot provision an isolated database: provide an authorized disposable test environment (never shared production credentials). Rollback for this packet: revert its documentation commit. Next smallest engineering action: obtain exact failing backend CI log and make the minimum formatter/lint correction, then rerun checks at the resulting SHA.
