import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { pipelineTotal, opportunities } from "@/lib/mock-data/pipeline";
import { missedCallEvents } from "@/lib/mock-data/telephony";

export const metadata: Metadata = { title: "Money" };

export default function RevenuePage() {
  const recoveredCalls = missedCallEvents.filter((event) => event.textBackSent).length;

  return (
    <>
      <PageHeader
        eyebrow="Revenue Capture OS"
        title="Money"
        description="One place to see verified revenue, recoveries, open opportunity value, and the evidence behind every number."
      />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Verified revenue" value="Not connected" helpText="Requires payment or closed-won evidence" />
          <MetricCard label="Recovered revenue" value="Not verified yet" helpText="Recovery attribution must include evidence" />
          <MetricCard label="Open opportunity value" value={`$${pipelineTotal().toLocaleString()}`} helpText={`${opportunities.length} open opportunities`} />
          <MetricCard label="Recovered calls" value={recoveredCalls.toString()} helpText="Missed calls with a text-back sent" />
        </div>

        <Card>
          <CardHeader
            title="Value Ledger"
            description="MAXX will keep verified, attributed, estimated, and unknown value separate so the dashboard never turns assumptions into revenue claims."
          />
          <div className="grid gap-3 md:grid-cols-2">
            <ValueRow label="Verified" description="Payment, invoice, or closed-won evidence." />
            <ValueRow label="Attributed" description="Strong system linkage without direct payment evidence." />
            <ValueRow label="Estimated" description="Modeled opportunity value, clearly labeled." />
            <ValueRow label="Unknown" description="Not enough evidence yet. MAXX does not guess." />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="What happens next"
            description="The client should not configure attribution. MAXX connects the available sources, reconciles the journey, and asks only when a material fact cannot be resolved safely."
          />
          <ol className="space-y-3 text-sm text-text">
            <li><strong>1.</strong> Capture the lead or customer event.</li>
            <li><strong>2.</strong> Track the response, booking, quote, follow-up, and recovery actions.</li>
            <li><strong>3.</strong> Attach payment or outcome evidence when available.</li>
            <li><strong>4.</strong> Show the owner only the value class the evidence supports.</li>
          </ol>
        </Card>
      </div>
    </>
  );
}

function ValueRow({ label, description }: { label: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <p className="font-semibold text-text">{label}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}
