import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = await params;
  const workflow = getStore().workflows.find((w) => w.id === workflowId);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found." }, { status: 404 });
  }
  return NextResponse.json({ workflow });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = await params;
  const store = getStore();
  const workflow = store.workflows.find((w) => w.id === workflowId);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found." }, { status: 404 });
  }
  const body = await request.json();
  if (body.status === "active" || body.status === "inactive" || body.status === "draft") {
    workflow.status = body.status;
    workflow.updatedAt = new Date().toISOString();
  }
  return NextResponse.json({ workflow });
}
