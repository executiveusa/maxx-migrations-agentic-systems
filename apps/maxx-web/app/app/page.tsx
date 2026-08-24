import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { AgentChat } from "@/components/agent-chat/AgentChat";
import { RevenueCockpit } from "@/components/revenue-capture/RevenueCockpit";

export const metadata: Metadata = { title: "Home" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Revenue Capture OS"
        title="Your business, without the software maze"
        description="See the money, handle what genuinely needs you, and ask Popebot in normal language. MAXX keeps the machinery underneath out of your way."
        actions={<Button href="/app/pipeline">See pipeline</Button>}
      />

      <div className="space-y-6">
        <section aria-labelledby="money-heading">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 id="money-heading" className="font-display text-xl font-semibold text-text">Money</h2>
              <p className="text-sm text-muted">Live tenant data. Verified revenue stays separate from estimates.</p>
            </div>
            <Button href="/app/revenue" variant="secondary">Open money view</Button>
          </div>
          <RevenueCockpit />
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
              <span className="rounded-full bg-surface-2 px-3 py-1">What can you handle for me?</span>
            </div>
          </div>
          <div className="h-[440px] p-4 sm:p-6">
            <AgentChat />
          </div>
        </Card>
      </div>
    </>
  );
}
