# Crown & Core Paperclip implementation — controlled first slice

## Authority
Paperclip manages work assignments, specialist heartbeats and run evidence only. MAXX is the sole source for offer definitions, tenant membership, immutable draft records, independent reviews and business approvals. The existing MACS operator portal is the owner-facing gateway. Legacy StarNet is reference-only until data/context parity is demonstrated. No deletion, migration or production writes.

## Actual implementation in this branch
- apps/maxx-web/lib/offers/crown-core.mjs: deterministic, unpriced, internal-only Vibe Audit and proposal content. No network fetch, fake site measurement or clinical claim.
- apps/maxx-web/supabase/migrations/20261104000000_maxx_offer_drafts.sql: additive tenant-isolated, JWT-authenticated, RLS-readable internal draft and independent-review RPCs. Transactional creation, idempotency, per-actor rate limit, action-free event ledger; no grant for external action execution.
- apps/maxx-web/tests/node/crown-core-offer.test.mjs: dependency-free Node tests. Run with node --test apps/maxx-web/tests/node/crown-core-offer.test.mjs .
- Next.js application routes and MCP tool registration (see corresponding code paths if committed) must be checked by CI with full dependency installation before any deploy.

## Release / approval blockers
- No verified signed Crown & Core agreement, patient-data consent, clinical and creative rights approval.
- No live authenticated MACS-owned staging Supabase project or migration execution receipt.
- No proven Paperclip company/project, Instinct adapter, three timed authenticated model runs, checkpoint/restart proof.
- No release approval; new 4-stage offer is NOT the old $17,500 contract. Do not edit it silently.
- Crown growth repo preview suppression and missing five CI source files unresolved. Do not push code there until deployment gate independently verified.

## Paperclip target
One existing MACS company, one Crown & Core project. Instinct is single accountable manager; researchers, offer writer, engineer and independent security reviewer are event-driven assignees. A single 600-second Instinct heartbeat is a target, NOT evidence of activation. Existing GitHub 10m read-only watcher and hourly ChatGPT controller remain; no duplicate scheduler.

## Next proof
1. Verify that the code is installed in an isolated branch, not production.
2. Run Node tests, Next typecheck/build, audit SQL migration in approved MACS staging and test two real JWT identities from distinct tenants.
3. Verify authenticated Paperclip / MAXX MCP discovery and a true audit->review->proposal result with immutable hashes.
4. Record exact code and deployment SHA, audit receipt, ledger rows, rejection=0 effects, reviewer identity and rollback.
5. Obtain independent reviewer acceptance, owner pricing/contract approvals, then evaluate release separately.
