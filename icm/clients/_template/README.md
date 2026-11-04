# MAXX SUITE — portable client workspace v1

**Status: TEMPLATE ONLY.** This is a non-secret, model-independent ICM workspace and provisioning contract. It is **not** a deployed Paperclip/Hermes/Instinct integration and does not contain real customer data.

## What a founder gets
One conversational front door, one private company brain, one approved outcome at a time. The client signs up for Instinct independently if desired. MAXX does not fork, impersonate, provision, or claim an Instinct API. If a supported bridge is unavailable, the existing authenticated MAXX portal can serve as a fallback front door.

## Where the actual software lives
- **Authority:** MAXX Migrations backend (ICM, tenant data, approvals, execution ledger, evidence).
- **Human surface:** Instinct when authorized, otherwise MAXX portal. Neither is the business source of truth.
- **Coordinator:** Hermes; Paperclip schedules specialist agents using its existing Hermes adapters.
- **Capabilities:** MAXX product adapters first; per-tenant Composio MCP second; isolated browser/computer worker last.
- **Knowledge:** client-owned Postgres business records, provenance-linked files, and an Obsidian-compatible Markdown projection. LLM wiki and OpenViking are optional projections/indexes, never a second authority.
- **Server:** customer-controlled VPS with backups and secret manager. A sandbox and production installation are separate release gates.

## Start
From the canonical repository root, using Node.js 22+:

```sh
node ops/client-template/validate.mjs
node ops/client-template/scaffold.mjs --slug example-founder --name "Example Founder" --out ./tmp/example-founder
node ops/client-template/validate.mjs ./tmp/example-founder
```

The scaffold is **local-only**: it creates an isolated directory and does not install software, contact a provider, charge money, access credentials, create a GitHub repository, or deploy a VPS. Put the generated workspace in a **private client-controlled repository** after human review. Do not commit real client data, raw LLM exports, OAuth tokens, or secrets.

## Cold start
1. Read `AGENTS.md`, then `CONTEXT.md`, then the relevant stage only.
2. Check `_config/client.json` (or the example before provisioning) and `working-state/STATUS.md`.
3. Read `GRAPH.md` or `graph.json` for routing; read `_shared/CONTRACTS.md` for runtime boundaries.
4. Follow the canonical six-stage ICM grammar. Client-specific intake uses `01_intake` through `06_transform` as an onboarding protocol, not a competing control plane.
5. Require real API, isolation, approval, cost, backup and restore proof before claiming the client is live.

## Definition of a first paid win
One authorized founder request → verified context → draft-only useful output → owner acceptance → time/cost evidence. Then one approved external action with an exact action hash and idempotency proof. Expand only after that.

## Related canonical sources
- `docs/icm/HUMAN_MACHINE_CONTRACT.md`
- `docs/icm/FEDERATION_CONTRACT.md`
- `docs/MACS_BUSINESS_INTAKE_SOP.md`
- `icm/growth-engine/SKILL.md`
- `icm/maxx-suite/REPO_REGISTRY.yaml`
- `icm/maxx-suite/01_core/CORE_CONSOLIDATION_PLAN.md`

The customer owns its private data and workspace; MACS product code remains separately maintained and is accessed under an explicit service/license contract. Verify GPL and third-party license obligations before distributing bundled code.
