import { NextRequest, NextResponse } from "next/server";
import { workflowSchema } from "@/lib/validation/workflow";
import { getStore } from "@/lib/data/store";
import { currentOrganization } from "@/lib/mock-data/organizations";
import type { Workflow } from "@/lib/types/workflows";

export async function GET() {
  const { workflows } = getStore();
  return NextResponse.json({ workflows });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = workflowSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid workflow." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const workflowId = `wf_${Date.now()}`;
  const workflow: Workflow = {
    id: workflowId,
    organizationId: currentOrganization.id,
    name: parsed.data.name,
    description: parsed.data.description,
    templateId: parsed.data.templateId,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    runs: [],
    steps: parsed.data.steps.map((step, index) => ({
      id: `step_${Date.now()}_${index}`,
      workflowId,
      order: index + 1,
      ...step,
    })),
  };

  const store = getStore();
  store.workflows = [workflow, ...store.workflows];
  return NextResponse.json({ workflow }, { status: 201 });
}
