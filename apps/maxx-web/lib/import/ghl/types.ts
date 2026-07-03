import type { GhlObjectType, ImportFieldMapping, ImportValidationIssue } from "@/lib/types/imports";

export interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
}

export interface MappingSuggestion extends ImportFieldMapping {
  confidence: number;
}

export interface ImportRunResult {
  totalRecords: number;
  importedRecords: number;
  errorRecords: number;
  issues: ImportValidationIssue[];
}

export const TARGET_FIELDS_BY_OBJECT: Record<GhlObjectType, string[]> = {
  contacts: ["firstName", "lastName", "email", "phone", "tags", "status", "source"],
  opportunities: ["title", "value", "stageId", "contactId"],
  pipelines: ["name"],
  stages: ["name", "order", "pipelineId"],
  notes: ["contactId", "body", "authorName"],
  tasks: ["title", "dueDate", "assignee"],
  appointments: ["contactId", "startTime", "endTime"],
  conversations: ["contactId", "channel", "lastMessageAt"],
  tags: ["name"],
  custom_fields: ["name", "type"],
};
