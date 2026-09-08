"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader } from "@/components/ui/Card";

interface AttentionItem {
  id: string;
  title: string;
  valueCents: number;
  currency: string;
  updatedAt: string;
}

interface RevenueSummary {
  currency?: string;
  totalsCents?: { VERIFIED?: number; ATTRIBUTED?: number; ESTIMATED?: number; UNKNOWN?: number };
  recoveredCents?: { VERIFIED?: number; ATTRIBUTED?: number; ESTIMATED?: number; UNKNOWN?: number };
  openOpportunityCents?: number;
  opportunityCount?: number;
  attention?: AttentionItem[];
  error?: string;
}

export function RevenueCockpit({ showAttention = true }: { showAttention?: boolean }) {
  const [data, setData] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/revenue/summary", { cache: "no-store" });
        const payload = (await response.json()) as RevenueSummary;
        if (!cancelled) setData(response.ok ? payload : { error: payload.error ?? "Could not load revenue evidence" });
      } catch {
        if (!cancelled) setData({ error: "Could not load revenue evidence" });
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

  if (loading) {
    return <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">Loading live evidence…</div>;
  }

  if (data?.error) {
    return (
      <Card>
        <CardHeader title="Business data needs attention" description={data.error} />
        <p className="text-sm text-muted">MAXX will not substitute demo numbers. Check authentication and provider connections or ask Popebot what is unavailable.</p>
      </Card>
    );
  }

  const currency = data?.currency ?? "USD";
  const verified = Number(data?.totalsCents?.VERIFIED ?? 0);
  const recoveredVerified = Number(data?.recoveredCents?.VERIFIED ?? 0);
  const attention = data?.attention ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Verified revenue" value={formatMoneyCents(verified, currency)} helpText="Provider/payment/outcome evidence only" />
        <MetricCard label="Open opportunity value" value={formatMoneyCents(Number(data?.openOpportunityCents ?? 0), currency)} helpText={`${data?.opportunityCount ?? 0} open opportunities`} />
        <MetricCard label="Recovered revenue" value={formatMoneyCents(recoveredVerified, currency)} helpText="Verified recovery entries only" />
        <MetricCard label="Needs attention" value={attention.length.toString()} helpText="Oldest-updated open opportunities" />
      </div>

      {showAttention && (
        <Card>
          <CardHeader
            title="Needs attention"
            description="The oldest-updated open opportunities are surfaced first. Popebot can explain the evidence before you act."
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
                    <p className="text-xs text-muted">Last updated {formatDate(opportunity.updatedAt)}</p>
                  </div>
                  <p className="font-semibold text-text">{formatMoneyCents(opportunity.valueCents, opportunity.currency)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function formatMoneyCents(valueCents: number, currency = "USD") {
  const value = valueCents / 100;
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
