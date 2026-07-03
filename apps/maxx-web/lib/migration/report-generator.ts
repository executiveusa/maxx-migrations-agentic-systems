import type { MigrationJob } from "@/lib/types/migrations";
import { summarizeAssets } from "@/lib/migration/asset-inventory";
import { runDesignAudit } from "@/lib/migration/design-auditor";

export interface MigrationReport {
  jobId: string;
  sourceUrl: string;
  pageCount: number;
  approvedPageCount: number;
  assetSummary: ReturnType<typeof summarizeAssets>;
  designAudit: ReturnType<typeof runDesignAudit>;
  generatedAt: string;
}

export function generateMigrationReport(job: MigrationJob): MigrationReport {
  return {
    jobId: job.id,
    sourceUrl: job.sourceUrl,
    pageCount: job.pages.length,
    approvedPageCount: job.pages.filter((p) => p.status === "approved").length,
    assetSummary: summarizeAssets(job.assets),
    designAudit: runDesignAudit(job.pages),
    generatedAt: new Date().toISOString(),
  };
}
