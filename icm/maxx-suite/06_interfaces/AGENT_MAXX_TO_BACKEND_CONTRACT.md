# Agent MAXX Portal → MAXX Backend Contract

## Mental model

Agent MAXX goes to the backend like a trusted operator going to the company library and operations desk. The portal is the conversational/voice surface; it is not the library itself.

Personal conversations remain on the Pi lane. Business conversations route to Hermes/Agent MAXX and may call the MAXX backend. The conversation router and this backend contract are complementary; neither should become a second source of business truth.

## Current proved transport

Supabase Edge Function: `maxx-agent-api`

Requirements:
- valid Supabase Auth Bearer JWT;
- publishable/anon project key as required by the Supabase client/Edge Function gateway;
- caller must have an active `maxx.memberships` row for the requested organization;
- **never** place a service-role key in `macs-agent-portal`, browser storage, a client bundle or customer-visible configuration.

The Edge Function validates the caller and forwards ordinary operations through a caller-scoped Supabase client so RLS remains authoritative. Service-role access exists only inside the server function for the final controlled executor.

## Operations

### Read organization state

`GET /functions/v1/maxx-agent-api?organization_id=<uuid>`

Returns only RLS-visible data:
- authenticated user id;
- organization summary;
- organization projects;
- pending approvals.

A missing/inaccessible organization does not become visible through the wrapper.

### Create action proposal

`POST /functions/v1/maxx-agent-api`

Operation: `create_proposal`

Core fields:
- `organization_id`
- optional `project_id`
- `action_key`
- `action_class`
- optional `tool_key`
- `risk_class`
- redacted payload only
- `idempotency_key`
- `requires_approval`

The database computes the action hash. Agents do not get to choose or override the persisted hash. Reusing an idempotency key for a different action is rejected.

### Decide proposal

Operation: `decide_proposal`

Inputs:
- `action_proposal_id`
- `decision`: `approved` or `rejected`
- optional rationale.

The persisted decision is tied to the exact action hash. Conflicting repeated decisions are rejected.

### Controlled execution proof

Operation: `execute_test_action`

This operation exists to prove the governance contract. It is **not** a generic production tool runner.

The server-side executor:
1. locks the proposal;
2. verifies the authenticated actor still has an execution-capable organization role;
3. returns an existing execution idempotently if the proposal already executed;
4. recomputes the action hash from persisted proposal fields;
5. requires that recomputed hash to equal the persisted proposal hash;
6. when approval is required, requires a persisted, approved, unexpired decision with the same hash;
7. writes a unique controlled execution-ledger record;
8. writes evidence, event and audit records.

A real email/social/payment/browser/migration adapter must preserve these semantics before it may replace the controlled test primitive.

## Release proof

Verified with a disposable real Supabase Auth identity through the deployed Edge Function:
- unauthenticated request denied;
- authenticated snapshot succeeded;
- rejected proposal could not execute and produced zero controlled side effects/evidence;
- approved proposal executed once;
- repeating execution returned the same execution id;
- final approved counts were one execution-ledger row, one evidence receipt and one executed event;
- synthetic proof user, membership and proposals were removed after the test.

This proves the MAXX governance boundary, not arbitrary third-party side effects.

## Backend capabilities the portal should ultimately request

- resolve authenticated user + tenant;
- retrieve scoped ICM/company context;
- search authoritative records through adapters;
- list allowed tools/capabilities;
- create plans/action proposals;
- execute safe pre-authorized work;
- request persisted approval for consequential work;
- stream progress/status;
- retrieve evidence receipts, artifacts and rollback instructions;
- submit learning candidates for human/independent approval.

## Security invariants

- No service-role database key in the portal.
- RLS is the tenant data boundary, not client-side filtering.
- Consequential actions require an exact persisted approval revalidated immediately before execution.
- Approval is bound to the persisted action hash.
- Idempotency/execution uniqueness must survive retries.
- Secrets are referenced through an approved secret manager; raw provider credentials are not ordinary MAXX rows.
- Edge/API wrappers must not make `maxx_private` client-accessible.

## Interface direction

Chat/voice first. Persistent screens exist only for information that benefits from visual state: progress, approvals, evidence, assets, schedules and history.

## Next integration slice

Wire `executiveusa/macs-agent-portal` business/Hermes lane to this API using its signed-in Supabase session. Keep the portal as the interaction surface and its existing client SDK/adapters as consolidation material; do not recreate a second durable backend there.
