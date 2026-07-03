export type MigrationJobStatus =
  | "intake"
  | "crawling"
  | "extracting"
  | "designing"
  | "review"
  | "ready_to_publish"
  | "published";

export interface MigrationPage {
  id: string;
  jobId: string;
  path: string;
  title: string;
  wordCount: number;
  status: "pending" | "extracted" | "rewritten" | "approved";
}

export interface MigrationAsset {
  id: string;
  jobId: string;
  type: "image" | "document" | "video";
  filename: string;
  sizeKb: number;
}

export interface MigrationTask {
  id: string;
  jobId: string;
  agent: string;
  label: string;
  status: "pending" | "running" | "completed";
  occurredAt: string;
}

export interface MigrationJob {
  id: string;
  organizationId: string;
  sourceUrl: string;
  status: MigrationJobStatus;
  pages: MigrationPage[];
  assets: MigrationAsset[];
  taskTimeline: MigrationTask[];
  designAuditScore: number;
  createdAt: string;
  updatedAt: string;
}
