# MAXX Migrations Agentic Systems

> **Complexity underneath. Simplicity on top.**
> Canonical ICM business brain, client-governance contracts, portable MAXX Suite client templates, and execution backend for MACS Digital Media.

## Architecture Map (Start Here)

| Need | Canonical File |
|---|---|
| Universal Agent Router (all models) | [AGENTS.md](agents.md) & [CLAUDE.md](CLAUDE.md) |
| ICM Root Map (`01_orient -> 06_learn`) | [CONTEXT.md](CONTEXT.md) |
| Human ↔ Machine Approval Contract | [docs/icm/HUMAN_MACHINE_CONTRACT.md](docs/icm/HUMAN_MACHINE_CONTRACT.md) |
| Rolling Agent Check-In / Check-Out Wiki | [wiki/HANDOFF.md](wiki/HANDOFF.md) |
| MAXX Suite Product Portfolio | [icm/maxx-suite/README.md](icm/maxx-suite/README.md) |
| Portable Model-Agnostic Client Template | [icm/clients/_template/README.md](icm/clients/_template/README.md) |
| Site Transformation Protocol | [icm/site-transformation-protocol/](icm/site-transformation-protocol/) |

## Three-Repository MACS Federation

1. **`executiveusa/macsdigitalmedia`** — Public storefront & COLLINS-style proof-of-work showcase (zero backend secrets).
2. **`executiveusa/macs-agent-portal`** — Agent MAXX operator surface, human approvals, and Hermes/Instinct runtime bridge.
3. **`executiveusa/maxx-migrations-agentic-systems`** *(this repo)* — Canonical ICM, commercial routing, tenant governance, and execution backend.

> **Sovereign Isolation Law:** Bambu's personal **COSMOS** HQ (`cosmos`, `nwkids`, `vibe-engineering`, `VisionClaw`) is strictly isolated from MACS and Kupuri client workspaces. Each company runs its own scoped Instinct + Hermes + Maus Bot environment backed by Postgres `FORCE ROW LEVEL SECURITY`.

## Working With Agents in This Repo

1. Every agent checks in through [AGENTS.md](agents.md) -> [CONTEXT.md](CONTEXT.md) -> [wiki/HANDOFF.md](wiki/HANDOFF.md) (`< 3,000` tokens cold load).
2. All feature work follows **ICM as law**, **Lauren Tan's PStack**, and **Ponytail** minimal-diff discipline.
3. Consequential actions (spending money, external outreach, secret changes, production deploys) require explicit human approval per `docs/icm/HUMAN_MACHINE_CONTRACT.md`.

---

## Upstream Attribution & License

This repository inherits upstream open-source ERPNext / Frappe framework modules (`erpnext/`, `banking/`). All upstream **GNU General Public License v3.0 (GPLv3)** obligations and attributions in [license.txt](license.txt) and [attributions.md](attributions.md) remain preserved. Inherited upstream modules are not claims that the full upstream ERP suite is deployed for every MAXX client.
