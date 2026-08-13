# MACS Digital Media — Public Storefront

Repo: `https://github.com/executiveusa/macsdigitalmedia`
Vercel project: `macsdigitalmedia` (`prj_G91tnavUHqUtr63PUaAxO9r7veps`)

## Job

Public-facing MACS Digital Media website: brand, founder story, offers, blog/content, SEO, application/intake UX and safe demonstrations.

## Boundary

This repo must stay light. It should not become the customer database, workflow engine, long-term company brain or agent runtime. Public submissions should be forwarded server-side through a bounded webhook/API contract to MAXX Migrations.

## Current repo truth observed 2026-08-12

- Its own `AGENTS.md` already says public website responsibilities stay here and agent execution/ICM stays in `maxx-migrations-agentic-systems`.
- Current context contains a Washington Founding Launch / AI Operating System direction and a Supabase-backed application path.
- Current Vercel project exists, but its latest deployment observed during this audit was `ERROR` and `live: false`; do not claim production readiness.
- Recent founder-led/Snoqualmie work was mistakenly built in the backend repo. Treat that branch as salvage material to port here, not as the canonical public implementation.

## Next inspection

1. Reconcile the public offer contract: current repo's $7,500 founding-launch copy vs. the more recent $497 diagnosis/front-door direction.
2. Port only approved visual/copy concepts from the mistaken backend frontend branch.
3. Replace direct business-data persistence with a thin server-side intake/webhook adapter where practical.
4. Re-run mobile, accessibility, analytics, SEO and production-domain proof.