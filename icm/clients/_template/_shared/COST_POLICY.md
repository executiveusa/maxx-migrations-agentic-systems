# Client-visible usage and cost contract

## Commercial boundary
- Customer pays Hostinger VPS directly for the agreed term and owns the hosting account.
- Customer pays inference/voice/SMS/video/provider consumption at actual provider rates. **MACS adds 0% markup** to those pass-through costs.
- MACS setup, maintenance and managed-service fees are separate, disclosed line items. Affiliate commission, if approved by Hostinger, is paid by the partner and must be disclosed where required; never counted as guaranteed margin.
- No promise of unlimited model usage or unbounded sandbox time.

## Ledger event (proposed)
```json
{"tenant_id":"<resolved>","request_id":"<uuid>","run_id":"<uuid>","provider":"<name>","model_or_service":"<sku>","units":{"input_tokens":0,"output_tokens":0,"seconds":0},"unit_rate_source":"<provider-invoice-or-pricing-version>","estimated_usd":0,"actual_usd":null,"currency":"USD","recorded_at":"<ISO-8601>","invoice_ref":null}
```

Keep **estimated** and **actual** separate. Reconcile provider invoices when available; do not call a token estimate an actual charge. Store no payment credentials in ICM.

## Controls
- Monthly per-tenant model budget starts at $0 (deny) until the client approves a limit.
- Preflight estimate and reserved spend before expensive jobs; warn at 50%, 80%, 100%.
- Hard-stop on budget for new jobs; allow explicitly approved exceptions, never silent overruns.
- Meter tokens, storage, media, SMS, computer minutes, API connector costs and human support separately.
- Show the founder a simple monthly panel: budget, spent, pending estimate, top tasks, cost per accepted outcome, and optimization suggestions.
- A cost ledger cannot guarantee zero overrun when vendors report asynchronously; document reconciliation lag and cap reservations conservatively.
