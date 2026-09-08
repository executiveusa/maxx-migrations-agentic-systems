import { NextResponse } from "next/server";
import { getCurrentOrgId, getSupabaseAuth } from "@/lib/auth/supabase-auth";
import { summarizeValueLedger, moneyByCurrency, singleCurrency } from "@/lib/revenue-capture/value-summary";

export async function GET() {
  try {
    const orgId = await getCurrentOrgId();
    const supabase = await getSupabaseAuth();
    const ledger = [];
    const opportunities = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await supabase.from("maxx_value_ledger_entries")
        .select("id, entry_type, amount_cents, currency, confidence, source_provider, source_ref, occurred_at")
        .eq("organization_id", orgId).order("id").range(offset, offset + 499);
      if (error) throw new Error(error.message);
      ledger.push(...(data ?? []));
      if (!data?.length || data.length < 500) break;
    }
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await supabase.from("maxx_opportunities")
        .select("id, title, value_cents, currency, updated_at")
        .eq("organization_id", orgId).order("id").range(offset, offset + 499);
      if (error) throw new Error(error.message);
      opportunities.push(...(data ?? []));
      if (!data?.length || data.length < 500) break;
    }
    const { data: connections, error: connectionError } = await supabase.from("maxx_integration_connections")
      .select("provider, status, last_verified_at, last_event_at, health_message")
      .eq("organization_id", orgId).order("provider");
    if (connectionError) throw new Error(connectionError.message);
    const currencies = summarizeValueLedger(ledger);
    const pipelineByCurrency = moneyByCurrency(opportunities);
    const onlyCurrency = currencies.length === 1 ? currencies[0]?.currency ?? null : null;
    const pipelineCurrencies = Object.keys(pipelineByCurrency);
    const currency = onlyCurrency && pipelineCurrencies.every((key) => key === onlyCurrency)
      ? onlyCurrency : currencies.length === 0 && pipelineCurrencies.length <= 1
        ? pipelineCurrencies[0] ?? "USD" : null;
    const selected = currency ? singleCurrency(currencies, currency) : null;
    const attention = [...opportunities].sort((a, b) => a.updated_at.localeCompare(b.updated_at)).slice(0, 3).map((row) => ({
      id: row.id, title: row.title, valueCents: Number(row.value_cents ?? 0), currency: row.currency ?? "USD", updatedAt: row.updated_at,
    }));
    return NextResponse.json({
      organizationId: orgId, currency, currencies, pipelineByCurrency,
      totalsCents: selected?.totalsCents ?? null, recoveredCents: selected?.recoveredCents ?? null,
      bookedCents: selected?.bookedCents ?? null,
      openOpportunityCents: currency ? pipelineByCurrency[currency] ?? 0 : null,
      opportunityCount: opportunities.length, attention, integrations: connections ?? [],
      recentEvidence: [...ledger].sort((a, b) => b.occurred_at.localeCompare(a.occurred_at)).slice(0, 10),
      evidencePolicy: {
        verified: "Direct provider payment evidence; not necessarily incremental revenue.",
        attributed: "System linkage, not independently proven causality.",
        estimated: "Modeled value only; never booked revenue.",
        unknown: "Insufficient evidence.",
        totals: "Net payment evidence only. Bookings, recovery classifications and pipeline are separate, non-additive measures.",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load revenue evidence.";
    const status = /Not authenticated/i.test(message) ? 401 : /membership|organization/i.test(message) ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
