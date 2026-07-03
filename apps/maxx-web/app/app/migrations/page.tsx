import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getStore } from "@/lib/data/store";

export const metadata: Metadata = { title: "Migrations" };
export const dynamic = "force-dynamic";

const statusPillMap: Record<string, "pending" | "running" | "completed"> = {
  intake: "pending",
  crawling: "running",
  extracting: "running",
  designing: "running",
  review: "pending",
  ready_to_publish: "pending",
  published: "completed",
};

export default function MigrationsPage() {
  const { migrationJobs } = getStore();
  return (
    <>
      <PageHeader
        eyebrow="Migration engine"
        title="Migrations"
        description="Every website migration job, from intake to publish."
        actions={<Button href="/app/migrations/new">Start a migration</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {migrationJobs.map((job) => (
          <Link key={job.id} href={`/app/migrations/${job.id}`}>
            <Card className="h-full transition-colors hover:bg-surface-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="break-words font-display text-lg font-semibold text-text">{job.sourceUrl.replace(/^https?:\/\//, "")}</h3>
                  <p className="mt-1 text-sm text-muted">{job.pages.length} pages · {job.assets.length} assets</p>
                </div>
                <StatusPill status={statusPillMap[job.status] ?? "pending"} />
              </div>
              <p className="mt-4 text-xs text-muted">Design audit score: {job.designAuditScore}</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
