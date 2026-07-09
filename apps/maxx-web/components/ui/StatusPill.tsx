import { Badge } from "@/components/ui/Badge";

type Status =
  | "active"
  | "inactive"
  | "draft"
  | "scheduled"
  | "published"
  | "completed"
  | "failed"
  | "pending"
  | "setup_required"
  | "connected"
  | "running"
  | "error"
  | "planned"
  | "blocked"
  | "archived"
  | "open"
  | "in_progress"
  | "cancelled"
  | "awaiting_approval"
  | "stopped";

const statusMap: Record<Status, { label: string; tone: "neutral" | "accent" | "warning" | "danger" | "info" }> = {
  active: { label: "Active", tone: "accent" },
  inactive: { label: "Inactive", tone: "neutral" },
  draft: { label: "Draft", tone: "neutral" },
  scheduled: { label: "Scheduled", tone: "info" },
  published: { label: "Published", tone: "accent" },
  completed: { label: "Completed", tone: "accent" },
  failed: { label: "Failed", tone: "danger" },
  pending: { label: "Pending", tone: "warning" },
  setup_required: { label: "Setup required", tone: "warning" },
  connected: { label: "Connected", tone: "accent" },
  running: { label: "Running", tone: "info" },
  error: { label: "Error", tone: "danger" },
  planned: { label: "Planned", tone: "neutral" },
  blocked: { label: "Blocked", tone: "danger" },
  archived: { label: "Archived", tone: "neutral" },
  open: { label: "Open", tone: "neutral" },
  in_progress: { label: "In progress", tone: "info" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  awaiting_approval: { label: "Awaiting approval", tone: "warning" },
  stopped: { label: "Stopped", tone: "neutral" },
};

export function StatusPill({ status }: { status: Status }) {
  const config = statusMap[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

export type { Status as StatusPillStatus };
