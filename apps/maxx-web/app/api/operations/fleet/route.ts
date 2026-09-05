import { NextResponse } from "next/server";
import { getCurrentUser, getSupabaseAuth } from "@/lib/auth/supabase-auth";
import { getSupabaseClient } from "@/lib/data/supabase-client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const authClient = await getSupabaseAuth();
    const { data: operator, error: operatorError } = await authClient
      .from("maxx_platform_operators")
      .select("role, active")
      .eq("user_id", user.id)
      .maybeSingle();
    if (operatorError) throw new Error(operatorError.message);
    if (!operator?.active) return NextResponse.json({ error: "Operator access required" }, { status: 403 });

    // Cross-client aggregation requires service-role access, but only after an authenticated
    // platform-operator row is verified above. Normal clients never reach this client.
    const admin = getSupabaseClient();
    const { data: organizations, error: orgError } = await admin
      .from("maxx_organizations")
      .select("id, name, slug, plan")
      .order("name");
    if (orgError) throw new Error(orgError.message);

    const fleet = [];
    for (const org of organizations ?? []) {
      const [{ data: connections }, { data: ledger }, { data: opportunities }] = await Promise.all([
        admin
          .from("maxx_integration_connections")
          .select("provider, status, last_verified_at, last_event_at, health_message")
          .eq("organization_id", org.id),
        admin
          .from("maxx_value_ledger_entries")
          .select("entry_type, amount_cents, confidence")
          .eq("organization_id", org.id),
        admin
          .from("maxx_opportunities")
          .select("id, value_cents, updated_at")
          .eq("organization_id", org.id),
      ]);

      let verifiedRevenueCents = 0;
      let attributedRevenueCents = 0;
      for (const entry of ledger ?? []) {
        if (!["payment", "booked_revenue", "recovered_revenue"].includes(entry.entry_type)) continue;
        if (entry.confidence === "VERIFIED") verifiedRevenueCents += Number(entry.amount_cents ?? 0);
        if (entry.confidence === "ATTRIBUTED") attributedRevenueCents += Number(entry.amount_cents ?? 0);
      }
      const openOpportunityCents = (opportunities ?? []).reduce((sum, row) => sum + Number(row.value_cents ?? 0), 0);
      const connected = (connections ?? []).filter((row) => row.status === "connected").length;
      const unhealthy = (connections ?? []).filter((row) => row.status === "error" || Boolean(row.health_message)).length;
      const staleCutoff = Date.now() - 7 * 86400000;
      const riskCount = (opportunities ?? []).filter((row) => new Date(row.updated_at).getTime() < staleCutoff).length;

      fleet.push({
        organization: org,
        verifiedRevenueCents,
        attributedRevenueCents,
        openOpportunityCents,
        opportunityCount: opportunities?.length ?? 0,
        riskCount,
        integrations: { total: connections?.length ?? 0, connected, unhealthy },
        providers: connections ?? [],
      });
    }

    return NextResponse.json({ operatorRole: operator.role, organizations: fleet });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load fleet." },
      { status: 500 },
    );
  }
}
