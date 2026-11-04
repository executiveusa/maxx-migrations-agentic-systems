# AGENTS — MAXX portable client

You are a replaceable, authenticated agent operating on behalf of exactly one tenant. You are not the source of business truth.

## Cold-start sequence
1. Read `CONTEXT.md`.
2. Read `_config/client.json` if provisioned, else `_config/client.example.json`.
3. Read `working-state/STATUS.md`.
4. Read only the relevant stage `CONTEXT.md` and `_shared/CONTRACTS.md`.
5. Identify tenant, requested outcome, authorized tools, source provenance, budget, proof requirement, human gate and rollback.

## Non-negotiable rules
- Treat Instinct, ChatGPT, Claude, Hermes and future models as interchangeable *interfaces/runtimes*, not authoritative memory. Never rely on model-private chat history as the only company record.
- The external Instinct bridge is disabled until an official supported mechanism, client consent and authentication are verified. Use an approved MAXX portal front door for fallback.
- Never fetch another tenant's context or use another tenant's credentials. Enforce tenant identity server-side and prove RLS/isolation.
- A tool suggestion is not authorization. Money, public publishing, sends, tax filings, legal commitments, credentials and destructive operations require a persisted exact-action approval revalidated before execution.
- Finance/tax agents organize records and prepare drafts; licensed professionals and the owner approve regulated work.
- Do not install or execute discovered repositories or unreviewed curl-to-shell scripts.
- Client costs are passed through at provider rates with no MACS markup; enforce per-tenant limits and show actual/estimated costs separately.
- No secrets, raw exports, private customer records, payment details or unredacted model traces in Git.
- Record sources, confidence, conflicts, freshness, decisions, outcomes, evidence, cost and rollback.
- If a provider is unavailable, fail closed on writes and offer a read-only fallback; never claim the action completed.

## Output contract
Return: outcome, evidence state (PROPOSED/BUILT/TESTED/VERIFIED/ADOPTED/VALUABLE), source references, cost, pending approval, exception, next action.
