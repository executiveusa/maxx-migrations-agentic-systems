import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { nextStatus } from "@/lib/migration/migration-runner";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const job = getStore().migrationJobs.find((j) => j.id === jobId);
  if (!job) {
    return NextResponse.json({ error: "Migration job not found." }, { status: 404 });
  }
  return NextResponse.json({ job });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const store = getStore();
  const job = store.migrationJobs.find((j) => j.id === jobId);
  if (!job) {
    return NextResponse.json({ error: "Migration job not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  job.status = body.advance ? nextStatus(job.status) : job.status;
  job.updatedAt = new Date().toISOString();

  return NextResponse.json({ job });
}
