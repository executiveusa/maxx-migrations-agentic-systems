import type { MigrationJob, MigrationJobStatus } from "@/lib/types/migrations";
import { buildSeedCrawlPlan } from "@/lib/migration/crawler";

const STATUS_ORDER: MigrationJobStatus[] = [
  "intake",
  "crawling",
  "extracting",
  "designing",
  "review",
  "ready_to_publish",
  "published",
];

export function nextStatus(current: MigrationJobStatus): MigrationJobStatus {
  const index = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[Math.min(index + 1, STATUS_ORDER.length - 1)] ?? current;
}

export function createMigrationJob(sourceUrl: string, organizationId: string): MigrationJob {
  const plan = buildSeedCrawlPlan(sourceUrl);
  const now = new Date().toISOString();

  return {
    id: `job_${Date.now()}`,
    organizationId,
    sourceUrl,
    status: "intake",
    designAuditScore: 0,
    createdAt: now,
    updatedAt: now,
    pages: plan.pages.map((page, index) => ({
      id: `page_${Date.now()}_${index}`,
      jobId: `job_${Date.now()}`,
      path: page.path,
      title: page.title,
      wordCount: 0,
      status: "pending",
    })),
    assets: [],
    taskTimeline: [
      {
        id: `task_${Date.now()}`,
        jobId: `job_${Date.now()}`,
        agent: "Migration Agent",
        label: `Intake created for ${sourceUrl}`,
        status: "completed",
        occurredAt: now,
      },
    ],
  };
}
