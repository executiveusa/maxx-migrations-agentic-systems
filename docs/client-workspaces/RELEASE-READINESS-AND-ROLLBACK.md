# Agent MAXX V3 — Full-Stack Wiring and Release Gate
Date: 2026-11-13. **STATUS: DRAFT / NOT LIVE**. Method: uploaded `full-stack-wiring-audit-v2.0.0` skill; facts reconciled with repository code, GitHub CI and read-only botanic-creations schema inspection.

## Product promise → actual ownership → proof
| Promise | UI route / owner | Control path | Durable state | Current evidence | Status |
|---|---|---|---|---|---|
| Google login and individual access | `macs-agent-portal/src/contexts/AuthContext.tsx` | Supabase Auth JWT → Fastify `createAuthenticator` | `auth.users` and `maxx.memberships` | Existing login code; production Google provider not verified | **BLOCKED for Stacy onboarding** |
| Switch seven named clients | `MaxxChat.tsx` / `ClientWorkspaceSwitcher.tsx` | GET `/v1/client-workspaces` → owner-scoped `public.maxx_service_client_workspaces` RPC | `maxx.projects` + `maxx.project_memberships` | UI built in draft PR #113; only one existing Client Zero row, no members | **DRAFT** |
| Client-specific starter prompts | `MaxxChat.tsx` | RPC verified `suggestedTasks`; explicit static non-authoritative fallback | `maxx.project_prompt_templates` | 28 proposed prompt inserts; not in live database | **DRAFT** |
| Separate chat histories | `MaxxChat.tsx` | client-specific `workspaceId` and per-session memory | Browser memory only | Code checks for user change and client switch; no durable histories | **PARTIAL** |
| Work on a client by speech/chat | Portal chat and microphone | `POST /v1/chat` → Fastify → model router; scoped mode is draft-only | Existing MAXX ICM needs independently verified tenant mapping | 150+ control-plane tests; no owner-approved live end-to-end mission | **BLOCKED** |
| Approval alerts | Popover/status dot | RPC joins `maxx.approvals` to `maxx.action_proposals.project_id` | MAXX approvals | Shared MAXX has zero approvals; code has unknown status, no verified production sample | **DRAFT** |
| Instinct agent pings | Existing FastAPI gateway is external | Human-approved notification outbox + scoped bridge needed | No verified single source for delivery receipt | Not integrated; UI explicitly disabled | **NOT BUILT** |
| Client add | `ClientWorkspaceSwitcher` | `POST /v1/client-workspaces` → service-role-only audited RPC | `maxx.projects` plus project membership | Controlled route/stub tests; no DB migration | **DRAFT** |
| Three-step archive and restore | `ClientWorkspaceSwitcher` | `start→acknowledge→type_name→archive` + cancel/restore | `maxx.project_archive_requests` + `maxx.audit_log` | Review-only SQL; blocks active work; >=30-day check; no live restore test | **BLOCKED** |
| Source-backed Bunna revenue proof | MAXX Revenue Capture OS (separate draft PR #42) | Read-only Square payments | MAXX evidence ledger | No Bunna POS connection / paid receipt | **BLOCKED** |
| One interface with optional dashboards | `macs-agent-portal` | Fastify gateway + MAXX ICM federation | Three-repo existing architecture | Chat-first surface exists; protected 390/1440 visual proof pending | **PARTIAL** |

**Canonical state:** Supabase `botanic-creations` PostgreSQL `maxx` schema for projects/memberships/approvals; Supabase Auth for identities; existing MAXX ICM for mission provenance; portal chat browser memory is ephemeral. No SQLite, duplicate CRM, or second control plane.

## High-priority findings
1. **P0 AUTH:** Existing `maxx.projects`, approvals, run_steps and other tables have org-wide RLS, not project isolation. Do not onboard the seven client companies or enable `MAXX_CLIENT_WORKSPACES_ENABLED` until the proposed restrictive RLS has independent two-user testing. New table RLS alone is insufficient. Service-role bypass requires separate server-side JWT-authorized membership checks.
2. **P0 SOURCE:** Shared `botanic-creations` has one MACS org, one `client-zero` internal project, and **0 memberships**. Do not auto-grant ownership by name or email. An authorized account holder must verify the exact Google `auth.users.id` and approve role assignment.
3. **P0 MIGRATION:** This branch contains SQL **candidates**, not applied or versioned migrations. No deploy or release until disposable Postgres dry-run, security/DBA review, backup restoration rehearsal, and rollback.
4. **P0 RUNTIME:** Approval/mission tools behind project workspace remain advisory-only. No verified action-approval-execution proof or external agent delivery. Do not flip execution on to achieve artificial parity.
5. **P1 BUILD:** Portal `npm ci` fails from TS 7 versus typescript-eslint peer mismatch on baseline, not an authenticated-client bug; existing [fix PR #89](https://github.com/executiveusa/macs-agent-portal/pull/89) addresses that, require approved dependency correction.
6. **P1 AUTH CONFIG:** Portal's previous generated Supabase fallback key belonged to another project. Draft PR #113 replaces it with the proper botanic-creations **publishable** key and no service key in browser. Verify production `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are from the same project.
7. **P1 USER FLOW:** Multiple companies must not expose legacy org-wide approvals or persisted data in wrong workspace; project-specific confirmations and proof receipts required.
8. **P1 RUNTIME/UX:** No actual authenticated screenshot of PR #113 at 390px and 1440px; prior prototype screenshots do not verify current app.
9. **P2 STATE:** Browser-only chat transcripts do not persist across sessions; retention and approved canonical conversation store still needed. This is not evidence of full 24/7 durable user memory.

## Exact release checks (all required)
- Isolated disposable PostgreSQL test install of candidate migrations; fail on invalid SQL, lock/deadlock, wrong permissions. No changes to existing production `botanic-creations` until review.
- Two real independent **test** Supabase identities with explicit project memberships. Verify (a) Alice sees project A and not B; (b) Bob inverse; (c) owner/admin access; (d) unauthenticated/machine denied; (e) owner revocation takes immediate effect even with still-valid JWT; (f) no inferred or cached cross-client history; (g) RLS covers parent AND child tables and public `maxx_agent_snapshot`.
- Google sign-in with authorized operator on real hosted URL; verify callback allowlists, JWT subject, no wrong-project credentials, no secrets leaked.
- Create one disposable client by actual authorized user; verify project row, membership and audit record; same slug error; no default access to other operators.
- Archive a disposable client; deny wrong name/transition, active work/pending approval; test cancel, exact 30-day restore, expired restore, unassigned viewer denied, protected workspace never archived.
- Show real project approvals from canonical proposal, including zero/unknown and urgency; verify no cross-client alert.
- Test Instinct FastAPI bridge in sandbox before enabling any outward notification; scoped credentials, idempotency, signed delivery receipt, retry/dead-letter, consent.
- Preview screenshots at 320/390/768/1440: login, dropdown, 7 clients, altered prompts, no alerts, alerts, add, archive, restore; keyboard, voice and no overflow.
- Exact HEAD frontend lint/tests/typecheck/build after dependency resolution, control-plane full suite, GitHub security checks, independent reviewer; preserve user-approved visual direction.
- Never merge PR #113 or deploy production before independent review and owner visual approval.

## Live deployment configuration — not yet provisioned
**Frontend browser (publishable only):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_CONTROL_TOWER_API_URL`. No service_role key ever.
**Control plane server:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STACY_ALLOWED_EMAILS` verified by owner, `MAXX_CLIENT_WORKSPACES_ENABLED=false` until RLS proof, `MAXX_PRODUCTION_MUTATIONS_ENABLED=false` until approved action testing, existing `CONTROL_TOWER_ALLOWED_ORIGINS`. Protect gateway with TLS and credentials.
**External agents:** must use the existing MAXX control plane and its scoped machine route; NO master credentials and NO arbitrary project IDs; current client-specific machine execution is intentionally blocked.

## Rollback plan
1. **Immediate kill switch:** leave/flip `MAXX_CLIENT_WORKSPACES_ENABLED=false` and `MAXX_PRODUCTION_MUTATIONS_ENABLED=false` in the control-plane environment. Do not expose private client data.
2. **Application:** revert the UI/control-plane feature commits (draft PR #113). Preserve existing working general chat and voice, restore prior env keys only after validating the target project (never reintroduce mismatched old key).
3. **Database:** first retain project-granular RLS (dropping it alone could reopen org-wide data leakage). Revoke new service RPC EXECUTE and disable client UI; leave data intact. A later independently reviewed rollback may restore older access policies ONLY with confirmed single-client isolation, otherwise it must adopt default-deny.
4. **Recovery:** restore from an independently validated pre-migration backup to a disposable project before destructive migration rollback; do not auto-delete seven client records or any archived data.
5. **Hard stop:** if project-scope checks fail, disable worker scheduling and tool execution for affected clients and investigate audit logs. Never silently fall back to general org scope.

## One measured release outcome
An authorized operator signs in with Google, selects **BUNNA RESTAURANT**, sees only its verified prompts and approval count, requests a *draft* growth plan, receives a truthful no-data/approval-required response, and switches to **THP FLOORING** without cross-client leakage. Full autonomous task execution and cash-inclusive POS proof are subsequent verified slices—not a claim of this release.

## 2026-11-14 candidate preflight iteration
- PR #43 baseline `2df69d8423ad108603574379320a92b40a81c001`; added fail-closed static boundary test `docs/client-workspaces/verify-candidate-boundaries.mjs` in commits `2eeec838` and `641afaa3`.
- Verified 17/17 equivalent source assertions against the candidate SQL through the GitHub connector: seven named seeds, RLS activation on three new private tables, five critical policy definitions, 30-day recovery interval, and operator-template provenance. These checks **do not** establish valid SQL execution or RLS isolation.
- Local Node execution unavailable: runtime cannot resolve raw.githubusercontent.com; no database checkout or disposable Postgres instance. GitHub CI on the new exact HEAD remains unverified. Run `node docs/client-workspaces/verify-candidate-boundaries.mjs` from a repository checkout, then conduct real two-identity RLS integration tests on a disposable PostgreSQL/Supabase environment.
- No changes to shared botanic-creations, production grants, or deployment. Rollback: revert `641afaa3` and `2eeec838` to remove the static preflight; this does not alter SQL candidates or runtime data.
- Gate status: **NOT READY** until independent SQL review, two-principal deny/allow tests, OAuth, integration and deployment evidence. Next smallest slice: add executable isolated tenant fixtures and negative tests for project-scoped child tables; do not apply candidate SQL to shared database.

## 2026-11-14 negative-control gate (run 9)
- At PR #43 head `b79398cd07c75d495b7cd1783ab0d42d16cba696`, added `docs/client-workspaces/verify-candidate-boundaries.test.mjs` (`d3d9e775`) and wired it into the existing static-preflight workflow (`b79398cd`). This does not create a new control plane.
- Four deliberate negative controls must fail with assertions: missing service RPC grant, broad authenticated RPC grant, missing RPC revoke, and missing membership-table RLS. A clean candidate must pass. Tests use temporary local copies and do not connect to any database.
- Source changes committed; exact-head workflow result was **not yet available** at inspection. Do not mark the new gate passed until the workflow runs successfully at this SHA. Existing backend lint and semantic-commit failures remain unresolved.
- Independent database test still required: install candidate SQL on disposable Supabase/PostgreSQL and prove Alice/Bob isolation on parent, child, approvals, membership revocation, archive and service RPCs. Static negative controls cannot prove runtime RLS.
- Rollback: revert `b79398cd` and `d3d9e775` on the feature branch. No production SQL, grants, client records or deployment were changed.
