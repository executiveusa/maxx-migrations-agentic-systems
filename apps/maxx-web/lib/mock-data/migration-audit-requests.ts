import type { MigrationAuditRequest } from "@/lib/types/migration-audit-request";

/**
 * No seed rows — this store starts empty. Unlike the CRM/pipeline mock
 * data (which seeds demo content for the dashboard), audit requests are
 * real lead-capture submissions and should never open with synthetic entries.
 */
export const migrationAuditRequests: MigrationAuditRequest[] = [];
