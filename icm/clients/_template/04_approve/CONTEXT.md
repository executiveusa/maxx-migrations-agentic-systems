# 04 — Approve: exact-action governance

**Inputs:** authenticated request, verified source context, plan, allowed tool, estimated cost and action payload.

**Process:** classify risk, compute/persist payload hash, bind approver/tenant/expiry, wait for human gate, revalidate exact hash and authority at execution, enforce idempotency.

**Outputs:** draft or blocked response; if approved, execution ID and audit/evidence receipts.

**Human gate:** explicit approval for money, public sends/publishing, tax/legal filings, credential changes, destructive writes and production releases.

**Exit proof:** rejection causes zero side effects; approved action runs at most once; changed payload invalidates prior approval. Never substitute the existing controlled test executor for a real adapter without independent review.
