import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import type { WorkflowRun } from "@/lib/types/workflows";

export async function POST(request: NextRequest, { params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = await params;
  const store = getStore();
  const workflow = store.workflows.find((w) => w.id === workflowId);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found." }, { status: 404 });
  }
  if (workflow.status !== "active") {
    return NextResponse.json({ error: "Workflow must be active before it can run." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const now = new Date().toISOString();
  const run: WorkflowRun = {
    id: `run_${Date.now()}`,
    workflowId,
    status: "success",
    triggeredBy: body.triggeredBy ?? "Manual run",
    startedAt: now,
    finishedAt: now,
    stepsCompleted: workflow.steps.length,
    stepsTotal: workflow.steps.length,
  };

  workflow.runs = [run, ...workflow.runs];
  return NextResponse.json({ run }, { status: 201 });
}
