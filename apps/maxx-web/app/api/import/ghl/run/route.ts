import { NextRequest, NextResponse } from "next/server";
import { ghlImportSchema } from "@/lib/validation/ghl-import";
import { runImport } from "@/lib/import/ghl/import-runner";
import { getStore } from "@/lib/data/store";
import { currentOrganization } from "@/lib/mock-data/organizations";
import type { ImportJob } from "@/lib/types/imports";
import type { ParsedCsv } from "@/lib/import/ghl/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = ghlImportSchema.safeParse({
    source: body.source,
    objects: body.objects,
    mappings: body.mappings,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid import request." }, { status: 400 });
  }

  const csv: ParsedCsv = { headers: body.headers ?? [], rows: body.rows ?? [] };
  const result = runImport(csv, parsed.data.mappings);

  const job: ImportJob = {
    id: `import_${Date.now()}`,
    organizationId: currentOrganization.id,
    source: parsed.data.source,
    objects: parsed.data.objects,
    status: "completed",
    totalRecords: result.totalRecords,
    importedRecords: result.importedRecords,
    errorRecords: result.errorRecords,
    mappings: parsed.data.mappings,
    issues: result.issues,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  const store = getStore();
  store.importJobs = [job, ...store.importJobs];

  return NextResponse.json({ job, result }, { status: 201 });
}
