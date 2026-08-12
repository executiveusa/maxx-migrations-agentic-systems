# 02_connect — close required seams

One job: connect only the systems required for the next verified business outcome.

## Inputs
- Working: `../01_orient/output/current-state.md`
- Reference: `../_shared/system-map.md`
- Reference: `../_shared/readiness-bar.md`
- Authority: `../../../docs/icm/HUMAN_MACHINE_CONTRACT.md`

Do NOT connect speculative tools, duplicate providers, or additional clients.

## Process
1. Resolve the single largest blocking connection from the current-state map.
2. Prefer adapters and existing seams over rewrites.
3. Verify tenant scope, credential boundary, failure behavior, and rollback before enabling writes.
4. Keep provider-specific details below stable MAXX interfaces.

## Outputs
- `connection-map.md` → `output/`

## Human check
Approve any consequential credential, production, billing, or external-action change immediately before it is executed.
