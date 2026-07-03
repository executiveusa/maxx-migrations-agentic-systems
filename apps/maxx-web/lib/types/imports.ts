export type GhlObjectType =
  | "contacts"
  | "opportunities"
  | "pipelines"
  | "stages"
  | "notes"
  | "tasks"
  | "appointments"
  | "conversations"
  | "tags"
  | "custom_fields";

export interface ImportFieldMapping {
  sourceField: string;
  targetField: string;
  required: boolean;
}

export interface ImportValidationIssue {
  row: number;
  field: string;
  message: string;
}

export interface ImportJob {
  id: string;
  organizationId: string;
  source: "csv" | "ghl_api";
  objects: GhlObjectType[];
  status: "mapping" | "validating" | "ready" | "running" | "completed" | "failed";
  totalRecords: number;
  importedRecords: number;
  errorRecords: number;
  mappings: ImportFieldMapping[];
  issues: ImportValidationIssue[];
  createdAt: string;
  completedAt?: string;
}
