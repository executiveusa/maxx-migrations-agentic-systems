# Revenue Capture OS — State

MODE: BUILD_AND_PROVE
OUTCOME: Evidence-backed Revenue Capture OS inside canonical MAXX Migrations backend
ACTIVE_STAGE: 02_build/CONTRACT.md
TARGET_BRANCH: codex/revenue-capture-full-loop
BASE_BRANCH: develop

## Built
- Canonical provider-event/evidence spine
- Value Ledger confidence classes
- Twilio signed webhook tenant binding + call/SMS provider IDs
- WhatsApp Business webhook and outbound adapter
- Email webhook/outbound adapter
- Stripe signed payment attribution
- Provider sync registry for ads/analytics/accounting/CRM/ERP
- Recovery Receipt generation and protected cron routes
- Authenticated Revenue summary API
- Authorized cross-client fleet API and UI
- Popebot Revenue Capture read tools
- Authenticated tenant resolution for Popebot

## Required before release
1. CI lint/typecheck/tests/audit/build green.
2. ICM walk test green.
3. PR review complete.
4. Merge to `develop`; synchronize `main` only after post-merge proof.
5. Apply migrations only to the verified canonical MAXX Web Supabase project.
6. Live-provider status is claimed only with provider-native evidence.

## Known external boundary
The Supabase connector currently exposes `cyxdevcjycmffhmwxojh` (`botanic-creations`). Historical MAXX Web CRM migrations identify a different project ref. Do not apply Revenue Capture schema to a mismatched project without explicit schema compatibility proof.

The Vercel connector currently exposes the `pauli-4426` team, while historical MAXX deployments have also appeared under `the-pauli-effect`. Do not claim production deployment on an inaccessible team solely from source code.
