import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { missedCallEvents } from "@/lib/mock-data/telephony";

const statusPillMap: Record<string, "connected" | "pending" | "setup_required" | "failed"> = {
  sent: "connected",
  opted_out: "pending",
  not_configured: "setup_required",
  failed: "failed",
};

export function MissedCallRecoveryArtifact() {
  const recovered = missedCallEvents.filter((e) => e.textBackSent).length;

  return (
    <Card>
      <h3 className="mb-1 font-display text-lg font-semibold text-text">Missed call recovery</h3>
      <p className="mb-4 text-sm text-muted">{recovered} of {missedCallEvents.length} missed calls recovered with an automatic text.</p>
      <ul className="space-y-2">
        {missedCallEvents.map((event) => (
          <li key={event.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
            <span className="text-text">{event.fromNumber}</span>
            <StatusPill status={statusPillMap[event.textBackStatus] ?? "pending"} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
