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

## 2026-11-15 tenant-integrity static gate slice
- Baseline: portal PR #113 HEAD `b16cdffc3461f51345db9598a57fcb4642174630` had four successful workflows. Backend PR #43 HEAD `4a2cd71959de452721905c4d40eb97fc6a3bb67f`: Patch and client-boundary preflight passed; Linters and Semantic Commits failed; Postgres skipped; MariaDB pending.
- Source guard `62edddcabcf6d001a7c560964ceeef37e66f8fdc` requires all three client tables to retain the composite `(organization_id, project_id)` foreign key. Negative-control `b62771cf73b66dad1d446357a3c721e42f2aaf92` removes the FK in a temporary fixture and requires static verification to reject it.
- This prevents a future migration edit from silently weakening cross-organization referential integrity. It does NOT prove RLS isolation, database constraint execution or client role behavior.
- At write time exact-HEAD CI for the new code was not yet available. No local Node run claimed; direct git checkout remained blocked by DNS. Review the actual preflight result before promoting.
- No SQL executed, membership assigned, deployment or shared Supabase modification. Rollback: revert the two test-only commits in reverse order. Product remains **NOT READY**.
- Next smallest action: verify exact-HEAD CI; repair existing formatter/semantic failures without rewriting history; then test the composite FK and independent identities on disposable PostgreSQL.

## 2026-11-15 — management RPC privilege gate slice
- **INTENT/BAR:** prevent the create/archive service RPCs from becoming callable by browser roles after migration; database acceptance must verify *effective* PostgreSQL EXECUTE privileges, not only static GRANT text.
- **EVIDENCE:** portal PR #113 HEAD `b16cdffc3461f51345db9598a57fcb4642174630`, four workflows successful. Backend PR #43 baseline HEAD `24a552995d19dd84a31992f02fac3100fd697fcd`: static boundary, Patch and Documentation succeeded; Linters and Semantic Commits failed; PostgreSQL skipped. Dependent #29/#42 remain draft with failed checks.
- **BUILD:** added two service-only management RPC signatures to `run-disposable-security-gate.sh` effective-privilege checks, using `has_function_privilege` for `anon`, `authenticated`, and `service_role`. Commit `a25d13e23ed3479fb392e01f023205435358a6c7`.
- **VERIFY/GAUNTLET:** GitHub source write succeeded. Actual PostgreSQL execution and two-user RLS are **not proven** by this commit. Exact-HEAD CI must be inspected before promotion. No SQL was run against shared Supabase.
- **RELEASE:** NOT READY; no merge, deployment, data mutation, or permission grant. Rollback: revert `a25d13e23ed3479fb392e01f023205435358a6c7`.
- **NEXT:** obtain green backend lint and semantic checks without weakening policy; execute candidate SQL on authorized disposable local PostgreSQL, then independent two-principal project read/write denial.

## 2026-11-15 product repair and formatter proof

**Intent:** move past repetitive static-only changes to code-side production defects and failing CI. Product status remains **NOT READY**.

- Portal PR #113: `services/maxx-control-plane/src/client-workspaces.ts` previously rejected the genuine restore response `{status:"restored",projectId}` because it expected `state`. Fixed and added positive/negative regression tests at code SHA `8d2260822d4e4b697280f9164d8640e28d095049`. All four exact-code workflows SUCCESS: CI, MAXX Pups CI, MAXX release gates, MAXX Gap Closure CI. This does not prove actual database restore.
- Backend PR #43: inspected the failed Linters job (job `133014847130`) and recovered its exact four-file formatter patch. Validated every hunk against the unchanged file content before applying to `verify-candidate-boundaries.mjs`, `verify-candidate-boundaries.test.mjs`, `ops/a2a/test_watch.py`, `ops/a2a/watch.py` in commits `f767810d`, `f7d1325c`, `ca1fd039`, `dcbbedff612a868d5f9600b5e62844bd4f08a800`. **Exact HEAD `dcbbedff` Linters SUCCESS** and boundary static preflight SUCCESS. Patch and semantic status still to be rechecked, and PostgreSQL job skipped. No test was disabled.
- Supabase project inventory exposed exactly one connected project: production `botanic-creations` (`cyxdevcjycmffhmwxojh`). There is no authorized disposable project reachable through that connection. **No SQL was executed** and no membership was granted.
- Remaining release gates: historical invalid semantic-commit prefix requires approved non-rewriting PR strategy or review; disposable PostgreSQL schema execution and two authenticated-principal RLS proof; operator Google OAuth, persisted multi-client chat and approvals, genuine ICM/Instinct mission receipts; staging security/UX and backup/rollback; independent review and separate owner release authorization.
- **Rollback:** revert portal commits `8d226082`, `142ad556` in reverse chronological order for restore contract only; revert backend four formatting commits from `dcbbedff` back to `f767810d` in reverse order if needed. No production data changes.
- **Next safe action:** verify backend exact-head checks; use an explicitly authorized disposable PostgreSQL environment with MAXX baseline schema for real isolation; do not apply candidates to the shared database.

## 2026-11-16 — private client table security gate (isolated dependent slice)

- **INTENT/BAR/LOCK:** Keep the single MAXX workstream. Verify that all three newly proposed private tables enforce RLS and have no effective browser DML/DDL table privileges, including privileges inherited through PUBLIC. Server role must retain SELECT. No schema or production mutation.
- **EVIDENCE:** Portal PR #113 HEAD `de6df54fc5b1fdbee105a23e5976bdfc7c2526ce` had four successful workflows. Backend PR #46 HEAD `24cf28546ee8d3b5a858da799f8729f7a60f7cdb` had successful lint/static/documentation/patch/semantic checks; PostgreSQL skipped, MariaDB queued.
- **GRAPH/SPEC/SLICE:** Extend existing rollback-protected disposable SQL runner, not another runner or control plane. Tables: `project_memberships`, `project_prompt_templates`, `project_archive_requests`. Require `relrowsecurity`, deny effective `anon`/`authenticated` table privileges, preserve service-role SELECT. Mock suite verifies these assertions remain in generated SQL; it does not execute PostgreSQL.
- **BUILD:** `run-disposable-security-gate.sh` changed in `92ef79cf519d155f2c5a4fa0de9eb1022cbbc4cd`; mock assertion changed in `6e85224ee9889a5e334fbdd1dd80537d69eb913f`.
- **VERIFY/GAUNTLET:** Exact-head CI and real disposable PostgreSQL execution must still be collected. Do not claim authenticated Alice/Bob isolation from SQL text or mocks.
- **RELEASE/LEARN:** NOT READY. No shared Supabase writes, merges, production deployment, client data or membership grants. Rollback: revert the two code/test commits in reverse order. Next: inspect exact-head CI; run real two-principal project read/write tests on a disposable PostgreSQL environment and independently review receipts.
