import { getSupabaseClient } from "@/lib/data/supabase-client";

function startOfPreviousUtcWeek(now = new Date()) {
  const day = now.getUTCDay();
  const thisMonday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  thisMonday.setUTCDate(thisMonday.getUTCDate() - ((day + 6) % 7));
  const start = new Date(thisMonday);
  start.setUTCDate(start.getUTCDate() - 7);
  const end = new Date(thisMonday);
  end.setUTCDate(end.getUTCDate() - 1);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export async function generateRecoveryReceipts() {
  const supabase = getSupabaseClient();
  const period = startOfPreviousUtcWeek();
  const startTs = `${period.start}T00:00:00.000Z`;
  const endTs = `${period.end}T23:59:59.999Z`;

  const { data: organizations, error: orgError } = await supabase.from("maxx_organizations").select("id, name");
  if (orgError) throw new Error(`Could not load organizations: ${orgError.message}`);

  const results: Array<{ organizationId: string; receiptId?: string; status: string; error?: string }> = [];
  for (const organization of organizations ?? []) {
    try {
      const [{ data: ledger, error: ledgerError }, { data: opportunities, error: opportunityError }] = await Promise.all([
        supabase
          .from("maxx_value_ledger_entries")
          .select("id, entry_type, amount_cents, currency, confidence, source_provider, source_ref, evidence, occurred_at")
          .eq("organization_id", organization.id)
          .gte("occurred_at", startTs)
          .lte("occurred_at", endTs)
          .order("occurred_at", { ascending: false }),
        supabase
          .from("maxx_opportunities")
          .select("id, title, updated_at")
          .eq("organization_id", organization.id)
          .lt("updated_at", startTs)
          .limit(100),
      ]);
      if (ledgerError) throw new Error(ledgerError.message);
      if (opportunityError) throw new Error(opportunityError.message);

      let verified = 0;
      let attributed = 0;
      let estimated = 0;
      let recoveredCount = 0;
      const evidence: Array<Record<string, unknown>> = [];

      for (const entry of ledger ?? []) {
        const amount = Number(entry.amount_cents ?? 0);
        if (["payment", "booked_revenue", "recovered_revenue"].includes(entry.entry_type)) {
          if (entry.confidence === "VERIFIED") verified += amount;
          else if (entry.confidence === "ATTRIBUTED") attributed += amount;
          else if (entry.confidence === "ESTIMATED") estimated += amount;
        }
        if (entry.entry_type === "refund") {
          if (entry.confidence === "VERIFIED") verified -= Math.abs(amount);
          else if (entry.confidence === "ATTRIBUTED") attributed -= Math.abs(amount);
        }
        if (entry.entry_type === "recovered_revenue") recoveredCount += 1;
        if (entry.source_provider && entry.source_ref) {
          evidence.push({
            ledgerEntryId: entry.id,
            provider: entry.source_provider,
            sourceRef: entry.source_ref,
            confidence: entry.confidence,
            type: entry.entry_type,
          });
        }
      }

      const summary = {
        organizationName: organization.name,
        period,
        verifiedRevenueCents: verified,
        attributedRevenueCents: attributed,
        estimatedValueCents: estimated,
        recoveredCount,
        needsAttentionCount: opportunities?.length ?? 0,
        statement: "Verified, attributed, and estimated value are reported separately. Estimated value is never booked revenue.",
      };

      const { data: receipt, error: receiptError } = await supabase
        .from("maxx_recovery_receipts")
        .upsert(
          {
            organization_id: organization.id,
            period_start: period.start,
            period_end: period.end,
            status: "ready",
            verified_revenue_cents: verified,
            attributed_revenue_cents: attributed,
            estimated_value_cents: estimated,
            recovered_count: recoveredCount,
            risk_count: opportunities?.length ?? 0,
            summary,
            evidence,
            generated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "organization_id,period_start,period_end" },
        )
        .select("id")
        .single();
      if (receiptError) throw new Error(receiptError.message);
      results.push({ organizationId: organization.id, receiptId: receipt.id, status: "ready" });
    } catch (error) {
      results.push({
        organizationId: organization.id,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown receipt error",
      });
    }
  }

  return { period, results };
}
