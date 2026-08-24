import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { MissedCallSnapshot } from "@/components/dashboard/MissedCallSnapshot";

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
            description="Web, SMS, WhatsApp, email, and phone should converge here as each channel is connected. Unconnected channels stay clearly marked instead of pretending to be live."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Channel label="Web" state="Ready for intake" />
            <Channel label="SMS" state="Via configured provider" />
            <Channel label="WhatsApp" state="Connect when needed" />
            <Channel label="Email" state="Connect when needed" />
            <Channel label="Phone" state="Missed-call recovery available" />
          </div>
        </Card>

        <MissedCallSnapshot />

        <Card>
          <CardHeader
            title="Popebot handles the complexity"
            description="The owner can ask who needs a reply, which conversations are tied to high-value opportunities, or what can be followed up automatically."
          />
          <p className="text-sm text-muted">
            Consequential sends and actions remain behind the existing MAXX approval boundary. Routine approved workflows can be automated without turning the owner into middleware.
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
