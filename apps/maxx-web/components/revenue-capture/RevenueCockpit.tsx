"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader } from "@/components/ui/Card";

interface Opportunity {
  id: string;
  title: string;
  contactName: string;
  value: number;
  currency: string;
  updatedAt: string;
}

interface PipelineResponse {
  opportunities?: Opportunity[];
  total?: number;
  error?: string;
}

export function RevenueCockpit({ showAttention = true }: { showAttention?: boolean }) {
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/pipeline?limit=100", { cache: "no-store" });
        const payload = (await response.json()) as PipelineResponse;
        if (!cancelled) setData(response.ok ? payload : { error: payload.error ?? "Could not load pipeline" });
      } catch {
        if (!cancelled) setData({ error: "Could not load pipeline" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    const timer = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const opportunities = data?.opportunities ?? [];
  const openValue = useMemo(
    () => opportunities.reduce((sum, opportunity) => sum + (Number.isFinite(opportunity.value) ? opportunity.value : 0), 0),
    [opportunities],
  );
  const attention = useMemo(
    () => [...opportunities].sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()).slice(0, 3),
    [opportunities],
  );

  if (loading) {
    return <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">Loading live business data…</div>;
  }

  if (data?.error) {
    return (
      <Card>
        <CardHeader title="Business data needs attention" description={data.error} />
        <p className="text-sm text-muted">MAXX is not substituting demo numbers. Check the business connection or ask Popebot what is unavailable.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Verified revenue" value="Connect evidence" helpText="Payments or closed-won evidence only" />
        <MetricCard label="Open opportunity value" value={formatMoney(openValue, opportunities[0]?.currency)} helpText={`${data?.total ?? opportunities.length} open opportunities`} />
        <MetricCard label="Recovered revenue" value="Awaiting ledger" helpText="Never inferred from pipeline value" />
        <MetricCard label="Needs attention" value={attention.length.toString()} helpText="Oldest-updated open opportunities" />
      </div>

      {showAttention && (
        <Card>
          <CardHeader
            title="Needs attention"
            description="The oldest-updated open opportunities are surfaced first. Popebot can explain the context before you act."
            action={<Link href="/app/pipeline" className="text-sm font-medium text-accent hover:underline">View pipeline</Link>}
          />
          {attention.length === 0 ? (
            <p className="text-sm text-muted">No open opportunities are available right now.</p>
          ) : (
            <div className="divide-y divide-border">
              {attention.map((opportunity) => (
                <div key={opportunity.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">{opportunity.title}</p>
                    <p className="text-sm text-muted">{opportunity.contactName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text">{formatMoney(opportunity.value, opportunity.currency)}</p>
                    <p className="text-xs text-muted">Last updated {formatDate(opportunity.updatedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function formatMoney(value: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `$${Math.round(value).toLocaleString()}`;
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
