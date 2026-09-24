# MAXX Suite — execution plan

Prepared 2026-09-08 from the current-state portfolio review. This is the publication-safe implementation plan, not a production completion claim. Detailed private security findings, account identifiers, source archives and runtime evidence remain in the owner's review package; they are not republished here.

## 1. Outcome and authority

Make MACS Digital Media operable by Stacy through one Agent MAXX experience. Preserve working code and existing business context. Do not create another platform merely because several repositories exist.

Priority order:
1. Agent MAXX: authenticated conversation, durable work, Pups, approvals, business memory and evidence.
2. MAXX Migrations / Revenue Capture: shared integrations, governed client work, outcome attribution and Recovery Receipts.
3. MAXX Post: preparation, approval, scheduling, real publication receipts and measured performance.

The owner's instruction to execute this plan authorizes bounded source repairs, focused tests and ordinary implementation branches/PRs within these boundaries. It does not authorize arbitrary purchases, destructive migrations, privilege expansion, provider sends, publication or production cutover. Do not ask the owner to restate the mission. Ask only for the specific missing consequential authorization.

**Permanent protection:** executiveusa/macsdigitalmedia and its public home site are read-only throughout. No source/CMS/configuration/environment/hosting/domain/DNS/deployment changes, modifying PRs, or indirect changes through another repository. Return recommendations for manual application by the team. Architecture/build/release approval does not lift this restriction.

Keep personal and other-client runtimes, identities, credentials, messages, memory, assets and business records separate. Software reuse is not permission to import their state.

## 2. Retained architecture

```text
Stacy types or speaks
    Agent MAXX authenticated interface
    Existing governed control plane
    Persistent mission, tenant, operator, approval and run records
        Hermes/Pups and scoped workers
        Revenue Capture tools and business projections
        MAXX Post adapter and selected Postiz runtime
    Authoritative results, provider receipts and artifact evidence
    Same conversation, Today and Activity after refresh/reconnect
```

- Keep executiveusa/macs-agent-portal as the owner interface.
- Keep executiveusa/maxx-migrations-agentic-systems/apps/maxx-web as the business-domain foundation.
- Keep the existing portal control-plane/Flywheel/Hermes code physically where it lives initially. Establish shared logical authority and typed contracts before considering relocation. Do not build a replacement control plane.
- Use executiveusa/postiz-maxx-clipz as the only initial social scheduler/publisher. Preparation/rendering remains separate from distribution.
- Initial publishing uses approved existing media. If long-video clipping is required, inspect the authorized private clipping repository identified in the owner registry and repair that one specialized worker; do not confuse similarly named public landing pages with implementation.
- Popebot is the Revenue Capture client/tool surface, not a second approval authority. MAXX Operations is an advanced view of the same records.
- Research, scraping, editing and migration tools become narrow capabilities or libraries only when justified. Competing runtimes and casino/crypto candidates stay parked. No archive or deletion without owner approval.

Do not force everything into one repository or database. One owner per durable truth is the rule.

## 3. Canonical contracts

| Data / capability | Required owner and boundary |
| --- | --- |
| Identity and organizations | One authoritative membership map; preserve existing user IDs; server derives tenant; no duplicate owner account to bypass login |
| Missions, native runs, handoffs | Existing control-plane ledger maps tenant/operator/Pup/worker/native runtime IDs and durable checkpoints |
| Approvals | Exact immutable payload/hash, action policy, reviewer role, expiry and one atomic execution claim shared across all command surfaces |
| Provider connections | Tenant/account-scoped connection with scopes, status and secret reference; credentials resolved only in authorized server/worker scope |
| Events | Signed/authenticated ingress, tenant+connection+provider-event uniqueness, durable processing state/outbox and replay reconciliation |
| Business records | ERPNext owns agreed customer/contact/opportunity/invoice records only after actual deployment and authority are validated; application projections use explicit links |
| Evidence and Value Ledger | Service-authenticated append-only evidence; payments/refunds distinct from attribution and estimates; compensating entries preserve history |
| Media | Rights/consent, source identity, immutable versions and checksums; worker artifacts do not imply publication approval |
| Publication | Postiz owns selected social scheduling/provider execution; Max calls one governed adapter, not an alternate publisher |
| Analytics | Actual provider metrics with time window and source; never relabel model scores as observed performance |
| Deployments | Exact tested SHA, runtime/image digest, schema/config fingerprint and existing Flywheel release record |

Do not select a physical database from a historical note or because one connection is available. Compare actual schema/migration lineage, grants/RLS, counts, recent writes, runtime bindings and backups. Preserve conflicting and newer datasets and unrelated tenants.

## 4. Execution slices

Safe source work may proceed while a runtime-access gate blocks live verification. Each slice has one responsible builder, separate verifier/critic, current starting SHA, owned paths, focused tests, rollback and an evidence checkpoint.

### S0 — authority, baseline and restore design

Refresh current branch heads, open PRs, required checks, deployment identity and repository instructions. Read the existing ICM routes and current code. Resolve documentation contradictions before they affect implementation. Inspect all specifically named runtime/database candidates through authorized access; never substitute another resource.

Prepare targeted encrypted backup and isolated-restore procedure. Actual backup/restore consumption requires approved access and cost limits. Define maintenance window, RPO and RTO before any production cutover.

Proof: authority matrix, exact version/config/schema identifiers, backup manifest and isolated restore evidence when authorized. Stop live promotion while authority is unknown; continue independent offline source repairs.

### S1 — fail-closed API and tenant safety

Reuse the application's canonical principal/membership resolver. Inventory every API route; distinguish truly public read routes, signed provider ingress, authenticated user actions and machine-only actions. Apply authorization at the API/action, not only at page middleware. Production must fail closed when authentication/persistence configuration is missing. Demo traffic must not select live provider credentials.

For the initial small slice, inspect apps/maxx-web/middleware.ts, lib/data/mode.ts, lib/data/supabase-client.ts, app/api/contacts/route.ts and the current shared tenant resolver/tests. Harden the smallest coherent route family and demonstrate the contract before extending it. Never execute mutation tests against production data.

Proof: anonymous denial, member/owner permissions, foreign-tenant denial, forged identity rejection, no self-promotion, no client-created VERIFIED evidence, no seed-to-real-provider action. Test real policies in an isolated database before activation; mocks alone cannot certify RLS.

### S2 — one durable MAXX mission and computer

Repair the existing Hermes adapter against the actual pinned upstream contract, including scoped profile authentication. Persist and reconcile native runtime IDs. Enforce one-hop ancestry and capability boundaries in code, not only prompts.

Allocate an isolated task workspace with explicit owner, filesystem/network policy, scoped secret injection, runtime/CPU/RAM/disk/concurrency ceilings, cancellation and artifact export. Reuse the worker/Flywheel architecture. Persistent mission state must survive browser closure, worker restart and later approved VPS recovery testing. A fallback to memory cannot masquerade as durable success.

Proof: real pinned contract test; two-workspace isolation; same mission resume; lease/heartbeat recovery; cancellation and cleanup; source/artifact checksums. Stop and quarantine ambiguous or unattributable work rather than launching duplicates.

### S3 — shared approval and RIME voice

Preserve working approval improvements while unifying the command path. Persist exact action payload and hash. Recheck role, membership, expiry and payload immediately before an atomic execution claim. Rejected/expired/changed actions must never execute. Record effect and receipt; reconcile uncertain completion after crashes.

Voice input and typing must share user, tenant, conversation, mission, approvals and evidence. RIME is the TTS stage. Identify and verify the actual STT provider separately. Preserve actual media MIME/container, handle interruption and microphone errors, and keep text usable when voice fails. Never demonstrate fake speech transcripts.

Proof: concurrent approval, replay, reject/expire/payload-change, crash-after-effect and receipt recovery tests; shared history; mobile recording/MIME; interruption/text fallback; authorized measured latency/cost sample.

### S4 — one real Revenue Capture loop

Implement one provider through the shared connection/event/outbox/evidence path, not separate integration silos. Verify account binding, signature, consent/opt-out and idempotency. Persist contact/opportunity projection and explicit outcome relationships. Extend ERPNext projection only after its actual record authority is established.

Walk: real authorized inquiry -> correct tenant -> durable contact/opportunity -> exact approved follow-up -> outcome -> linked economic evidence if applicable -> Max explanation -> operator/client view -> Recovery Receipt.

A payment is a verified economic fact, not by itself recovered or incremental revenue. Value Ledger must distinguish VERIFIED, ATTRIBUTED, ESTIMATED and UNKNOWN. Never double count retry/refund/payment events.

Proof: provider IDs/receipts, exact approval, durable processing and business links, classified ledger and owner-readable receipt. Invalid signatures, unresolved consent, unknown provider effects or unproven attribution stop the affected action.

### S5 — one real MAXX Post loop

Use existing Postiz rather than a second timer/publisher. Max passes an authorized tenant/account, exact approved content and asset versions, schedule, approval reference and command digest. Distinguish scheduler admission, execution and confirmed publication. Preserve real remote IDs/permalinks and actual analytics.

Validate workflow-start error handling, intended replacement semantics and ambiguous provider acceptance. A missing first heartbeat does not prove no provider effect. Require reviewed database migrations; never run data-loss startup behavior blindly.

Temporal promotion and rollback require persisted-history replay against pinned old/new workers and SDKs in an isolated environment without live effects. Use the version-routing mechanism supported by that release. Stop on nondeterminism, missing history or incompatible state. Preserve compatible workers and reconcile accepted publishes before replay.

Proof: observable admission, immutable approved version, real publish receipt, replacement/heartbeat/crash tests, exact-version history replay and migration/restore proof.

### S6 — justified workers and smaller capabilities

Add the single specialized clipping worker only when needed. Enforce asset/task ownership for every mutation, scoped diagnostics, queue idempotency, durable cancellation, caption requirements and explicit failed/partial states. Completion requires verified expected artifacts, not loop termination. Pin worker/tool dependencies.

Research returns cited facts and uncertainty through governed tools. Migration utilities operate only on an owner-authorized target, with actual redirects/link/render validation and rollback. No unsandboxed model-output execution, private-data scraping or personal-state import.

Proof: two-user ownership tests, rights-cleared fixture renders, artifact metadata/checksums, caption validation, all-failed behavior, crash/resume/cancel and capability boundaries.

### S7 — owner experience and independent design review

Use the approved territory; recommendation is Home Team Fieldbook, with Community in Motion and The Proof Desk as distinct alternatives. Do not silently blend them or add cinematic delays. Extract composition, hierarchy and purposeful pacing from the matching SpyScape experience; do not copy third-party marks, film imagery, text or unlicensed typefaces.

Today must explain what is happening, what needs Stacy, what finished and what he can ask Max. Keep Talk to MAXX obvious. Use Today / Pups / Needs You / Activity / Business Memory unless measured testing improves that structure. Technical internals remain progressively disclosed.

Test 320, 360, 375, 390, 414, 430, 768, 1024 and 1440px; practical 44px-class targets, safe areas, keyboard/composer, one-handed use, sheets, focus restoration, screen readers, reduced motion, loading/empty/error/offline/degraded states and PWA where applicable. Do not install UI dependencies merely because a skill names them.

Proof: viewport screenshots, accessibility checks, actual owner-task usability and independent matched-reference comparison. No invented visual/performance score.

### S8 — commercial and internet-presence preparation

Keep Reset / Momentum / Scale / Launch as existing commercial buckets. Test the historical diagnostic/setup/retainer pricing; do not publish it as a new commitment without approved scope, real delivery costs and buyer evidence. One-person capacity must include support and provider costs.

Prioritize relationships, referrals, useful diagnostics, permissioned proposals and recurring evidence. No spam or fabricated results. Reuse existing accounts, verify ownership/eligibility and maintain recovery records. Human handles required login, CAPTCHA, 2FA, identity, billing and terms. Store secrets only in the approved vault.

Prepare separate approved product surfaces and account profiles. All protected MACS site/DNS changes remain manual team tasks. Do not create every possible directory account. Respect adult/youth data boundaries and media consent.

Proof: approved business facts/offers/assets, owner/recovery registry, verification receipts and a concise Needs You queue. The separately supplied account-setup prompt can guide authorized setup later.

### S9 — release and owner acceptance

Run independent customer-value, strategy, usability, visual, accessibility, architecture, security, performance, production-truth and rollback reviews. Builder cannot approve itself. Fix blocking findings and rerun affected tests; do not endlessly retest unrelated code.

Floors: overall/usability/visual/originality/accessibility >=8.5/10; primary operational task >=9.0; zero critical failures, broken controls, mobile overflow or unverified claims. These are gates, not scores already earned.

Graduation requests:
- MAXX, find the leads we forgot.
- Max, what needs me today?
- Max, what is currently being worked on?
- Max, check our website and tell me what needs attention. (Read-only.)
- Max, help me plan this week's social media.
- Max, what do you remember about MACS?

Proof requires real authorized identity/data, governed delegation, persistent state, correct approvals, receipts, refresh/reconnect, worker recovery, actual deployed SHA and documented rollback. Release only after owner acceptance and authorized production gates.

## 5. Approval, spending and recovery rules

Architectural direction and live-execution envelopes are separate approvals. Numeric limits must specify currency, per-run/day spend, maximum runtime, concurrency, CPU/RAM/disk/network where relevant, allowed provider/channel/actions and maintenance/RPO/RTO. UNKNOWN limits block affected live work; safe source repairs and offline tests can continue. No new paid-service commitment is preauthorized. Existing model/tool/CI/preview usage may still incur charges.

Stop the affected slice on uncertain tenant/authority, expired approval, suspected disclosure, budget breach, destructive schema delta, incompatible workflow history or unresolved critical findings. Record the exact blocker and continue independent work. Never turn timeout into automatic success or resend.

For external side effects, do not promise universal exactly-once execution. Use atomic local claims/outbox, provider idempotency, native IDs and reconciliation. UNKNOWN outcomes remain pending reconciliation. Code rollback cannot unpublish a post or undo a message/payment; authorized compensation must preserve receipts.

Use expand/contract migrations, explicit writer ownership, isolated restore tests and read-only shadow comparison. Avoid uncontrolled dual-write. Preserve all newer/conflicting data. Restoring a shared database wholesale is not a routine rollback.

## 6. Required per-slice checkpoint

Use the established ICM working-state home, not a second truth store. Record:
- outcome, current base/head SHA, affected paths and responsible builder;
- current tenant/runtime/schema/config contract and privacy classification;
- allowed effects and approved resource/cost envelope;
- focused tests and raw evidence locations, with sanitized public summary;
- separate verifier/critic findings and resolution;
- PR/CI/deployed SHA status, without converting build success into runtime proof;
- stop/recovery/rollback procedure and version compatibility;
- remaining Needs You items and the exact next executable step.

Typical artifacts: authority-matrix.json, route-authorization-matrix.json, real-policy-results.json, pinned-runtime-contract-test.json, interruption-resume-proof.json, approval-crash-tests.json, provider-receipts, artifact-attestations, temporal-history-replay-results.json, viewport/accessibility evidence and exact-SHA-release-manifest.json. These names describe required future evidence, not existing proof.

## 7. Cost-efficient method

Use Sonnet for bounded implementation and focused tests. Use a separate capable reviewer for difficult security/architecture/release decisions when available; never pretend a tool can select a model if it cannot. No paid-model change without the owner's configured policy.

Use RTK from https://github.com/rtk-ai/rtk for supported verbose shell output, pinned and verified. No repository-wide init/hook changes to AGENTS/CLAUDE instructions. Disable optional telemetry. Use https://github.com/JuliusBrussee/caveman for concise chat, not ambiguous code or compressed safety warnings. Keep committed docs normal and clear.

Cache source by repository/commit/path and archives by checksum; retain originals for critical verification. Refresh mutable branches, PRs, deployments, approvals and provider state before decisions. Use focused fresh contexts per slice rather than repeatedly loading the full portfolio. RTK metrics are estimated output reduction, not billing savings.

## 8. Reference and publication boundaries

Read root AGENTS.md, CLAUDE.md, the Human–Machine/Federation/ICM contracts, the suite router and relevant product specification. Preserve Interpretable Context Methodology: folders route work; contracts name exact inputs/process/outputs/human checks; stable reference material is separate from run products. Never replace it with a similarly named methodology.

Read MAXX-SUITE-CHARTER.md and SOURCE-REGISTRY.md for original source provenance. The September 8 review package contains deeper portfolio, private infrastructure and security evidence. Do not publish that archive wholesale. If inaccessible, re-read only the code needed for the current slice; record the limitation rather than inventing the missing evidence or repeating the whole discovery.

All historical deployment/database/PR statements must be refreshed. The repository may contain multiple active branches with useful independent work; preserve them. No automatic merge of PR29 or archival recommendations. Read the exact final tree and tests before adopting prior work.

Readiness labels: NOT READY / READY FOR PREVIEW / PREVIEW VERIFIED / PRODUCTION VERIFIED. Provider labels: CODE EXISTS / CONFIGURED / CONNECTED / LIVE TRAFFIC VERIFIED / BLOCKED. Every report distinguishes current proof, historical claims and unknowns.
