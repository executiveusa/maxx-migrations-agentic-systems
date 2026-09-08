import { getSupabaseClient } from "@/lib/data/supabase-client";
import { summarizeValueLedger, moneyByCurrency, singleCurrency } from "@/lib/revenue-capture/value-summary";
function previousWeek(now = new Date()) {
  const day = now.getUTCDay();
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() - ((day + 6) % 7));
  const start = new Date(monday); start.setUTCDate(start.getUTCDate() - 7);
  const end = new Date(monday); end.setUTCDate(end.getUTCDate() - 1);
  return { start: start.toISOString().slice(0,10), end: end.toISOString().slice(0,10) };
}
export async function generateRecoveryReceipts() {
  const supabase = getSupabaseClient();
  const period = previousWeek();
  const startTs = `${period.start}T00:00:00.000Z`;
  const endTs = `${period.end}T23:59:59.999Z`;
  const { data: organizations, error: orgError } = await supabase.from("maxx_organizations").select("id, name");
  if (orgError) throw new Error(orgError.message);
  const results: Array<{ organizationId: string; receiptId?: string; status: string; error?: string }> = [];
  for (const organization of organizations ?? []) {
    try {
      const ledger = [];
      const opportunities = [];
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await supabase.from("maxx_value_ledger_entries").select("id, entry_type, amount_cents, currency, confidence, source_provider, source_ref, evidence, occurred_at").eq("organization_id", organization.id).gte("occurred_at",startTs).lte("occurred_at",endTs).order("id").range(offset,offset+499);
        if (error) throw new Error(error.message);
        ledger.push(...(data ?? []));
        if (!data?.length || data.length < 500) break;
      }
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await supabase.from("maxx_opportunities").select("id, title, updated_at, value_cents, currency").eq("organization_id", organization.id).lt("updated_at",startTs).order("id").range(offset,offset+499);
        if (error) throw new Error(error.message);
        opportunities.push(...(data ?? []));
        if (!data?.length || data.length < 500) break;
      }
      const currencies = summarizeValueLedger(ledger);
      const primary = singleCurrency(currencies, "USD");
      const summary = { organizationName: organization.name, period, currencies, pipelineByCurrency: moneyByCurrency(opportunities), recoveredCount: ledger.filter((row) => row.entry_type === "recovered_revenue").length, needsAttentionCount: opportunities.length, statement: "Net payment evidence only. Bookings, recovery classifications and pipeline are non-additive. No incremental revenue is inferred." };
      const evidence = ledger.filter((row) => row.source_provider && row.source_ref).map((row) => ({ ledgerEntryId: row.id, provider: row.source_provider, sourceRef: row.source_ref, confidence: row.confidence, type: row.entry_type }));
      const { data: receipt, error: receiptError } = await supabase.from("maxx_recovery_receipts").upsert({
        organization_id: organization.id, period_start: period.start, period_end: period.end,
        status: "ready", verified_revenue_cents: primary.totalsCents.VERIFIED, attributed_revenue_cents: primary.totalsCents.ATTRIBUTED,
        estimated_value_cents: primary.totalsCents.ESTIMATED, recovered_count: summary.recoveredCount, risk_count: opportunities.length,
        summary, evidence, generated_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }, { onConflict: "organization_id,period_start,period_end" }).select("id").single();
      if (receiptError) throw new Error(receiptError.message);
      results.push({ organizationId: organization.id, receiptId: receipt.id, status: "ready" });
    } catch (error) { results.push({ organizationId: organization.id, status: "failed", error: error instanceof Error ? error.message : "Unknown receipt error" }); }
  }
  return { period, results };
}
