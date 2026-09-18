# federation — orient the three-repository MAXX system

One job: route an agent to the correct repository, canonical owner and machine path without loading the whole system.

## Inputs
- Reference: `../../docs/icm/FEDERATION_CONTRACT.md`
- Reference: `../../docs/icm/HUMAN_MACHINE_CONTRACT.md`
- Reference: `../../docs/icm/ICM_CORE.md`
- Reference for commercial work: `../growth-engine/SKILL.md`

## Process
1. Identify the requested outcome and durable truth involved.
2. Choose the repository that owns that truth.
3. Load only the smallest relevant local context there.
4. If execution crosses repositories, use the governed API/CLI/MCP path rather than copying state.
5. Capture motion evidence and current evidence stage.

## Outputs
- Repository owner decision.
- Exact context path(s) loaded.
- Machine transport used when applicable.
- Evidence receipt or truthful blocker.

## Human check
Confirm the selected repository really owns the truth and that any consequential action has the correct authority/rollback before it executes.
