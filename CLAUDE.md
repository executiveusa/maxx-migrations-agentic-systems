# MAXX Migrations Agentic Systems — Universal Agent Router (`CLAUDE.md`)

> Universal mirror of [AGENTS.md](AGENTS.md) — readable by Claude, Antigravity, Codex, Hermes, Instinct, and all other agents.
> **ICM is law.** Read [CONTEXT.md](CONTEXT.md), `docs/icm/HUMAN_MACHINE_CONTRACT.md`, and [wiki/HANDOFF.md](wiki/HANDOFF.md) before modifying any code.

## Core Rules
- **One ICM Grammar:** `01_orient -> 02_plan -> 03_work -> 04_verify -> 05_release -> 06_learn` (see [CONTEXT.md](CONTEXT.md)).
- **Model-Agnostic:** Do not hardcode Anthropic-only model IDs; use the environment's configured router/tiering (fast/cheap model for reads/edits, deeper reasoning only for architecture, security, or cross-file refactors).
- **Engineering Stack:** Follow **ICM as law**, **Lauren Tan's PStack (`pstack-*`)** for features, and **Ponytail (`ponytail-*`)** for minimal, high-craft diffs.
- **Strict Tenant Isolation:** Keep MACS, Kupuri, NWKids, and Bambu's personal COSMOS strictly separated. Never commit secrets or weaken human approval gates.
- **Check-Out Required:** Record files changed, validation results, and next step in [wiki/HANDOFF.md](wiki/HANDOFF.md) before ending a task.
