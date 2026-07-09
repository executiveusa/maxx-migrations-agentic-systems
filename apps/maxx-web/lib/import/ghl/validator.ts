import type { ImportFieldMapping, ImportValidationIssue } from "@/lib/types/imports";
import type { ParsedCsv } from "@/lib/import/ghl/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRecords(
  csv: ParsedCsv,
  mappings: ImportFieldMapping[],
): ImportValidationIssue[] {
  const issues: ImportValidationIssue[] = [];
  const requiredMappings = mappings.filter((m) => m.required && m.targetField);

  csv.rows.forEach((row, index) => {
    const rowNumber = index + 2; // account for header row, 1-indexed

    for (const mapping of requiredMappings) {
      const value = row[mapping.sourceField]?.trim();
      if (!value) {
        issues.push({
          row: rowNumber,
          field: mapping.sourceField,
          message: `Missing required value for "${mapping.targetField}".`,
        });
      }
    }

    const emailMapping = mappings.find((m) => m.targetField === "email");
    if (emailMapping) {
      const emailValue = row[emailMapping.sourceField]?.trim();
      if (emailValue && !EMAIL_PATTERN.test(emailValue)) {
        issues.push({
          row: rowNumber,
          field: emailMapping.sourceField,
          message: `"${emailValue}" is not a valid email address.`,
        });
      }
    }
  });

  return issues;
}
