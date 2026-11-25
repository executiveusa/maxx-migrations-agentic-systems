# MAXX Migrations Agentic Systems — Universal Agent Router (`AGENTS.md`)

> Readable by **ALL agents** (Hermes, Instinct, Maus Bots, Antigravity, Claude, Codex, Cursor).
> **ICM is law.** Keep cold Check-In under 3,000 tokens. Do not bulk-load this repository.

## 1. Governing Authority & System Boundary
Before any meaningful work, read:
1. [CONTEXT.md](CONTEXT.md) — Universal MAXX OS ICM root map (`01_orient -> 02_plan -> 03_work -> 04_verify -> 05_release -> 06_learn`).
2. `docs/icm/HUMAN_MACHINE_CONTRACT.md` — Human ↔ Machine authority & approval gates.
3. [wiki/HANDOFF.md](wiki/HANDOFF.md) — Rolling Check-In / Check-Out subcontext ledger.

### Federation Boundaries (Strict Tenant Isolation)
- **Public Storefront:** `executiveusa/macsdigitalmedia` (never holds backend secrets or `MAXX_MIGRATIONS_API_KEY`).
- **Owner/Operator Surface:** `executiveusa/macs-agent-portal` (Agent MAXX control plane & approvals).
- **Canonical Business Brain & Execution Backend:** This repository (`executiveusa/maxx-migrations-agentic-systems`).
- **COSMOS Personal HQ (Separate):** Bambu's personal COSMOS (`cosmos`, `nwkids`, `vibe-engineering`, `VisionClaw`) is strictly isolated from MACS and Kupuri tenants. Agents operating inside MACS must **never** read or write COSMOS, NWKids, or Kupuri data.

## 2. Mandatory Coding & Quality Discipline
- **ICM Is Law:** Every new feature, protocol, or client template must obey `CONTEXT.md`'s 6-stage grammar (`01_orient` through `06_learn`) and keep cold context small (`2k–8k` tokens).
- **Feature Engineering:** Use **Lauren Tan's PStack (`pstack-*`)** for structured feature development.
- **Lean Edits & Refactors:** Use **Ponytail (`ponytail-*`)** + `jcodemunch` for minimal diffs and low token spend.
- **Model-Agnostic Execution:** Never hardcode vendor-specific model names; route through the configured LLM router/gateway.
- **Computer-Use Runtime:** Default to self-hosted Maus Bots (tenant-scoped, `draft_and_queue` mode) rather than external SaaS computer-use vendors.

## 3. Hard Safety & Approval Gates
- **GREEN (Autonomous):** Read-only inspection, running tests/linters/typechecks, drafting plans, updating `wiki/HANDOFF.md`.
- **YELLOW (Draft & Queue):** Creating PRs, staging migrations, drafting client deliverables.
- **RED (Explicit Human Approval Required):** Spending money, sending external client outreach, rotating/exposing secrets, destructive DB migrations, or production deploys.

## 4. Check-In / Check-Out Protocol
1. **Check-In:** Read `AGENTS.md` -> `CONTEXT.md` -> `wiki/HANDOFF.md` -> smallest relevant `icm/` stage.
2. **Execute:** Make the smallest verified change; run tests/linters; keep `TESTED` separate from `PRODUCTION VERIFIED`.
3. **Check-Out:** Append a concise 3–5 line entry to `wiki/HANDOFF.md` (files changed, validation run, risks, next action).
