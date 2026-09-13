# Sonnet execution handoff — MAXX Suite

## Your job

You are the implementation lead for Stacy's existing MAXX suite. Execute the owner's approved source-level scope using [EXECUTION-PLAN.md](EXECUTION-PLAN.md). Do not start another portfolio discovery, write another generic roadmap, or build another platform. This handoff is not evidence that implementation or production verification has happened.

When the owner launches you with an instruction to execute this plan, proceed through bounded source repairs, tests and PRs. Continue through routine/nonblocking details. Separate live-execution, spending, provider-publication and production-cutover gates still apply. This document does not grant itself authority to make those consequential changes.

## Locate the plan correctly

Repository: executiveusa/maxx-migrations-agentic-systems.

Reference branch at publication: docs/astra-reference-20260908, documentation PR #31. The plan may not be on develop until that PR is merged. Read the reference documents from that branch; then create application repair branches from the refreshed appropriate application base, not blindly from a historical docs or revenue branch.

Read in this order:
1. Root AGENTS.md and current authority contracts: docs/icm/HUMAN_MACHINE_CONTRACT.md, FEDERATION_CONTRACT.md, ICM_CORE.md; CLAUDE.md where compatible.
2. docs/astra/EXECUTION-PLAN.md — governing scope, sequence and acceptance.
3. docs/astra/MAXX-SUITE-CHARTER.md — business intent and protected assets.
4. icm/maxx-suite/00_router/CONTEXT.md, current registry/status and the relevant product context/specification.
5. Actual code and tests for the selected slice. Load only relevant original skills from SOURCE-REGISTRY.md when available.

Do not replace current contracts with older branch versions. ICM means Interpretable Context Methodology.

## Non-negotiable boundaries

- executiveusa/macsdigitalmedia and the existing MACS public home site remain read-only, including source, CMS, configuration, environment, hosting, DNS, domain, deployments and indirect modifications. Review recommendations only. No approval of this build lifts that restriction.
- Keep Agent MAXX as one owner experience; existing controlplane/Flywheel/Hermes as governed execution; MAXX Migrations as business-domain authority; selected Postiz as one initial publisher.
- Do not mix personal or other-client runtime state, identities, tokens, memory or assets with Stacy's business.
- No guessed database selection, destructive migration, RLS disabling, duplicate owner account, service-role credential in a browser, unapproved provider traffic or invented metrics.
- No automated real-money gaming launch, spam, private-data scraping or copyrighted asset copying.
- Never mark success from file presence, compile, CI or deploy alone. Preserve UNKNOWN outcomes and reconcile them.

## Start here: first bounded implementation slice

Start S0/S1 without repeating the whole audit:

1. Fetch current branches/PRs and record starting SHAs in the existing ICM state location. Inspect current test commands, required checks and deployment triggers. Do not merge PR29 or PR31 automatically. Prior docs PR lint cause was unresolved; recheck current status and logs if accessible.
2. Read apps/maxx-web/middleware.ts, lib/data/mode.ts, lib/data/supabase-client.ts, app/api/contacts/route.ts, existing authentication/organization resolver and relevant tests. Check for intervening fixes before editing.
3. On a dedicated source repair branch, implement the smallest coherent fail-closed API/tenant slice using existing patterns. Production missing authentication must not silently enter a provider-enabled demo mode. Validate identity and tenant at the action boundary. Do not redesign unrelated UI or refactor the whole app.
4. Add focused tests for anonymous access, correct role/tenant, foreign tenant, forged identity, missing production configuration and demo/live-provider separation. Use isolated fixtures; never point tests at live databases or send messages.
5. Run relevant tests/typecheck/build as the repository supports. Use a fresh-context verifier to check the diff and acceptance. If real-policy tests are inaccessible, record that limit; mocks do not certify RLS.
6. Commit/push through available authenticated tools; open a small PR. Return actual SHA, changed paths, test results, proof limits, rollback and the next step. A preview may be created by existing integration; do not call it production approval.
7. Continue independent safe source work from the plan. If access blocks a live check, put the exact owner action in Needs You and work on other authorized offline/source slices.

Initial role allocation: Sonnet builds/tests. A separate verifier/critic reviews; use a stronger model for high-risk security/architecture decisions if the owner has configured it. Never claim to have switched a subagent model without an actual supported setting. The builder must not approve its own release.

## Build order after that slice

- S2: existing Hermes contract, persistent native runs, isolated workspace boundaries, enforced handoffs and recovery.
- S3: shared exact-action approval/atomic claim/reconciliation, RIME TTS integrated with the same chat and actual STT.
- S4: one signed tenant-resolved provider event through the complete authorized Revenue Capture loop and Recovery Receipt.
- S5: one Postiz scheduling/publishing loop with provider evidence, migration safety and pinned Temporal history replay.
- S6: optional specialized clipping and narrow research/migration capabilities only when needed.
- S7/S8: approved owner design/mobile experience and commercial/profile preparation, without touching the protected site.
- S9: independent gauntlet, exact deployed SHA, real owner walk tests, rollback and owner release acceptance.

Use the detailed acceptance gates in EXECUTION-PLAN.md; this abbreviated order does not remove them. Do not turn optional workers into dependencies of the first useful owner/revenue/publishing proof.

## Execution and spending gates

Live provider jobs need a separately approved envelope: tenant/provider/channel, allowed effects, concurrency, resource/network limits, maximum runtime and numeric per-run/day spend. UNKNOWN caps block affected live consumption, not source fixes. Production promotion additionally requires actual authority mapping, targeted backup/restore proof, maintenance window and RPO/RTO.

After uncertain provider acceptance, do not resend blindly. Atomic local claims cannot guarantee universal exactly-once external effects; use provider idempotency and receipt reconciliation. Reject/expiry/payload changes must prevent execution. Keep prior compatible worker versions and persisted workflow histories for safe rollback.

Ask only when an answer changes security, ownership, spending, irreversible data changes, commercial commitments or release authority. Do not ask whether to read a file, run an isolated test or fix a scoped reversible defect already authorized.

## Token and context discipline

Use RTK for supported verbose shell commands if available; inspect/pin the correct rtk-ai implementation before any permitted local installation. Avoid rtk init or global hooks that alter repository instructions. Disable optional telemetry. Use Caveman-style concise chat without dropping technical detail, uncertainty or negative constraints. Keep code, commits, docs and exact errors intact.

Cache immutable source by SHA/path. Reuse prior source evidence, but refresh mutable refs, approvals and deployed state. Start each independent builder with only its owned paths and contracts; avoid duplicating this whole handoff for every task. Keep full sensitive logs in the approved private evidence store, not public PRs.

## Durable checkpoint and stopping rule

Update the established ICM working state after each meaningful slice with:
- current outcome, base/head SHA, owned paths and next action;
- actual tests/receipts versus not-run or blocked verification;
- PR and deployment identity, if any;
- verifier findings and repairs;
- cost/resource envelope, rollback and interruption recovery;
- one consolidated Needs You queue.

Continue until the authorized scope and evidence gates clear or only genuine owner/access gates remain. Do not stop after another plan. Do not run indefinitely without progress. Repeated failures require diagnosis or a different supported approach, not endless retries.

Final response for each completed slice: what changed; PR/SHA; proof; remaining blockers; next action. Final product readiness remains NOT READY until its actual primary workflow is verified. No invented success.
