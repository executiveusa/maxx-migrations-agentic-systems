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


### 2026-11-16 — Patch upstream ref isolation (NOT READY)
- **INTENT/BAR:** Repair Patch CI setup without changing RLS, client data, shared Supabase, or test assertions. Require actual Patch workflow success at exact HEAD before closing this gate.
- **LOCK/EVIDENCE:** Backend dependent PR #47 HEAD `86416795d0ea201386d57bce08bad5e1e023f00d`; Patch run [43950719306](https://github.com/executiveusa/maxx-migrations-agentic-systems/actions/runs/43950719306), job 133592143904 failed in Install: `fatal: couldn't find remote ref test/maxx-disposable-rls-acceptance-20261115`. `.github/helper/install.sh` defaults FRAPPE_BRANCH to GITHUB_BASE_REF, then fetches from `https://github.com/frappe/frappe`, where the fork-specific PR base is not present. Patch workflow's later upstream fetch also used GITHUB_BASE_REF.
- **GRAPH/SPEC/SLICE/BUILD:** One workflow-only patch: set FRAPPE_BRANCH=develop for Install and fetch upstream Frappe develop in Run Patch Tests; leave ERPNext checkout at the tested SHA. No upstream branch creation, no bypass or weakened assertions.
- **VERIFY/GAUNTLET:** Confirm both upstream fetch sites in committed workflow; GitHub Actions exact-head outcome pending. Independent review pending. This is not authenticated two-user RLS proof.
- **RELEASE/LEARN:** Remain draft, NOT READY; no merge/deploy/SQL. Rollback: revert the workflow commit on this dependent branch. Next: inspect new Patch run logs and separately execute Alice/Bob isolation against disposable PostgreSQL.

### 2026-11-16 — exact-HEAD Patch verification receipt
- **EVIDENCE:** GitHub Actions [Patch run 43979113525](https://github.com/executiveusa/maxx-migrations-agentic-systems/actions/runs/43979113525) completed **success** at source HEAD `c2cd59112aedc581207e60ad354bcf7d78f21b8a`. Linters run 43979113326, Semantic Commits run 43979113419, and Documentation Required run 43979113452 also succeeded at that same SHA. Server (Postgres) run 43979113477 was **skipped**; Server (Mariadb) run 43979113282 was **queued** at inspection. These outcomes verify the narrow Patch repair only; no authenticated RLS, Supabase, OAuth, or production claim follows.
- **GAUNTLET/RELEASE:** Independent review remains outstanding. Candidate schema remains unapplied to shared `botanic-creations`. Product **NOT READY**. The next bounded slice is an executable two-principal cross-project read/write-denial harness on an isolated disposable database, including a failing negative control and sanitized receipts.
- **ROLLBACK:** Revert workflow commit `0fd67d2` and this receipt update if needed; do not rewrite history. No runtime or database changes were made by this evidence update.

## 2026-11-17 — isolated two-principal read boundary probe

- **INTENT/BAR:** Move from static RLS policy inspection to executable SQL behavior for two distinct pre-authorized test users on two distinct projects. Do not seed memberships or access live Supabase.
- **LOCK/GRAPH:** Existing backend draft #48 HEAD `ec6724c13dd8f93afee1dafdffa096db474fd185` was the parent; portal #113 HEAD `267412f949b837a3794e8247cc341df6cad7e17b`. At inspection, portal four workflows passed; backend Patch, Linters, Semantic Commits and Documentation Required passed; PostgreSQL skipped, MariaDB queued.
- **SLICE/BUILD:** Add `docs/client-workspaces/test-two-principal-boundary.sh`. Requires explicit Alice/Bob UUIDs and separate project UUIDs, `MAXX_TEST_DB_LABEL=maxx-disposable`, local/loopback PostgreSQL and a disposable database name. Executes `BEGIN TRANSACTION READ ONLY`, sets `authenticated` and per-user JWT subject claims, asserts own-project visibility and cross-project invisibility for each user, then rolls back. No fixtures, memberships, SQL migrations or customer data are created.
- **VERIFY:** Shell syntax checked locally using `bash -n` (exit 0). No PostgreSQL instance or authorized Alice/Bob fixtures was available in this run; **no SQL execution or tenant-isolation success is claimed**. At minimum execute on a reviewed disposable Supabase-compatible baseline with two pre-provisioned non-admin test users, and attach sanitized output, PostgreSQL version, DB name (without credentials), exit code and exact HEAD SHA.
- **GAUNTLET:** This probes SELECT on `maxx.projects` only. It does **not** prove cross-client write denial, parent/child approvals, private table access, JWT signature validation, owner settings, archive/restore, ICM/Instinct, or production. An independent reviewer must examine SQL role simulation and any failed assumptions. A database superuser/test harness capable of `SET ROLE authenticated` is required.
- **RELEASE/LEARN:** **NOT READY**. Do not enable workspaces or apply SQL to shared `cyxdevcjycmffhmwxojh`. Rollback: revert the probe commit and this run-packet update; no database rollback required because none was modified. Next smallest action: run the probe on a disposable instance, then extend it to negative INSERT/UPDATE/approval checks.

## 2026-11-17 — table-owner bypass guard (PR #49)
- **EVIDENCE:** PR #49 baseline `67cd6492310c8323d4a3e3ead6d371cda14a4eb3`: Patch, Linters, Semantic Commits, Documentation Required and MAXX client boundary static preflight succeeded; PostgreSQL skipped and MariaDB queued. The read probe checked `relrowsecurity` and authenticated `rolbypassrls` but did not exclude the PostgreSQL table-owner bypass.
- **SLICE/BUILD:** Added a fail-closed assertion that the authenticated role is not the `maxx.projects` table owner unless `relforcerowsecurity` is enabled. Source commit `039a9d643bd7313293abd7720b5caf0d846d7c54`. No policy or schema changed.
- **VERIFY/GAUNTLET:** GitHub source change committed. Exact-HEAD CI and executable two-identity disposable DB proof remain pending; do not treat static preflight as runtime isolation. Independently review the new guard and run the probe on an authorized disposable DB.
- **RELEASE:** NOT READY. No shared Supabase writes, memberships, merges or deployments. **Rollback:** revert `039a9d643` and this packet update in reverse order.

### 2026-11-17 — pre-connect disposable URL gate (NOT READY)
- **INTENT/BAR:** Refuse remote/non-disposable database targets before `psql` opens a connection. Previously the loopback assertion executed only after connecting.
- **LOCK/SLICE/BUILD:** Existing draft PR #49; restrict the probe's connection URL to a simple loopback PostgreSQL URI with a disposable database name and no query-string host overrides. Commits `e20b835`, `b7129f6`, `851cc8f`. No schema or shared Supabase changes.
- **VERIFY:** Locally exercised the exact preflight shell pattern with `bash -n` and five cases: accepted localhost disposable and 127.0.0.1 maxx_test; rejected remote host, production database, and query-string host override. This is a *pattern-only* check, not an executed PostgreSQL probe. Exact-head CI and independent review pending.
- **GAUNTLET/RELEASE:** NOT READY; no actual Alice/Bob DB execution or cross-project write/approval proof. Current HEAD after this receipt must be rechecked. **Rollback:** revert this packet commit and the three source commits in reverse order. Next: authorized disposable PostgreSQL execution with sanitized evidence.

### 2026-11-17 — unassigned JWT subject negative control (NOT READY)
- **INTENT/BAR/LOCK:** Preserve one existing PR #49 and fail closed for a syntactically valid but unassigned JWT subject, distinct from both fixture users. Portal PR #113 remained draft at `267412f949b837a3794e8247cc341df6cad7e17b`; backend #49 prior HEAD `5a2e7e2aeb0eac5134f8adde0c6713888744c70f`; backend #43/#29/#42 remain draft.
- **SLICE/BUILD:** Added a sentinel identity negative SELECT check in `docs/client-workspaces/test-two-principal-boundary.sh`, source commit `df6cb22054a4f01e6a05d29bcd1102a0fd62cc00`. Sentinel fixture collision fails closed; no memberships or schema changes.
- **VERIFY/EVIDENCE:** Read the exact-HEAD source back from GitHub and confirmed both assertions. `psql` and Docker unavailable in this execution environment, so PostgreSQL behavior, exact-HEAD CI and independent review remain **unverified**. This is not a successful database gate.
- **GAUNTLET/RELEASE/LEARN:** Run the full probe on an authorized disposable local PostgreSQL database with reviewed schema and Alice/Bob memberships; capture sanitized stdout, exit code and exact SHA. Extend to write and approval denial only after SELECT acceptance. Product **NOT READY**. Shared Supabase untouched. **Rollback:** revert the packet commit followed by `df6cb22054a4f01e6a05d29bcd1102a0fd62cc00` on the draft branch.

### 2026-11-17 — bounded disposable probe execution (NOT READY)
- **INTENT/BAR:** Avoid indefinite connection/query hangs when the read-only Alice/Bob probe encounters an unavailable local database or blocking SQL.
- **LOCK/SLICE/BUILD:** Existing PR #49 only; commit `13c5d67ce0575ff60438cfb9916fbc695678644a` sets libpq `PGCONNECT_TIMEOUT=5`, transaction-local `statement_timeout=15s` and `lock_timeout=3s`. No schema, policies, memberships or production data modified.
- **VERIFY/EVIDENCE:** Source change committed; exact-head CI and real PostgreSQL execution must be checked separately. Timeout configuration is not RLS acceptance proof.
- **GAUNTLET/RELEASE:** NOT READY until the existing read probe runs on an authorized disposable DB with two distinct identities, sanitized receipts and independent review. **Rollback:** revert this packet commit, then `13c5d67ce0575ff60438cfb9916fbc695678644a`. Next: executable disposable two-principal SELECT gate, followed by write/approval denial tests.


### 2026-11-18 — exact-HEAD CI and separate synthetic database receipt reconciliation
- **INTENT/BAR/LOCK:** Preserve one existing Agent MAXX workstream and distinguish a passing synthetic database test from the unexecuted PR #49 read-only probe and real-schema production acceptance. No schema, identity, membership, production, or shared Supabase changes.
- **EVIDENCE:** Portal PR #113 exact HEAD `671f563a4c8e80efdb0b161c66dd26e82126a1e7`: four workflows succeeded (CI, MAXX release gates, Pups CI, Gap Closure CI). Backend PR #49 pre-receipt HEAD `eada955f1cd8ff9eef10ccb3db93e258eef93cf9`: Patch, Linters, Semantic Commits, Documentation Required, static boundary preflight succeeded; Server (Postgres) **skipped**, Server (Mariadb) **queued** at inspection. Independent [synthetic PostgreSQL workflow 44156735096](https://github.com/executiveusa/maxx-migrations-agentic-systems/actions/runs/44156735096) completed **success** at a **different** commit `978e53d438280de8fe579416bd357e10ccd2575f`. That successful workflow cannot be represented as execution of PR #49's exact HEAD or as proof against the actual shared Supabase schema.
- **GRAPH/SPEC/SLICE:** Evidence-only reconciliation in the existing durable packet. The PR #49 probe requires an explicitly labeled loopback disposable PostgreSQL URL and two pre-provisioned, distinct test users/projects. It runs a read-only transaction with authenticated-role/JWT-subject simulation, missing/unassigned-subject negative controls, owner-bypass checks, and rollback; it does **not** verify signed OAuth tokens, write denial, owner approvals, or Instinct delivery.
- **BUILD/VERIFY/GAUNTLET:** No security assertions changed and no PostgreSQL connection was attempted in this slice. GitHub API source and workflow metadata were read at the SHAs above. Exact-HEAD CI for this receipt commit must be rechecked after publication. Independent security review remains pending.
- **RELEASE/LEARN:** **NOT READY**. No SQL on shared `botanic-creations` (`cyxdevcjycmffhmwxojh`), no merges/deployments, and no owner release authorization implied. **Rollback:** revert this documentation-only commit. **Next smallest action:** run the existing two-principal probe against an authorized disposable real-schema clone with pre-provisioned fixtures, record sanitized exit code and exact SHA, then independently review the results before adding write/approval-denial checks.

### 2026-11-18 — disposable probe credential-in-argv guard
- **INTENT/BAR:** Keep the existing PR #49 probe read-only and prevent connection passwords embedded in its URL from appearing in process arguments. No change to tenant policy or production access.
- **LOCK/SLICE/BUILD:** On existing isolated PR #49 branch, source commit `82a3f211ed567a13ce7846a82e7217cf4f89268f` removes optional URI userinfo and updates the regex capture index for the disposable database name. Use local service authentication or `PGPASSFILE`; never place secrets in the command-line URL.
- **VERIFY/EVIDENCE:** Read source from GitHub before editing. Independently executed `bash -n` and six URL-gate examples using the exact new regex in a local isolated shell fixture: accepted localhost `maxx_test` and 127.0.0.1 `maxx_disposable`; rejected password-bearing userinfo, remote hostname, production database, and query-string override. **This is a regex fixture check, not full-script execution or PostgreSQL RLS proof.** Direct raw-GitHub download in the shell failed DNS resolution; the repository write was confirmed by the GitHub connector. Exact-HEAD CI must be rechecked.
- **GAUNTLET/RELEASE:** **NOT READY.** Independent reviewer must confirm no legitimate local disposable connection depends on URI userinfo. Real-schema Alice/Bob isolation, signed identities, approvals, and Instinct remain unverified. No shared Supabase SQL, merge or deployment.
- **ROLLBACK/LEARN:** Revert this packet receipt commit, then revert `82a3f211ed567a13ce7846a82e7217cf4f89268f` if needed. Next: execute the full probe against an authorized disposable real-schema PostgreSQL clone with provisioned identities, sanitized receipt and independent review.
