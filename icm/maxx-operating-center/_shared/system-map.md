---
type: factory-reference
status: canonical-map
---

# MAXX system map

## Human surfaces
- Desktop: MAXX Operating Center.
- Mobile v1: Telegram to the same MAXX runtime.
- Web: inspection, onboarding, and safe owner actions.

## Core
- Agent identity/product: MAXX.
- Primary orchestration runtime: Hermes-compatible MAXX Core.
- Durable company context: ICM Company Pack.
- Structured business state: Maxx Migrations / Botanic Creations Supabase.
- Authority: `../../../docs/icm/HUMAN_MACHINE_CONTRACT.md`.

## Execution ladder
Use the least complex reliable method:
API → CLI → MCP → browser DOM → computer GUI → human.

Computer use is the universal fallback, not the default.

## Computer layer
The computer provider must be replaceable. Orgo may be used as an initial provider; MAXX must not depend on Orgo-specific concepts above the provider adapter.

## Data boundary
- ICM: portable, source-aware company truth and working artifacts.
- Supabase: durable structured state, tenant isolation, approvals, mission/evidence records.
- Secret manager/provider: credentials. Secrets never enter ICM.

## Client isolation
Every company has its own tenant scope and Company Pack. Shared infrastructure is permitted; shared unscoped customer data is not.

## Current physical systems to verify
- GitHub: `executiveusa/maxx-migrations-agentic-systems`.
- Product app: `apps/maxx-web`.
- Supabase: Botanic Creations project, with a dedicated MAXX domain/schema to be verified/created.
- Vercel: `maxx-migrations-agentic-systems` project.
- Client Zero: `icm/clients/macs-digital-media/`.
