# Agent MAXX Portal — Interface + Consolidation Source

Repo: `https://github.com/executiveusa/macs-agent-portal`
Vercel project: `macs-agent-portal` (`prj_OkH9RAV46Ocr7zXxLZHKYJWt234c`)
Observed latest deployment: READY preview, `target: null`, `live: false`.

## Canonical end-state job

Agent MAXX customer/operator surface: chat, voice, avatar, one clear next action, approvals, summaries, progress, evidence, assets, schedules and access to the customer's Company Brain through MAXX Migrations.

The portal is the interface. `executiveusa/maxx-migrations-agentic-systems` is the canonical long-term data/process/control backend.

## Important existing work — do not rebuild blindly

The portal repository already contains a substantial tested control plane. Recent repository history documents:

- feature flags, emergency disable and production mutation lock;
- per-operator rate limiting and provider circuit breaker;
- approval expiration and anti-replay behavior;
- Hermes adapter contract and HTTP/stub implementations;
- memory indexer with local persistence and search;
- owner strategy/preferences;
- fixed-interval scheduler;
- voice provider gateway;
- real Playwright browser worker for read-only actions;
- dashboard surfaces for dependencies, flags and owner strategy;
- additive Supabase migration files for strategy/memory/Hermes state that were explicitly not applied;
- local backup/restore with checksum verification;
- security review and graceful shutdown;
- typed `packages/client-sdk` for the `/v1/*` control-plane API;
- acceptance tests and CI/CD, with repository history reporting 90+ control-plane tests plus frontend and SDK tests.

This is a **consolidation asset**, not permission to keep two backends.

## Critical architecture truth

A recent control-plane commit explicitly corrected an earlier assumption: the portal's current schema/control plane is a **single-organization shared command center**, not a proven multi-tenant SaaS backend. Do not inherit its authorization model as MAXX Migrations' tenant model without redesign and proof.

## Consolidation direction

1. Inventory portal control-plane modules and tests.
2. Inventory equivalent/newer modules in MAXX Migrations.
3. For each module decide `KEEP_PORTAL_UI | MOVE_TO_BACKEND | WRAP | MERGE_TESTS | RETIRE`.
4. Preserve the typed client SDK contract where useful; it is a natural bridge between Agent MAXX and the backend.
5. Move durable process/data authority behind tenant-scoped MAXX Migrations APIs.
6. Keep the portal focused on interaction, approvals, progress and evidence presentation.
7. Delete/retire duplicate backend code only after equivalent behavior is proven in the canonical backend.

## Immediate security risk

A root `.env` file is committed in this public repository. Do not read or reproduce its values into prompts, ICM or documentation. Treat it as a potential secret exposure until a dedicated security audit establishes whether values are placeholders or live; rotate any real credentials discovered through an approved secret-handling process.

## UX north star

A nontechnical founder states the outcome in normal language. MAXX discovers what it can, asks only material decisions, performs safe reversible work, presents one next action, and asks for judgment only where human authority is required.
