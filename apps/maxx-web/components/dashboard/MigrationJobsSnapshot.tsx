import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { migrationJobs } from "@/lib/mock-data/migrations";

const statusToPill: Record<string, "running" | "pending" | "completed"> = {
  intake: "pending",
  crawling: "running",
  extracting: "running",
  designing: "running",
  review: "pending",
  ready_to_publish: "pending",
  published: "completed",
};

export function MigrationJobsSnapshot() {
  return (
    <Card>
      <CardHeader
        title="Migration jobs"
        description="Website migrations currently in flight"
        action={<Link href="/app/migrations" className="text-sm text-accent">View all</Link>}
      />
      <ul className="space-y-3">
        {migrationJobs.map((job) => (
          <li key={job.id}>
            <Link
              href={`/app/migrations/${job.id}`}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface-2"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-medium text-text">{job.sourceUrl.replace(/^https?:\/\//, "")}</p>
                <p className="text-xs text-muted">{job.pages.length} pages · design score {job.designAuditScore}</p>
              </div>
              <StatusPill status={statusToPill[job.status] ?? "pending"} />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
