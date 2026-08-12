# 01_orient — establish current truth

One job: build an evidence-backed map of what MAXX actually has today.

## Inputs
- Reference: `../_shared/identity.md`
- Reference: `../_shared/system-map.md`
- Canonical repo rules: `../../../AGENTS.md`
- Product architecture: `../../../docs/openspec/03_ARCHITECTURE.md`
- Client Zero state: `../../clients/macs-digital-media/working-state/STATUS.md`

Do NOT load every client file or every legacy ERPNext file by default.

## Process
1. Inspect current GitHub code/state and identify canonical production paths vs legacy/vendor code.
2. Inspect current Supabase, Vercel, runtime/provider, and computer-use state using live tools where available.
3. Mark each capability as VERIFIED, IMPLEMENTED-NOT-PROVEN, MISSING, LEGACY, or UNKNOWN.
4. Name the single largest gap blocking a real Client Zero outcome.

## Outputs
- `current-state.md` → `output/`

## Human check
Confirm the map matches the business reality and that no important system or dependency has been omitted.
