# MACS Client Zero pilot — reality

Baseline: `5d59935e1b88d0bd9a5174ddd9b99e48ff9dda54` on `develop`, observed 2026-11-04.

Verified: canonical MAXX repo contains the intake API, Supabase migration, authenticated review RPC, Client Zero console, and rollback documentation. The intake API uses a service-role client; no effective rate limit or atomic intake transaction was observed. The review RPC blocks self-approval and has a unique proposal-to-note relationship, but exact reviewed-payload binding has not been proven.

Missing: MACS-owned connected Supabase database, Next.js staging deployment, two-tenant isolation tests, reviewer identity mapping, rate limits, end-to-end approval and export proof, independent review, Instinct A2A transport and scheduler.

Boundaries: no real client data, paid infrastructure, production changes, credential changes, or external sends without separately authorized gates. See `docs/icm/FEDERATION_CONTRACT.md` and `docs/client-zero/ROLLBACK.md`.
