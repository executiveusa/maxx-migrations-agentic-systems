# Revenue Capture OS — Cold Walk Test

## Test
Start with no chat history and only the repository root.

1. Root `AGENTS.md` routes MAXX product/integration work to `icm/maxx-suite/00_router/CONTEXT.md`.
2. MAXX suite router routes customer data, ICM, workflows, approvals, evidence, migrations, and agent tools to MAXX Migrations and forbids a duplicate control plane.
3. Revenue Capture work enters `icm/revenue-capture-os/00_router/CONTEXT.md`.
4. That router requires only `01_context/CONTEXT.md` and the active contract named in `STATE.md`.

## Pass criteria
After the router + context + active contract, the cold agent can answer all of these without chat history:
- Where am I? Revenue Capture OS inside canonical MAXX Migrations.
- What is my job? Capture/recover/prove with evidence-backed economics.
- What is the exact input? Provider/customer events plus existing MAXX tenant/business state.
- What is the exact output? Provider events, correlated business objects, Value Ledger entries, client/operator views, and Recovery Receipts.
- Where do outputs live? `apps/maxx-web/**`, database tables named in context, and this ICM state/evidence folder.
- What is the human boundary? Consequential actions require exact persisted approval; secrets are never ICM.
- How do I know state? `STATE.md` plus Git/CI/provider evidence, not conversation memory.
- What proves completion? Green engineering gate + correct backend/deployment + provider-native evidence for anything called live.

## Structural result
PASS — the ICM navigation itself meets the <=2 additional-read operational contract after entry into the Revenue Capture router.

## Runtime result
PENDING until the branch CI/build and actual accessible production backend/deployment are green. Structural PASS must never be represented as live-provider proof.
