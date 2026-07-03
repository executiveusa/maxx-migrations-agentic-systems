import type { ImportJob } from "@/lib/types/imports";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export const importJobs: ImportJob[] = [
  {
    id: "import_1",
    organizationId: orgId,
    source: "csv",
    objects: ["contacts", "opportunities", "notes", "tags"],
    status: "completed",
    totalRecords: 214,
    importedRecords: 209,
    errorRecords: 5,
    mappings: [
      { sourceField: "Full Name", targetField: "firstName+lastName", required: true },
      { sourceField: "Email", targetField: "email", required: true },
      { sourceField: "Phone", targetField: "phone", required: false },
      { sourceField: "Pipeline Stage", targetField: "stageId", required: true },
    ],
    issues: [
      { row: 42, field: "Email", message: "Missing email address." },
      { row: 88, field: "Pipeline Stage", message: "Stage \"Cold\" does not match any known stage." },
    ],
    createdAt: "2026-06-20T09:00:00.000Z",
    completedAt: "2026-06-20T09:12:00.000Z",
  },
];

export const csvSampleHeaders = [
  "Full Name",
  "Email",
  "Phone",
  "Pipeline Stage",
  "Tags",
  "Notes",
  "Created Date",
];

export function getImportJobById(id: string): ImportJob | undefined {
  return importJobs.find((j) => j.id === id);
}
