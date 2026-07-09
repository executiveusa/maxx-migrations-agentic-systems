import type { ImportFieldMapping } from "@/lib/types/imports";
import type { ImportRunResult, ParsedCsv } from "@/lib/import/ghl/types";
import { validateRecords } from "@/lib/import/ghl/validator";

export function runImport(csv: ParsedCsv, mappings: ImportFieldMapping[]): ImportRunResult {
  const issues = validateRecords(csv, mappings);
  const errorRows = new Set(issues.map((i) => i.row));
  const totalRecords = csv.rows.length;
  const errorRecords = errorRows.size;
  const importedRecords = totalRecords - errorRecords;

  return {
    totalRecords,
    importedRecords,
    errorRecords,
    issues,
  };
}

export function toErrorCsv(csv: ParsedCsv, result: ImportRunResult): string {
  const header = "row,field,message";
  const lines = result.issues.map((issue) => `${issue.row},"${issue.field}","${issue.message}"`);
  return [header, ...lines].join("\n");
}
