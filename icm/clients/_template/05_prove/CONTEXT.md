# 05 — Prove: acceptance, costs and rollback

**Inputs:** baseline, output, run ID, receipts, provider meter, owner acceptance and deployment revision.

**Process:** independently verify actual result; reconcile actual provider costs to metered usage; compare baseline; exercise failure and rollback; test export/restore; classify evidence state.

**Outputs:** source-linked proof pack, client-visible cost ledger, exception log, acceptance record, next action.

**Human gate:** independent reviewer approves release; founder accepts usefulness. Claims of savings/revenue require real measurements.

**Exit proof:** `surface → handler → transport → canonical owner → observable result → evidence`. Build/CI alone is not production verification.
