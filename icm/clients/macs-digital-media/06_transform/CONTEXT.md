# 06 — MACS Public-Site Transformation

Status: active Client Zero transformation instance
Canonical protocol: `../../../site-transformation-protocol/00_router/CONTEXT.md`
Public repo: `executiveusa/macsdigitalmedia`
Quality bar: live `wearecollins.com` for structural discipline, restraint, proof density, editorial hierarchy, whitespace, storytelling, and mobile quality.

## Current phase state

Runtime truth supersedes the earlier Phase 05-only snapshot.

- TRUTH — current storefront/repo/deployment state has been re-verified. Remaining production intake database uncertainty is tracked in `EVIDENCE.md`.
- POSITION — current public direction is implemented: MACS leads with people, business situations, proof and relationship rather than internal AI/SaaS architecture.
- ARCHITECT — current homepage and public-route architecture are implemented. The public commercial architecture remains Reset / Momentum / Scale / Launch.
- PROVE — real project/product assets are in use. Unsupported claims remain prohibited.
- WALK TEST — PASS. See `WALK_TEST_RESULT.md`.
- DESIGN — CURRENT PRODUCTION DIRECTION SELECTED / IMPLEMENTED. The owner approved the current editorial, father-and-son, motion/tactile and proof-led direction through the production refinement run completed 2026-09-22.
- BUILD — CURRENT STOREFRONT SLICE COMPLETE. Public repo main is `ba1965abfc2739f45233dca4742bbe100fa50f5e` after PR #42, with production Netlify deploy `6ab201096fa083000889f665` READY at the same commit.
- GAUNTLET — `GAUNTLET_INCOMPLETE`. Internal CI/browser/mobile/motion/settled-visual gates pass, but the canonical Gauntlet requires fresh equivalent-viewport capture of the live COLLINS reference. That reference comparison has not been completed in the current evidence set. See `GAUNTLET_REPORT.md`.
- LEARN — ACTIVE NEXT STAGE. Measure real usage, proof quality, conversion and intake reliability; supersede assumptions with observed evidence.

## Current release evidence

- Public URL: `https://macsdigitalmedia.netlify.app`
- Production commit: `ba1965abfc2739f45233dca4742bbe100fa50f5e`
- Production Netlify deploy: `6ab201096fa083000889f665`
- Production deploy state: READY
- Production deploy commit match: VERIFIED
- Final refinement PR: `executiveusa/macsdigitalmedia#42`
- Branch CI before merge: PASS
- Settled visual QA artifact: `macs-visual-review`, workflow run `35685863345`, artifact `10676523344`
- Rollback baseline: `527fa3f055c0d320e8a91325f08b4960b4ce34c9`

## Open production blocker

The public code/deploy is current, but the simplified application intake database migration is not VERIFIED.

The 2026-09-22 production schema workflow failed before applying migrations because the GitHub `production` environment did not provide `SUPABASE_DB_URL`. The workflow log showed the value empty and stopped with `SUPABASE_DB_URL is required.`

Therefore:
- do not claim the application persistence path is production-verified;
- do not point the migration at an unrelated Supabase project;
- add/restore the approved Hostinger Supabase database connection secret through the secure GitHub production environment;
- rerun the migration workflow and require its API verification step to pass before closing this blocker.

## Inputs / gate receipts

- `DECISIONS.md`
- `PRD.md`
- `WIREFRAME.md`
- `EVIDENCE.md`
- `ASSET_MANIFEST.md`
- `WALK_TEST_RESULT.md`
- `DESIGN_GATE.md`
- `GAUNTLET_CONFIG.md`
- `GAUNTLET_REPORT.md`
- `../../../site-transformation-protocol/05_design/DESIGN_DOCTRINE.md`
- MACS public repository current state
- owner-supplied COLLINS-level website design protocol
- owner-supplied HEART & SOUL design doctrine

## Immediate next gate

1. Securely configure the approved production `SUPABASE_DB_URL`.
2. Rerun `Deploy Hostinger Supabase schema` and require migration + API verification PASS.
3. Capture the live COLLINS bar and MACS at equivalent declared viewports.
4. Run the independent Gauntlet comparison and record PASS / PASS_WITH_WARNINGS / FAIL without substituting memory for rendered evidence.
5. Continue LEARN with real production usage and conversion evidence.

## Human check

Material offer changes, new public founder/client claims, pricing, consequential production/data changes, domain/DNS changes and acceptance of the final external Gauntlet judgment remain owner decisions.
