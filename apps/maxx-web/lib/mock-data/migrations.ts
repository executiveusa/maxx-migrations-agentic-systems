import type { MigrationJob } from "@/lib/types/migrations";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export const migrationJobs: MigrationJob[] = [
  {
    id: "job_1",
    organizationId: orgId,
    sourceUrl: "https://old-riversidemutualaid.squarespace.com",
    status: "ready_to_publish",
    designAuditScore: 82,
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-06-15T00:00:00.000Z",
    pages: [
      { id: "page_1", jobId: "job_1", path: "/", title: "Home", wordCount: 420, status: "approved" },
      { id: "page_2", jobId: "job_1", path: "/about", title: "About Us", wordCount: 610, status: "approved" },
      { id: "page_3", jobId: "job_1", path: "/donate", title: "Donate", wordCount: 280, status: "approved" },
      { id: "page_4", jobId: "job_1", path: "/volunteer", title: "Volunteer", wordCount: 350, status: "rewritten" },
      { id: "page_5", jobId: "job_1", path: "/contact", title: "Contact", wordCount: 120, status: "extracted" },
    ],
    assets: [
      { id: "asset_1", jobId: "job_1", type: "image", filename: "hero-kitchen.jpg", sizeKb: 840 },
      { id: "asset_2", jobId: "job_1", type: "image", filename: "volunteer-group.jpg", sizeKb: 612 },
      { id: "asset_3", jobId: "job_1", type: "document", filename: "annual-report-2025.pdf", sizeKb: 2100 },
    ],
    taskTimeline: [
      { id: "task_1", jobId: "job_1", agent: "Migration Agent", label: "Crawled 5 pages from source site", status: "completed", occurredAt: "2026-05-01T09:00:00.000Z" },
      { id: "task_2", jobId: "job_1", agent: "Copy Agent", label: "Rewrote homepage and donate page copy", status: "completed", occurredAt: "2026-05-04T09:00:00.000Z" },
      { id: "task_3", jobId: "job_1", agent: "QA Agent", label: "Ran design audit against sovereign dark theme", status: "completed", occurredAt: "2026-06-15T09:00:00.000Z" },
      { id: "task_4", jobId: "job_1", agent: "Migration Agent", label: "Awaiting publish approval", status: "pending", occurredAt: "2026-06-15T09:05:00.000Z" },
    ],
  },
  {
    id: "job_2",
    organizationId: orgId,
    sourceUrl: "https://youtharts-northwest.wixsite.com/home",
    status: "crawling",
    designAuditScore: 0,
    createdAt: "2026-07-02T00:00:00.000Z",
    updatedAt: "2026-07-02T00:00:00.000Z",
    pages: [
      { id: "page_6", jobId: "job_2", path: "/", title: "Home", wordCount: 300, status: "pending" },
    ],
    assets: [],
    taskTimeline: [
      { id: "task_5", jobId: "job_2", agent: "Migration Agent", label: "Crawl started", status: "running", occurredAt: "2026-07-02T08:00:00.000Z" },
    ],
  },
];

export function getMigrationJobById(id: string): MigrationJob | undefined {
  return migrationJobs.find((j) => j.id === id);
}
