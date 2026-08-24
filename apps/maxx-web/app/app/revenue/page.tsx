import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { RevenueCockpit } from "@/components/revenue-capture/RevenueCockpit";

export const metadata: Metadata = { title: "Money" };

export default function RevenuePage() {
  return (
    <>
      <PageHeader
        eyebrow="Revenue Capture OS"
        title="Money"
        description="One place to see open opportunity value now and, as evidence sources are connected, verified and recovered revenue without mixing estimates into actual results."
      />

      <div className="space-y-6">
        <RevenueCockpit showAttention={false} />

        <Card>
          <CardHeader
            title="Value Ledger"
            description="MAXX keeps verified, attributed, estimated, and unknown value separate so assumptions never become revenue claims."
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
            title="You do not configure this"
            description="MAXX connects the available sources, reconciles the customer journey, and asks only when a material fact cannot be resolved safely."
          />
          <ol className="space-y-3 text-sm text-text">
            <li><strong>1.</strong> Capture the lead or customer event.</li>
            <li><strong>2.</strong> Track response, booking, quote, follow-up, and recovery actions.</li>
            <li><strong>3.</strong> Attach payment or outcome evidence when available.</li>
            <li><strong>4.</strong> Show only the value class the evidence supports.</li>
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
