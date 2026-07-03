# 17 — Release Plan

## This PR

Merges `claude/maxx-migrations-full-build-5jh55a` into `develop`. Ready
for review once `verify:full` and `test:e2e` are green (see
`beads/checkpoints/0022-harness-green.md`).

## Before a real production deploy

1. Create a Supabase project; run
   `supabase/migrations/20260101000000_maxx_crm_core.sql`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` /
   `SUPABASE_SERVICE_ROLE_KEY`.
3. Replace `lib/data/store.ts`'s in-memory arrays with Supabase queries
   (every consumer already goes through `getStore()`, so this is
   contained).
4. Set `NEXT_PUBLIC_AUTH_CONFIGURED=true` once real auth is wired, so the
   seed-mode banner and demo-org fallback turn off.
5. Configure Twilio, Meta, and (optionally) GHL API / Postiz credentials
   per `.env.example` — each integration activates automatically once its
   variables are present, no code changes required.
6. Set the Vercel project's Root Directory to `apps/maxx-web` (see
   `docs/deployment/VERCEL_MONOREPO_FIX.md`).

## Rollback

Every bead in `beads/checkpoints/0011`–`0024` lists the specific
`git checkout --` command to revert that unit of work if needed.
