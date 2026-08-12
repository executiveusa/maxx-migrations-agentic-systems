# 05_package — extract reusable company pattern

One job: turn the verified Client Zero setup into a clean, portable company template without leaking MACS-specific data.

## Inputs
- Working: `../04_prove/output/readiness.md`
- Reference: `../_shared/identity.md`
- Reference: `../_shared/system-map.md`
- Client Zero router: `../../clients/macs-digital-media/CONTEXT.md`

Do NOT copy customer data, credentials, private evidence, or MACS-only facts into the reusable template.

## Process
1. Separate factory rules from MACS instance data.
2. Define the minimum Company Pack required to onboard another business.
3. Define provider adapters and owner-controlled export/handoff boundaries.
4. Cold-walk the template as if onboarding a different business with no prior MAXX memory.
5. Record any MACS assumptions that still leak into the template and remove them.

## Outputs
- `company-template.md` → `output/`

## Human check
Confirm a second company can be onboarded without exposing MACS data or requiring the owner to understand the underlying agent stack.
