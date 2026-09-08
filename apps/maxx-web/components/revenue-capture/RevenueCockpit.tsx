"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader } from "@/components/ui/Card";
import type { CurrencySummary } from "@/lib/revenue-capture/value-summary";
interface AttentionItem { id: string; title: string; valueCents: number; currency: string; updatedAt: string }
interface RevenueSummary { currencies?: CurrencySummary[]; pipelineByCurrency?: Record<string,number>; opportunityCount?: number; attention?: AttentionItem[]; error?: string }
function money(valueCents: number, currency: string) { return new Intl.NumberFormat("en-US", { style:"currency", currency, maximumFractionDigits:0 }).format(valueCents/100); }
function values(selector: (value: CurrencySummary) => number, currencies: CurrencySummary[]) {
  if (!currencies.length) return "No evidence";
  return currencies.map((row)=>money(selector(row),row.currency)).join(" · ");
}
export function RevenueCockpit({showAttention=true}:{showAttention?:boolean}) {
  const [data,setData]=useState<RevenueSummary|null>(null);
  useEffect(()=>{let cancelled=false; async function load(){try{const response=await fetch("/api/revenue/summary",{cache:"no-store"});const payload=await response.json() as RevenueSummary;if(!cancelled)setData(response.ok?payload:{error:payload.error??"Could not load revenue evidence"});}catch{if(!cancelled)setData({error:"Could not load revenue evidence"});}} void load();const timer=window.setInterval(load,30000);return()=>{cancelled=true;window.clearInterval(timer);};},[]);
  if(!data)return <Card><p className="text-sm text-muted">Loading evidence…</p></Card>;
  if(data.error)return <Card><CardHeader title="Business data needs attention" description={data.error}/><p className="text-sm text-muted">MAXX will not substitute demo numbers.</p></Card>;
  const currencies=data.currencies??[];const attention=data.attention??[];
  const cash=values((row)=>row.totalsCents.VERIFIED,currencies);
  const recovered=values((row)=>row.recoveredCents.VERIFIED,currencies);
  const pipeline=Object.entries(data.pipelineByCurrency??{}).map(([currency,value])=>money(value,currency)).join(" · ")||"No evidence";
  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="Verified net payments" value={cash} helpText="Payment evidence less refunds; bookings not added"/><MetricCard label="Open opportunity value" value={pipeline} helpText={`${data.opportunityCount??0} opportunities; not revenue`}/><MetricCard label="Recovery classifications" value={recovered} helpText="Non-additive; not independently proven incremental revenue"/><MetricCard label="Needs attention" value={String(attention.length)} helpText="Oldest-updated open opportunities"/></div>{showAttention&&<Card><CardHeader title="Needs attention" description="Popebot can explain the evidence before you act." action={<Link href="/app/pipeline" className="text-sm font-medium text-accent hover:underline">View pipeline</Link>}/>{attention.length===0?<p className="text-sm text-muted">No open opportunities are available right now.</p>:<div className="divide-y divide-border">{attention.map((item)=><div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="font-medium text-text">{item.title}</p><p className="text-xs text-muted">Last updated {new Date(item.updatedAt).toLocaleDateString()}</p></div><p className="font-semibold text-text">{money(item.valueCents,item.currency)}</p></div>)}</div>}</Card>}</div>;
}
