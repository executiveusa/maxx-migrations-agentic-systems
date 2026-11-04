# MACS Client Zero pilot — PRD v1.0
Status: owner scope confirmed 2026-11-04; implementation and live acceptance pending. Project ID: `executiveusa/maxx-migrations-agentic-systems:macs-client-zero`. Classification: USE, eventual MERGE into MAXX. Canonical authority: `docs/icm/FEDERATION_CONTRACT.md` and `ops/DECISIONS.md`.

## Outcome and users
Prove that a MACS business intake becomes an owner-controlled, portable, tenant-isolated ICM record, with a benign CRM note proposed by software and executed only after an independent human decision. Primary users: MACS owner, designated action reviewer (Stacy, authenticated account mapping pending), intake participant and independent release reviewer. Value: reusable Vibe Audit-to-MAXX delivery proof, not unverified revenue.

## Complete pilot journeys
**J1 Intake:** A visitor completes a bounded, accessible intake with consent and field validation. Server validates size, schema and abuse limits, resolves the correct tenant, atomically persists submission + proposal + evidence and returns an opaque receipt. A retry must not create duplicate effects. Errors disclose no internals or cross-tenant data.
**J2 Normalize and isolate:** Tenant-scoped ICM, ontology, open questions and provenance persist; tenant A cannot read or modify tenant B, including receipt, proposal, evidence and export paths. Authorized operators can cold-start the portable context; no secrets in exports.
**J3 Review:** Authenticated reviewer sees the exact proposed note, source context and immutable payload digest. Rejection creates zero notes. Approval binds to the reviewed digest, checks current permissions and executes one benign note exactly once. Author cannot approve their own proposal; revoked reviewer cannot execute; replay and concurrency yield one effect and durable evidence.
**J4 Evidence and export:** Authorized reviewer can inspect receipt, proposal state, note count and append-only evidence; authorized export includes tenant-scoped context and excludes secrets/receipt tokens. Export integrity is checkable. Rollback rehearsal preserves an off-system evidence copy and unrelated tenant records.
**J5 Operate and recover:** Staging smoke, error and empty states, audit logs without secrets, monitoring, safe pause, restart and recovery. Preserve existing MAXX portal as fallback. Instinct remains unconnected until its authenticated interface is independently verified.

## UX
Reuse the existing MACS storefront intake and `/app/client-zero` console; do not add a fourth control plane. Mobile widths 320/390/430 and desktop; keyboard-only operation; WCAG 2.2 AA target; clear pending, approved, rejected, duplicate, timeout and unavailable states. Never label guided MAXX diffusion examples as operational AI.

## Technical architecture
Existing Next.js `apps/maxx-web`, Supabase auth/Postgres/RLS, `maxx_icm_*` tables, `maxx_intake_submissions`, `maxx_action_proposals`, `maxx_client_notes`, `maxx_evidence_ledger` and `maxx_review_action_proposal` RPC. Keep canonical ownership in this repo; public site and operator portal remain their current repositories. Staging must use a MACS-owned isolated Supabase project and a real Next.js Vercel configuration. No new paid queues, databases, LLMs or providers.

## Functional requirements and acceptance
- **FR01 Intake security:** bounded validated body, consent, rate limit and no raw database errors. Test malformed, oversized, burst, duplicate and injection-like inputs.
- **FR02 Atomic durability:** submission, proposal and ledger commit together or roll back together; retry idempotent. Test injected failures and concurrent retries.
- **FR03 Tenant isolation:** auth/RLS and server-side tenant scoping across every read/write/export. Test two distinct tenants and member/nonmember, including guessed receipt.
- **FR04 Exact-action approval:** reviewer role, separation of duties, immutable action digest, authorization recheck, rejection=0 effects. Test stale payload, revoked role, self-approval and reject.
- **FR05 Exactly once:** concurrent approvals and replay create exactly one note and one canonical execution receipt. Test parallel requests and restart.
- **FR06 Evidence and portability:** complete tenant-scoped audit trail and export without tokens/secrets, checksum and independent import/read test.
- **FR07 UX and recovery:** working mobile/desktop, accessible flows, safe failures, pause/rollback and no regressions in existing CRM/portal.
- **FR08 Integration and autonomy:** preserve MAXX portal fallback; Instinct integration and ten-minute scheduled loop require real authenticated transport, durable checkpoint, timed run, restart, duplicate suppression and independent review before any ACTIVE claim.

## Nonfunctional and operations
No real customer PII before privacy and security sign-off. No service-role client exposed to browser; avoid service-role bypass for user-authorized actions. Secure secrets in owner-controlled environment only. Default deny, no external sends, no live paid inference. Incremental recurring/inference spend $0. Protect against rate-limit bypass, tenant enumeration, cross-tenant export, replay, CSRF where applicable, log leakage and partial writes. Add regression tests and CI. Monitor errors, throughput and evidence integrity. Record exact tested SHA, environment and timestamp.

## Release and Definition of Done
See `ops/ACCEPTANCE_MATRIX.md`. All FR01–FR08 applicable acceptance rows PASS with reproducible evidence; staging directly exercised; independent reviewer signs; two-tenant security and rollback rehearsed; costs within authorization; owner separately approves production release; exact deployed SHA and live end-to-end result verified after release. Until then state is BLOCKED or WORKING, never COMPLETED.

## Authority and non-goals
Authorized: read/inspect, isolated branches, synthetic fixtures, tests, draft PRs and reversible no-cost staging preparation. Protected: spending, secrets/accounts/permissions, production changes, destructive migrations, external sends, public claims and contracts. Excluded: voice, booking, payments, autonomous client outreach, live Mercury and unverified Instinct/Paperclip/Hermes connections. The owner retains code, domains, credentials, hosting and data.
