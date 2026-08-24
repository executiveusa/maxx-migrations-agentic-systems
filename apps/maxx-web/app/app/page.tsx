import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { AgentChat } from "@/components/agent-chat/AgentChat";
import { PipelineSnapshot } from "@/components/dashboard/PipelineSnapshot";
import { MissedCallSnapshot } from "@/components/dashboard/MissedCallSnapshot";
import { pipelineTotal, opportunities } from "@/lib/mock-data/pipeline";
import { missedCallEvents } from "@/lib/mock-data/telephony";
import { currentOrganization } from "@/lib/mock-data/organizations";

export const metadata: Metadata = { title: "Home" };

export default function DashboardPage() {
  const recoveredCalls = missedCallEvents.filter((event) => event.textBackSent).length;

  return (
    <>
      <PageHeader
        eyebrow="Revenue Capture OS"
        title={`Good to see you, ${currentOrganization.name}`}
        description="See what matters, handle exceptions, and ask Popebot about the business. MAXX keeps the machinery underneath out of your way."
        actions={<Button href="/app/pipeline">See pipeline</Button>}
      />

      <div className="space-y-6">
        <section aria-labelledby="money-heading">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 id="money-heading" className="font-display text-xl font-semibold text-text">Money</h2>
              <p className="text-sm text-muted">Verified revenue stays separate from estimates. No made-up ROI.</p>
            </div>
            <Button href="/app/revenue" variant="secondary">Open money view</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Verified revenue" value="Connect payments" helpText="Only paid/closed evidence counts here" />
            <MetricCard label="Open opportunity value" value={`$${pipelineTotal().toLocaleString()}`} helpText={`${opportunities.length} open opportunities`} />
            <MetricCard label="Missed calls recovered" value={recoveredCalls.toString()} helpText={`${missedCallEvents.length} missed-call events tracked`} />
            <MetricCard label="Needs attention" value={opportunities.length.toString()} helpText="Open opportunities to keep moving" />
          </div>
        </section>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border p-6">
            <CardHeader
              title="Ask Popebot"
              description="Ask in normal language. Popebot can inspect the business, explain what changed, and prepare safe next actions."
            />
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              <span className="rounded-full bg-surface-2 px-3 py-1">What needs me today?</span>
              <span className="rounded-full bg-surface-2 px-3 py-1">Which deals are going cold?</span>
              <span className="rounded-full bg-surface-2 px-3 py-1">What did MAXX recover?</span>
            </div>
          </div>
          <div className="h-[440px] p-4 sm:p-6">
            <AgentChat />
          </div>
        </Card>

        <section>
          <div className="mb-3">
            <h2 className="font-display text-xl font-semibold text-text">Needs attention</h2>
            <p className="text-sm text-muted">The system handles routine work. These views show the money-moving exceptions.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <PipelineSnapshot />
            <MissedCallSnapshot />
          </div>
        </section>
      </div>
    </>
  );
}
