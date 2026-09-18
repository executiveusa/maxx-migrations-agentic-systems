# MAXX Migrations - Agentic Systems

**Sovereign AI migrations for mission-driven teams.** This is the MACS Digital Media migration suite: the Maxx Migrations web product plus the private ICM (Interpretable Context Methodology) and agentic execution brain behind MACS Digital Media.

This repository started life as a fork of ERPNext, and the old README described only that fork. That is why the repo looked like an ERP project. The active product is described below; the ERPNext code is retained legacy (see the last section).

## The three-repo MACS system

Per `icm/maxx-suite/README.md`:

| Repo | Job |
| --- | --- |
| `executiveusa/macsdigitalmedia` | Public MACS Digital Media storefront |
| `executiveusa/maxx-migrations-agentic-systems` (this repo) | Canonical data, ICM, workflow, approval, evidence, migration and agentic backend |
| `executiveusa/macs-agent-portal` | Agent MAXX customer/operator interface; calls this repo's backend as a control API |

## What is real now

### `apps/maxx-web` - the Maxx Migrations web app

Next.js 16 + Supabase, deployed on Vercel as a monorepo with root directory `apps/maxx-web` (see `docs/deployment/VERCEL_MONOREPO_FIX.md`).

Public marketing surface:

- `/`, `/how-it-works`, `/pricing`, `/work`, `/privacy`, `/terms`
- `/features` with sub-pages: website-migration, ghl-import, missed-call-text-back, social-planner, workflows, community, courses

Migration audit intake:

- `/migration-audit` posts to `POST /api/migrations/extract` (lead capture). Approved audits become real migration jobs through `POST /api/migrations/jobs`.

Client workspace (MVP, under `/app`):

- contacts, pipeline, migrations, inbox, projects, revenue, workflows, agents, command-center, community, forms, import, missed-calls, social-planner, settings

API surface (under `/api`):

- agents, contacts, pipeline, migrations (extract, jobs), workflows, forms, community (posts, comments, dm), courses, social (posts, publish, schedule), missed-call text-back and Twilio (sms, voice, status), flywheel (launch, status, stop), health

Agent interfaces:

- CLI: `npm run maxx:cli` (`cli/maxx-migrations.mjs`)
- MCP server: `npm run maxx:mcp` (`mcp/maxx-migrations-server.mjs`)

Verification:

- `npm run verify:full` = lint + typecheck + unit tests + production build + 12 harness checks (preflight, no-stubs, route audit, link check, API CRUD, copy audit, env audit, artifact audit, browser verify, client-zero proof, federation contract). CI enforces a production dependency audit and a client quality gate.

Backend:

- Supabase schema, auth, CRUD, agent chat and voice landed in July 2026 (PR #8). An authenticated, JWT-protected Agent MAXX backend with fail-closed tenant isolation and approval proofs landed across August-September 2026.
- When auth is not configured the app runs in seed mode against an in-memory store, the workspace shows a visible sample-data demo banner, and API responses say which mode served the request.

### `icm/` - the ICM workflow library

ICM (Interpretable Context Methodology): the folder structure is the routing architecture; stage contracts name exact inputs, process, outputs, and human checks; plain-text artifacts carry inspectable state.

- `icm/site-transformation-protocol/` - the canonical website migration workflow: TRUTH, POSITION, ARCHITECT, PROVE, DESIGN, BUILD, GAUNTLET, LEARN. Design is phase 5, not phase 1. Agents must pass its `WALK_TEST.md` before executing a transformation.
- `icm/clients/macs-digital-media/` - Client Zero, the first client instance of the protocol.
- `icm/growth-engine/` - the four-bucket commercial system: Reset, Momentum, Scale, Launch, plus experiment records judged by observed evidence.
- `icm/maxx-suite/` - the MAXX portfolio router: which repo owns which job, what is core vs experimental, and the product-pipeline gate for new ideas.
- `icm/federation/` - cross-repo contracts and the federation walk test (status is PASS only with current evidence).

### Supporting folders

- `docs/` - operating docs: business intake SOP, Revenue Capture OS, deployment (Vercel monorepo, Flywheel VPS), QA, design, harness, client-zero rollback, final polish audit
- `agencies/` - six agency workspaces: macs-digital, afromations, cheggie-media, kupuri-media, myweblane, pauli-effect
- `skills/` - agent skill packs, loaded per task type
- `beads/` - the BEADS protocol and checkpoints
- `ops/` - Flywheel VPS setup and reports
- `AGENTS.md`, `CLAUDE.md`, `agents.md` - the agent authority and workflow contracts for this repo

## Honest status

Real and verified against the tree (September 2026):

- Everything above exists and builds; recent history is active (Next 16 security upgrade, authenticated Agent MAXX backend, ICM federation, restaurant workflow harness).
- The product positioning in the live hero copy: "Sovereign AI migrations for mission-driven teams. One-time install. Owned code. Owned data. Optional AI partnership."

Stated plainly, not done yet:

- The audit-intake endpoint (`/api/migrations/extract`) stores submissions in a process-lifetime store; its own contract notes Supabase write-through still has to be wired before the form is used for paid traffic.
- The client workspace is an MVP: without configured auth it serves seeded sample data, labeled as such in the UI.
- Voice is the preferred long-term command surface; current voice support is partial.
- The federation walk test governs what the three-repo system may claim; documentation or build presence alone is not motion.

## Legacy: the ERPNext fork

The repository root still contains the upstream ERPNext fork (`erpnext/`, `banking/`, `app.py`, `pyproject.toml`, and the original CI/config files). That code is retained history, not the active product, and the Vercel deployment builds only `apps/maxx-web`. Upstream ERPNext code remains under its original license (`license.txt`).

## Working in this repo

Agents cold-start from `AGENTS.md`: read the ICM contracts, inspect the actual current state before changing anything, reuse before adding, make one verifiable slice at a time, and never claim production success without production evidence. Secrets are never committed; consequential writes require explicit approval.
