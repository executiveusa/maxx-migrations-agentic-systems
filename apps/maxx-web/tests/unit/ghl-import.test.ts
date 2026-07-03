import { describe, expect, it } from "vitest";
import { parseCsv } from "@/lib/import/ghl/csv-parser";
import { suggestMappings } from "@/lib/import/ghl/mapper";
import { validateRecords } from "@/lib/import/ghl/validator";
import { runImport } from "@/lib/import/ghl/import-runner";

const SAMPLE_CSV = `Full Name,Email,Phone,Pipeline Stage\nAlicia Ferreira,alicia@example.org,+15035550001,New Lead\nMarcus Lee,,+15035550002,Contacted`;

describe("csv-parser", () => {
  it("parses headers and rows", () => {
    const parsed = parseCsv(SAMPLE_CSV);
    expect(parsed.headers).toEqual(["Full Name", "Email", "Phone", "Pipeline Stage"]);
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.rows[0]?.Email).toBe("alicia@example.org");
  });

  it("returns an empty result for blank input", () => {
    expect(parseCsv("")).toEqual({ headers: [], rows: [] });
  });
});

describe("mapper.suggestMappings", () => {
  it("maps known header aliases to contact fields", () => {
    const mappings = suggestMappings(["Full Name", "Email", "Unknown Column"], "contacts");
    const emailMapping = mappings.find((m) => m.sourceField === "Email");
    const unknownMapping = mappings.find((m) => m.sourceField === "Unknown Column");
    expect(emailMapping?.targetField).toBe("email");
    expect(emailMapping?.confidence).toBeGreaterThan(0);
    expect(unknownMapping?.targetField).toBe("");
  });
});

describe("validator + import-runner", () => {
  it("flags rows missing a required mapped field", () => {
    const csv = parseCsv(SAMPLE_CSV);
    const mappings = [
      { sourceField: "Full Name", targetField: "firstName+lastName", required: true },
      { sourceField: "Email", targetField: "email", required: true },
    ];

    const issues = validateRecords(csv, mappings);
    expect(issues.some((i) => i.field === "Email")).toBe(true);

    const result = runImport(csv, mappings);
    expect(result.totalRecords).toBe(2);
    expect(result.errorRecords).toBe(1);
    expect(result.importedRecords).toBe(1);
  });
});
