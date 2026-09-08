"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";

interface ProviderHealth {
  provider: string;
  status: string;
  last_verified_at?: string | null;
  last_event_at?: string | null;
  health_message?: string | null;
}

interface FleetOrg {
  organization: { id: string; name: string; slug: string; plan: string };
  verifiedRevenueCents: number;
  attributedRevenueCents: number;
  openOpportunityCents: number;
  opportunityCount: number;
  riskCount: number;
  integrations: { total: number; connected: number; unhealthy: number };
  providers: ProviderHealth[];
}

interface FleetResponse {
  operatorRole?: string;
  organizations?: FleetOrg[];
  error?: string;
}

export default function OperationsPage() {
  const [data, setData] = useState<FleetResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/operations/fleet", { cache: "no-store" });
        const payload = (await response.json()) as FleetResponse;
        if (!cancelled) setData(response.ok ? payload : { error: payload.error ?? "Could not load fleet" });
      } catch {
        if (!cancelled) setData({ error: "Could not load fleet" });
      }
    }
    void load();
    const timer = window.setInterval(load, 30_000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  const organizations = data?.organizations ?? [];
  const totals = useMemo(() => organizations.reduce((acc, row) => ({
    verified: acc.verified + row.verifiedRevenueCents,
    attributed: acc.attributed + row.attributedRevenueCents,
    open: acc.open + row.openOpportunityCents,
    risks: acc.risks + row.riskCount,
  }), { verified: 0, attributed: 0, open: 0, risks: 0 }), [organizations]);

  return (
    <>
      <PageHeader
        eyebrow="MAXX Operations"
        title="Fleet"
        description="Cross-client health for authorized MAXX operators. Client users cannot access this surface."
      />
      {!data ? <Card><p className="text-sm text-muted">Loading fleet…</p></Card> : data.error ? (
        <Card><CardHeader title="Operator access unavailable" description={data.error} /></Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Metric label="Verified revenue" value={money(totals.verified)} />
            <Metric label="Attributed" value={money(totals.attributed)} />
            <Metric label="Open pipeline" value={money(totals.open)} />
            <Metric label="Needs attention" value={String(totals.risks)} />
          </div>
          <div className="space-y-4">
            {organizations.map((row) => (
              <Card key={row.organization.id}>
                <CardHeader title={row.organization.name} description={`${row.organization.plan} · ${row.opportunityCount} opportunities`} />
                <div className="grid gap-4 md:grid-cols-4 text-sm">
                  <Stat label="Verified" value={money(row.verifiedRevenueCents)} />
                  <Stat label="Attributed" value={money(row.attributedRevenueCents)} />
                  <Stat label="Open" value={money(row.openOpportunityCents)} />
                  <Stat label="Risk" value={String(row.riskCount)} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {row.providers.length === 0 ? <span className="text-xs text-muted">No provider records</span> : row.providers.map((provider) => (
                    <span key={provider.provider} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                      {provider.provider}: {provider.status}{provider.health_message ? " · attention" : ""}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card><p className="text-xs uppercase tracking-wide text-muted">{label}</p><p className="mt-2 text-2xl font-semibold text-text">{value}</p></Card>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-muted">{label}</p><p className="font-semibold text-text">{value}</p></div>;
}
function money(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100); }
