# Agent MAXX completion — verified run packet

Updated: 2026-11-15 (America/Mexico_City)
Product status: **NOT READY**
Mode: brownfield, one canonical frontend and one canonical backend; no duplicate orchestrator or scheduler.

## INTENT → BAR → LOCK
Deliver a chat/voice-first internal Agent MAXX for Stacy and team with seven isolated workspaces, owner-scoped settings, approvals, recoverable 30-day archive, ICM/Instinct connections and evidence receipts.
Acceptance requires reproducible clean installation, exact-HEAD CI, two independent authenticated identities proving both allowed access and cross-client read/write denial, role/OAuth verification, archive/restore verification, and authorized staging acceptance. No production release without independent review and explicit owner authorization.

## EVIDENCE (GitHub API read, 2026-11-15)
- Portal `executiveusa/macs-agent-portal#113`, draft, HEAD `b16cdffc3461f51345db9598a57fcb4642174630`: CI, MAXX Pups CI, MAXX release gates, MAXX Gap Closure CI all success. This is **CI evidence, not staging or production verification**.
- Backend `executiveusa/maxx-migrations-agentic-systems#43`, draft, HEAD `c3fc2c63d780a784bba6359773d9e4c0d478d209`: client boundary static preflight and Patch success; Linters and Semantic Commits failure; PostgreSQL skipped; MariaDB queued at inspection.
- Dependent backend draft `#29` HEAD `75074cb4faae791aa1cd80ee8ffcf1f8bfa309ed`: Linters, Semantic Commits and Restaurant validation failed.
- Dependent backend draft `#42` HEAD `bab6a79456d9ae8d9cddac3b341400b70b8ee084`: Linters and MAXX Web CI failed.
- Candidate SQL, disposable runner, negative controls and static assertions live in `docs/client-workspaces/`. The static preflight explicitly does **not** prove database RLS. No authorized disposable PostgreSQL execution receipt exists in this packet.
- Inspection environment could read GitHub via connected API, but direct git network access failed DNS resolution. No local test execution or new CI trigger is claimed.

## Fresh exact-HEAD gate audit (2026-11-15, run 10)
- Backend HEAD `c3fc2c63d780a784bba6359773d9e4c0d478d209`: Patch, static client-boundary preflight, Documentation Required and skipped-test checks succeeded; Linters and Semantic Commits failed; Server (Postgres) skipped and Server (Mariadb) queued. The static pass does not establish executable SQL or RLS isolation.
- Portal HEAD `b16cdffc3461f51345db9598a57fcb4642174630`: all four portal workflows succeeded. No staging verification is implied.
- Reviewed backend `.pre-commit-config.yaml`: Ruff import sorting and formatting are active, as are JS Prettier/ESLint and syntax hooks. Do not bypass or remove these checks. The PR commit list includes conventional `fix(maxx):`, `test(maxx):` and `docs(maxx):` titles, but the semantic-commit job's exact failure reason is not proven from those titles alone.
- Exact failing lint/semantic logs and a runnable isolated PostgreSQL environment are still required. Direct git access from this inspection runtime failed DNS resolution; do not claim local checks ran. No production/shared Supabase action authorized.

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

## BUILD → VERIFY — 2026-11-15: explicit-membership security repair

- **Finding:** Candidate `public.maxx_service_create_client_workspace` implicitly inserted a project owner membership for the creator. This violates the owner-approved no-auto-membership constraint and unnecessarily grants project permissions through a server-role RPC.
- **Fix:** Removed the implicit insert from `docs/client-workspaces/MANAGEMENT-RPC-CANDIDATE.sql` (commit `d2d3d92985ca6e5ff02edc9348788e22475b7a74`). Existing authenticated organization owner/admin authorization remains the RPC prerequisite; project memberships must be handled by a separately approved enrollment path.
- **Verification code:** `verify-candidate-boundaries.mjs` now rejects implicit membership writes in the create RPC (`73013bc0ae60eed03b385cde567f32b33bf276a2`); negative-control test injects the prohibited insert and expects failure (`1a05277634bb031be3e10442b9d0800bd21fe992`).
- **Exact SHA CI at inspection:** Static client boundary preflight completed SUCCESS at `1a05277634bb031be3e10442b9d0800bd21fe992`; other workflows were in progress/queued. This is a static source/negative-control check only, **not PostgreSQL RLS or production proof**.
- **Product status:** NOT READY. No deployment, live membership grant, shared Supabase SQL or customer records touched.
- **Rollback:** revert the three code/test commits in reverse order if independent review finds regression; no data migration needed.
- **Next:** finish full exact-HEAD CI, resolve longstanding lint/semantic failures, execute disposable PostgreSQL + two-user RLS tests, then verify OAuth/ICM/Instinct and staging under the existing MAXX-COMPLETE-001 PRD.

## 2026-11-15 — exact failed-job log diagnosis (no policy bypass)
- Read GitHub Actions job logs for PR #43 HEAD `e138eeacd805fa88af686a2380c6ad14223cf779`: **Linters** job `132892639340` failed because Prettier v2.7.1 modified JS files and Ruff formatter v0.2.0 reformatted exactly `ops/a2a/test_watch.py` and `ops/a2a/watch.py` (2 files); ESLint, Ruff import sorter and Ruff linter passed. This is a formatting-only diagnosis, not a security or database test result.
- **Semantic Commits** job `132892717820` identified one historical offending commit title: `security(maxx): scope approval and workflow-step RLS by parent client project`. `security` is not in the repository's allowed commitlint types. All other displayed candidate titles passed. Do **not** rewrite shared PR history or relax commitlint without explicit owner review; an isolated, reviewed branch replacement/cherry-pick strategy may be needed.
- Smallest safe next repair: run pinned Prettier and Ruff formatters in an authenticated checkout, commit only resulting source formatting, and confirm exact-HEAD checks. The historical semantic-commit failure requires separate authorized history strategy, not repeated new documentation commits.
- Current status **NOT READY**. No SQL executed, no shared Supabase changes, no merges/deployments. Rollback for this documentation note: revert its commit.
