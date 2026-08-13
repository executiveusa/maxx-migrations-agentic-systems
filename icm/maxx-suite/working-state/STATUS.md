# MAXX Suite Working State

Last updated: 2026-08-12

## Canonical architecture locked

- Public site: `executiveusa/macsdigitalmedia`
- Backend/data/process brain: `executiveusa/maxx-migrations-agentic-systems`
- Agent MAXX interface: `executiveusa/macs-agent-portal`

## Infrastructure observed

- Vercel `macsdigitalmedia` project exists; latest deployment observed in this audit was ERROR / not live.
- Vercel `macs-agent-portal` project exists; latest deployment observed was READY preview / target null / not live.
- Vercel MAXX Migrations project exists.
- Connected Supabase currently exposes only `botanic-creations` in this session. Schemas include multiple isolated product schemas, but no MAXX-specific schema was observed. No database mutation was made during this portfolio pass.

## Immediate risks / decisions

1. Do not merge public-site design work into MAXX Migrations.
2. Port approved founder/Snoqualmie concepts into `macsdigitalmedia` later.
3. Reconcile public offer/pricing contract before GTM automation.
4. Audit the committed `.env` file in public `macs-agent-portal` without exposing contents; rotate any real credentials.
5. Decide whether MAXX gets its own isolated Supabase schema inside Botanic Creations or a separate project before implementing data contracts.
6. Audit `maxx-craft` and spy-scape against MAXX Migrations for code extraction, not parallel control planes.
7. Benchmark the social stack end to end: Research → editorial → video → Postiz → metrics.

## Next bounded phase

Inspect the three core repos deeply and produce one connection spec with exact API routes, auth, source-of-truth ownership and deployment boundaries. No broad implementation until that spec passes review.