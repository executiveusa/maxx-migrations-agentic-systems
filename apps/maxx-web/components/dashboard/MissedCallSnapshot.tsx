import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { missedCallEvents } from "@/lib/mock-data/telephony";

const statusPillMap: Record<string, "connected" | "pending" | "setup_required" | "failed"> = {
  sent: "connected",
  opted_out: "pending",
  not_configured: "setup_required",
  failed: "failed",
};

export function MissedCallSnapshot() {
  return (
    <Card>
      <CardHeader
        title="Missed calls"
        description="Recent recovery attempts"
        action={<Link href="/app/missed-calls" className="text-sm text-accent">Open missed calls</Link>}
      />
      <ul className="space-y-2">
        {missedCallEvents.map((event) => (
          <li key={event.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
            <span className="text-sm text-text">{event.fromNumber}</span>
            <StatusPill status={statusPillMap[event.textBackStatus] ?? "pending"} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
