# MACS Transformation Evidence Ledger

Last review: 2026-09-22

## Proven / observed — current production

- Public repo: `executiveusa/macsdigitalmedia`, default branch `main`.
- Current production commit: `ba1965abfc2739f45233dca4742bbe100fa50f5e`.
- Final production-refinement PR: `#42`.
- Netlify production site: `https://macsdigitalmedia.netlify.app`.
- Netlify production deploy: `6ab201096fa083000889f665`.
- Netlify state: READY.
- Netlify `commit_ref` exactly matches `ba1965abfc2739f45233dca4742bbe100fa50f5e`.
- Branch verification for the final refinement passed lint, typecheck, production build, Chromium browser usability, responsive checks, motion regression checks and settled visual capture.
- Final pre-merge verification run: `35685863345`.
- Final settled visual artifact from that run: `10676523344`, digest `sha256:fdcfac1c26682594079b5d71791bc31044eeb5160381533ca6d5d056f0509479`.
- Production rollback baseline before the final refinement: `527fa3f055c0d320e8a91325f08b4960b4ce34c9`.
- Current public positioning leads with the father-and-son digital-partner story, four public Programs, selected client work and Built Here products.
- Current motion system includes scroll-linked scene depth, independent hero media/copy movement, living header states, tactile control response and reduced-motion handling.
- The final refinement raised minimum scene/route opacity, replaced compounded secondary-text opacity with explicit colors, strengthened existing ASC3ND proof placement, art-directed Built Here screenshots and added settled visual QA.

## Production blocker — application intake database

Status: `BLOCKED_BY_EVIDENCE` / migration not applied by the production workflow.

Workflow:
- `Deploy Hostinger Supabase schema`
- run `35686243782`
- production commit `ba1965abfc2739f45233dca4742bbe100fa50f5e`

Observed failure:
- `SUPABASE_DB_URL` was empty in the GitHub `production` environment.
- `npm run db:apply:hostinger` stopped with `SUPABASE_DB_URL is required.`
- the API verification step was skipped.

Consequence:
- the simplified public intake code cannot be called production-persistence VERIFIED from this evidence;
- do not infer schema state from frontend build/deploy success;
- do not use an unrelated Supabase project as a substitute.

Required evidence to close:
1. approved Hostinger Supabase database URL configured as the protected GitHub production environment secret;
2. migration workflow PASS;
3. verification script PASS against `founding_applications` fields `id, need, context, timing`;
4. harmless production submission smoke test only when explicitly authorized or when a designated test path exists.

## Gauntlet evidence

Internal MACS evidence is strong:
- declared responsive matrix passes;
- no horizontal-overflow regressions on public routes;
- primary touch geometry is tested after motion transforms;
- meaningful lower-page copy remains readable before reveal settles;
- reduced motion retains the complete static experience;
- Built Here product media is staged consistently rather than relying on pale edge-to-edge UI;
- settled visual screenshots are generated independently from dynamic-motion assertions.

Canonical external comparison remains incomplete:
- quality bar is live `wearecollins.com`;
- `GAUNTLET_CONFIG.md` requires equivalent viewport captures;
- fresh equivalent-viewport reference capture is not present in the current evidence set.

Verdict: `GAUNTLET_INCOMPLETE`, not PASS and not FAIL.

## Real proof candidates

### PROVEN AS ASSETS / PROJECTS, PUBLIC CLAIM DEPENDS ON SOURCE PACK
- ASC3ND client/project work.
- MACS / Client Zero as build-in-public proof.
- Stacy + Stavarai founder story and PostaTees connection.
- Agent MAXX.
- Buffer Blaster.
- Home Team AI evaluation work.
- Preserve / Rescue / Replace and Green / Yellow / Red diagnostic frameworks.

### NEEDS VERIFICATION BEFORE NEW PUBLIC CLAIMS
- specific client outcome statements and client permission;
- third public case study;
- final public pricing strategy;
- additional quantitative performance/conversion claims.

### DO NOT CLAIM WITHOUT NEW EVIDENCE
- revenue/conversion lifts;
- partnerships with Microsoft, Ai2, or other technology vendors;
- awards or rankings not actually received;
- fabricated client scale or case-study density;
- unmeasured performance metrics.

## Source discipline

This ledger records source-supported facts and owner decisions. If future evidence contradicts an entry, supersede it explicitly rather than silently rewriting history.
