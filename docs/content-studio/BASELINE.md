# MACS Content Studio Baseline

Status: brownfield discovery / preview only

## Repository truth

- Repository: `executiveusa/maxx-migrations-agentic-systems`
- Public web app: `apps/maxx-web`
- Framework: Next.js 14 / React 18 / TypeScript / Tailwind
- Package manager: npm
- Deployment: Vercel
- Working branch: `design/macs-founder-led-v3`
- PR: #19 → `main`
- Pre-blog founder-led head used as rollback baseline: `af29fa6f32cefb42de6f99b3e2e4e349eb19efe8`
- Main baseline: `47c3032c02b058a19e6f23d4d1f106abeac451c6`

## Verified baseline evidence

Before this blog slice, Vercel deployment `dpl_2Kq9aUCych8LN1ZtCwigMubmxwyd` built the founder-led branch successfully. Next.js compilation, lint/type validation and 73 route builds completed. Existing warnings were non-blocking: legacy `isrMemoryCacheSize`, existing `console` lint warnings and dependency-audit warnings.

## Existing content architecture

Repository code search found no existing Payload CMS or existing `/blog` content system before this slice. The public site already had marketing, audit, case-study, authenticated app and API routes.

## Brownfield constraints

- Preserve the approved homepage/funnel and authenticated app.
- Do not install Payload into unrelated application folders.
- Do not expose or reuse vault secrets in source.
- Do not publish generated articles automatically.
- Do not falsify historical publication dates.
- Do not write content data into an unverified Supabase organization or schema.

## Current stop gate

The public blog shell and editorial backlog may be built in preview, but the full isolated Payload/MCP content studio is **not approved for installation yet** because the dedicated content database/schema ownership and least-privilege credentials have not been verified in the correct MACS organization.

That gate must be resolved before CMS migrations, content-agent keys or persistent content records are created.

## Rollback

- Source rollback: return PR #19 to `af29fa6f32cefb42de6f99b3e2e4e349eb19efe8` for the pre-blog founder-led preview, or close PR #19 to leave `main` unchanged.
- Vercel rollback baseline: `dpl_2Kq9aUCych8LN1ZtCwigMubmxwyd`.
