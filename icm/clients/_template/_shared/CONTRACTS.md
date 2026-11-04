# MAXX client interface, authority and failover contracts

## Provider-neutral intent envelope (proposed; not a live endpoint)
```json
{"schema_version":1,"tenant_id":"<server-resolved-tenant>","actor_id":"<verified-actor>","channel":"instinct|portal|other","request_id":"<uuid>","intent":"Summarize new leads","scopes":["context:read"],"dry_run":true}
```
The gateway MUST derive tenant/actor from verified credentials; never trust caller-supplied tenant_id as authority. Use short-lived credentials, signed requests, replay protection, rate limits, idempotency, audit and revocation. External Instinct bridging is DISABLED until supported authorization is documented. No screen-scraping Instinct credentials or pretending to be its API.

## Replaceable adapters
- Front door: Instinct (third-party account) → **supported, consented bridge only**; fallback is authenticated MAXX portal. No model owns client data.
- Coordinator: Hermes reads AGENTS/CONTEXT/graph and asks backend for scoped context. A different agent may use the same versioned gateway contract.
- Scheduler: Paperclip's existing `hermes_gateway` or `hermes_local` adapter, once deployed and smoke-tested. Paperclip owns run scheduling/status; it does not own canonical business facts.
- Tools: existing MAXX capabilities via authenticated backend. Composio MCP may provide client-authorized apps with separate per-tenant OAuth and least-privilege scopes. Never use a single shared client identity.
- Computer use: prefer API/MCP. Foundry/OpenSandbox is candidate only after isolation proof; never enable Foundry mock/bash as production sandbox. Orgo is optional metered fallback.
- Model router: select by capability, latency, observed quality and cost; allow provider fallback without changing client ICM or action policies. Store only provider-agnostic request/evidence metadata.

## Specialist team (bounded, not blanket permissions)
Hermes coordinates: Research, Sales/Lead Follow-up, Social/Distribution, Copy, Design (PARE), Video/UGC, Web/Automation, Customer Support, Finance/Tax Preparation, Operations and Compliance Review. Specialists have narrow skills, tools, source permissions, budgets and acceptance tests. Tax filings, accounting attestations, regulated advice, spend and public claims remain human/professional gates.

## Governed action state
`intent → context read → plan → tool proposal → risk classification → exact payload hash → persisted approval (if required) → revalidate actor/tenant/hash/expiry → idempotent execution → evidence receipt → cost receipt → review`.

Approval for a plan does not approve mutated actions. On rejection, no external side effect. On uncertain authorization, fail closed. Inference can be revised; approved records cannot be silently overwritten.

## Failure states
- Instinct down: use authenticated portal; preserve request ID and audit.
- Model down: try a pre-approved alternate provider under the same scopes/budget; do not retry consequential actions without idempotency.
- Paperclip/Hermes down: queue or return blocked, never `launched` without a real run ID.
- Composio disconnected: prepare a draft and request a per-client connection; do not reuse another client's connection.
- DB or approval ledger unavailable: read-only/blocked; no external writes.
- Sandbox unavailable: disable computer-use job; never fall back to unsandboxed shell.

## Existing contracts to reuse, not fork
Canonical `docs/icm/HUMAN_MACHINE_CONTRACT.md`, `docs/icm/FEDERATION_CONTRACT.md`, `icm/maxx-suite/06_interfaces/AGENT_MAXX_TO_BACKEND_CONTRACT.md`. The existing `maxx-agent-api` controlled test executor is **not** an approved general external action runner.
