# Agent Workflow Configuration

This repository contains the MAXX Migrations product and the private ICM execution system behind MACS Digital Media. The active deployable app is `apps/maxx-web`. The root ERPNext/Frappe and `banking/` trees are retained legacy, not the current product.

## Start here

1. Read `AGENTS.md` for the current repository map and safety boundaries.
2. Use `icm/federation/CONTEXT.md` to route cross-repository work.
3. For product decisions, start at `icm/maxx-suite/00_router/CONTEXT.md`.
4. For site migrations, start at `icm/site-transformation-protocol/00_router/CONTEXT.md`.
5. For offers and growth work, start at `icm/growth-engine/SKILL.md`.
6. Inspect the current code and tests before changing anything.

## Active application

- App: `apps/maxx-web`
- Framework: Next.js 16, React 19, TypeScript
- Data/auth: Supabase with an explicit seed-mode fallback
- Package manager: npm
- Local development: `npm run dev` from the repository root
- Production build: `npm run build`
- Full verification: `npm run verify`
- Vercel Root Directory: `apps/maxx-web`

## Main surfaces

- Public product and migration audit: `/`, `/migration-audit`, `/pricing`, `/work`
- Client workspace: `/app`
- Health: `/api/health`
- Governed machine interfaces: `apps/maxx-web/cli/` and `apps/maxx-web/mcp/`
- Runtime and release checks: `apps/maxx-web/scripts/harness/`

## Legacy boundary

Do not use the root ERPNext metadata, the `banking/` Vite app, or legacy Frappe instructions to infer how MAXX is built or deployed. They remain only for history and compatibility review. New product work belongs in `apps/maxx-web`, `docs/`, or `icm/` unless a specific migration plan says otherwise.

## Quality and handoff

- Reuse existing code and contracts before adding new ones.
- Keep tenant resolution fail-closed and secrets out of source control.
- Run the smallest relevant tests while developing, then `npm run verify` before a release claim.
- Distinguish a local test pass from a deployed production check.
- In handoffs, name the changed files, exact revision, tests run, deployment target, and any known blocker.
