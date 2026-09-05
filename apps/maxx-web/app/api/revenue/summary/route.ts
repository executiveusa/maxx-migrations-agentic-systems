import { NextResponse } from "next/server";
import { getCurrentOrgId, getSupabaseAuth } from "@/lib/auth/supabase-auth";

const CONFIDENCE = ["VERIFIED", "ATTRIBUTED", "ESTIMATED", "UNKNOWN"] as const;
type Confidence = (typeof CONFIDENCE)[number];

export async function GET() {
  try {
    const orgId = await getCurrentOrgId();
    const supabase = await getSupabaseAuth();

    const [{ data: ledger, error: ledgerError }, { data: opportunities, error: opportunityError }, { data: connections, error: connectionError }] =
      await Promise.all([
        supabase
          .from("maxx_value_ledger_entries")
          .select("id, entry_type, amount_cents, currency, confidence, source_provider, source_ref, occurred_at")
          .eq("organization_id", orgId)
          .order("occurred_at", { ascending: false })
          .limit(250),
        supabase
          .from("maxx_opportunities")
          .select("id, title, value_cents, currency, updated_at")
          .eq("organization_id", orgId)
          .order("updated_at", { ascending: true })
          .limit(250),
        supabase
          .from("maxx_integration_connections")
          .select("provider, status, last_verified_at, last_event_at, health_message")
          .eq("organization_id", orgId)
          .order("provider"),
      ]);

    if (ledgerError) throw new Error(ledgerError.message);
    if (opportunityError) throw new Error(opportunityError.message);
    if (connectionError) throw new Error(connectionError.message);

    const totals = Object.fromEntries(CONFIDENCE.map((key) => [key, 0])) as Record<Confidence, number>;
    const recovered = Object.fromEntries(CONFIDENCE.map((key) => [key, 0])) as Record<Confidence, number>;

    for (const entry of ledger ?? []) {
      const confidence = CONFIDENCE.includes(entry.confidence as Confidence) ? (entry.confidence as Confidence) : "UNKNOWN";
      const amount = Number(entry.amount_cents ?? 0);
      if (["payment", "booked_revenue", "recovered_revenue"].includes(entry.entry_type)) totals[confidence] += amount;
      if (entry.entry_type === "recovered_revenue") recovered[confidence] += amount;
      if (entry.entry_type === "refund") totals[confidence] -= Math.abs(amount);
    }

    const openOpportunityCents = (opportunities ?? []).reduce((sum, row) => sum + Number(row.value_cents ?? 0), 0);
    const attention = (opportunities ?? []).slice(0, 3).map((row) => ({
      id: row.id,
      title: row.title,
      valueCents: Number(row.value_cents ?? 0),
      currency: row.currency ?? "USD",
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({
      organizationId: orgId,
      currency: (ledger?.[0]?.currency ?? opportunities?.[0]?.currency ?? "USD").toUpperCase(),
      totalsCents: totals,
      recoveredCents: recovered,
      openOpportunityCents,
      opportunityCount: opportunities?.length ?? 0,
      attention,
      integrations: connections ?? [],
      recentEvidence: (ledger ?? []).slice(0, 10),
      evidencePolicy: {
        verified: "Direct provider/payment/outcome evidence.",
        attributed: "Strong system linkage without direct payment causality.",
        estimated: "Modeled value only; never shown as booked revenue.",
        unknown: "Insufficient evidence; MAXX does not guess.",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load revenue evidence.";
    const status = /Not authenticated/i.test(message) ? 401 : /membership|organization/i.test(message) ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
