"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PaymentSummary } from "@/lib/restaurant-growth/ledger";

type Report = {
  status: string;
  source?: string;
  summary?: PaymentSummary;
  integrations?: Record<string, string>;
  period?: { begin: string; end: string };
  note?: string;
  error?: string;
  reason?: string;
};
const money = (cents: number) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD",
}).format(cents / 100);

export function RestaurantGrowthPanel() {
  const [report, setReport] = useState<Report | null>(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`/api/restaurant-growth/metrics?days=${days}`, {
          cache: "no-store", credentials: "same-origin",
        });
        const payload = await response.json() as Report;
        if (active) setReport(response.ok ? payload : { status: "UNAVAILABLE", reason: payload.reason || payload.error || "Unavailable" });
      } catch {
        if (active) setReport({ status: "UNAVAILABLE", reason: "Could not reach the server" });
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [days]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-accent">Client Zero · Bunna pilot</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text">Restaurant Revenue Proof</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Receipts first. Campaign claims second. Estimates stay clearly labeled until the baseline and control are confirmed.</p>
        </div>
        <label className="text-sm text-muted">Reporting window
          <select value={days} onChange={e => setDays(Number(e.target.value))}
            className="ml-3 min-h-11 rounded-lg border border-border bg-surface px-3 text-text" aria-label="Reporting window">
            <option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option>
          </select>
        </label>
      </div>
      {loading ? (
        <div role="status" className="rounded-2xl border border-border bg-surface p-8 text-muted">Checking authorized payment evidence…</div>
      ) : report?.status !== "CONNECTED" ? (
        <section className="rounded-2xl border border-border bg-surface p-6" aria-live="polite">
          <h3 className="font-display text-2xl font-semibold text-text">No verified POS connection yet</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {report?.status === "NOT_CONNECTED" ? "Square has not been authorized for this restaurant. No sales numbers are displayed or invented." :
              report?.reason || "The connection cannot currently be verified. No sales numbers are displayed."}
          </p>
          <p className="mt-4 text-xs text-muted">Supported first: Square completed payments (including recorded cash). Toast, Clover and Owner exports require separate approved integration work.</p>
        </section>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-live="polite">
          {[
            ["Recorded payment volume", money(report.summary?.amountCents ?? 0)],
            ["Completed payments", (report.summary?.paymentCount ?? 0).toLocaleString()],
            ["Recorded cash volume", money(report.summary?.cashCents ?? 0)],
            ["Campaign-attributed profit", "Not measured"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-3 font-display text-3xl font-semibold text-text">{value}</p>
            </div>
          ))}
          <p className="sm:col-span-2 xl:col-span-4 text-xs leading-5 text-muted">{report.summary?.caveat}</p>
        </section>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["1. Connect evidence", "Confirm the actual POS and obtain scoped, read-only consent. Keep customer identity outside reports."],
          ["2. Test one offer", "Get owner-approved meal, margin, capacity, tracking phrase, and a single distribution channel."],
          ["3. Reconcile results", "Match cash/card transactions with campaign references and a daypart comparison. Don't equate matched sales with lift."],
        ].map(([label, detail]) => (
          <div key={label} className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-semibold text-text">{label}</h3><p className="mt-3 text-sm leading-6 text-muted">{detail}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-surface-2 p-6">
        <h3 className="font-display text-2xl font-semibold text-text">Ask Popebot to prepare the next decision</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">The existing MACS Popebot chat is the operator assistant. It must use the scoped revenue tool for actual figures and require human approval before sending, spending or publishing.</p>
        <Link href="/app" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white">Open MACS Popebot</Link>
      </div>
    </div>
  );
}
