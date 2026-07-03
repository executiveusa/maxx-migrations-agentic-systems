import { NextRequest, NextResponse } from "next/server";
import { migrationJobSchema } from "@/lib/validation/migration-job";
import { createMigrationJob } from "@/lib/migration/migration-runner";
import { getStore } from "@/lib/data/store";
import { currentOrganization } from "@/lib/mock-data/organizations";

export async function GET() {
  const { migrationJobs } = getStore();
  return NextResponse.json({ jobs: migrationJobs });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = migrationJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid migration request." }, { status: 400 });
  }

  const job = createMigrationJob(parsed.data.sourceUrl, currentOrganization.id);
  const store = getStore();
  store.migrationJobs = [job, ...store.migrationJobs];

  return NextResponse.json({ job }, { status: 201 });
}
