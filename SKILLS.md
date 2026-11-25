# Skills and routing index

The active product is `apps/maxx-web`; the repository-root ERPNext/Frappe tree and `banking/` frontend are legacy.

## Route work by outcome

| Work | Start here |
| --- | --- |
| Repository orientation and rules | `AGENTS.md` |
| Cross-repository MAXX routing | `icm/federation/CONTEXT.md` |
| Product or portfolio decision | `icm/maxx-suite/00_router/CONTEXT.md` |
| Website audit, rebuild, or migration | `icm/site-transformation-protocol/00_router/CONTEXT.md` |
| Revenue, offers, positioning, or growth | `icm/growth-engine/SKILL.md` |
| Specialized implementation references | `skills/README.md` |
| Application requirements and architecture | `docs/openspec/00_CONTEXT.md` |
| Deployment | `docs/deployment/VERCEL_MONOREPO_FIX.md` |

## Active stack

- Next.js 16 + React 19 + TypeScript in `apps/maxx-web`
- Supabase data/auth with explicit seed-mode behavior
- npm for install, build, lint, typecheck, and tests
- Vercel deployment from `apps/maxx-web`

## Verification

From the repository root:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
```

`npm run verify` includes the application harness. A green build is not proof that deployed machine-to-machine paths are verified; use `icm/federation/WALK_TEST.md` for that distinction.

**Last updated:** 2026-09-18
