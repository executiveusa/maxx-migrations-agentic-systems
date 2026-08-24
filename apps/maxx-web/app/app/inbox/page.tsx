import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Inbox" };

export default function InboxPage() {
  return (
    <>
      <PageHeader
        eyebrow="Revenue Capture OS"
        title="Inbox"
        description="Customer conversations belong in one operating view. MAXX handles routine routing and keeps exceptions visible."
        actions={<Button href="/app">Ask Popebot</Button>}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader
            title="One inbox, not five apps"
            description="Web, SMS, WhatsApp, email, and phone converge here as each channel is actually connected. Unconnected channels stay clearly marked instead of pretending to be live."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Channel label="Web" state="Intake supported" />
            <Channel label="SMS" state="Provider connection required" />
            <Channel label="WhatsApp" state="Not assumed connected" />
            <Channel label="Email" state="Not assumed connected" />
            <Channel label="Phone" state="Voice/recovery routes available" />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Popebot handles the complexity"
            description="Ask who needs a reply, which conversations are tied to high-value opportunities, or what can be followed up automatically."
          />
          <p className="text-sm text-muted">
            This surface does not manufacture a fake unified message feed before the channel adapters are wired. Consequential sends remain behind the MAXX approval boundary; routine approved workflows can run without turning the owner into middleware.
          </p>
        </Card>
      </div>
    </>
  );
}

function Channel({ label, state }: { label: string; state: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <p className="font-semibold text-text">{label}</p>
      <p className="mt-1 text-xs text-muted">{state}</p>
    </div>
  );
}
