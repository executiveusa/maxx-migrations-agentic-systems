import { NextRequest, NextResponse } from "next/server";
import { workflowSchema } from "@/lib/validation/workflow";
import { getStore } from "@/lib/data/store";
import { isSeedMode } from "@/lib/data/mode";
import { getCurrentOrgId, getSupabaseClient, supabaseErrorStatus } from "@/lib/data/supabase-client";
import { currentOrganization } from "@/lib/mock-data/organizations";
import type { Workflow, WorkflowStep, WorkflowStepType } from "@/lib/types/workflows";

/** Maps a maxx_workflows row (+ joined maxx_workflow_steps/maxx_workflow_runs) to the API's Workflow shape. */
function mapWorkflowRow(row: {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  template_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  maxx_workflow_steps?: Array<{
    id: string;
    workflow_id: string;
    type: string;
    label: string;
    config: Record<string, string>;
    step_order: number;
  }> | null;
  maxx_workflow_runs?: Array<{
    id: string;
    workflow_id: string;
    status: string;
    triggered_by: string;
    started_at: string;
    finished_at: string | null;
    steps_completed: number;
    steps_total: number;
  }> | null;
}): Workflow {
  const steps: WorkflowStep[] = (row.maxx_workflow_steps ?? [])
    .slice()
    .sort((a, b) => a.step_order - b.step_order)
    .map((s) => ({
      id: s.id,
      workflowId: s.workflow_id,
      type: s.type as WorkflowStepType,
      order: s.step_order,
      label: s.label,
      config: s.config ?? {},
    }));

  const runs = (row.maxx_workflow_runs ?? []).map((r) => ({
    id: r.id,
    workflowId: r.workflow_id,
    status: r.status as "success" | "failed" | "running",
    triggeredBy: r.triggered_by,
    startedAt: r.started_at,
    finishedAt: r.finished_at ?? undefined,
    stepsCompleted: r.steps_completed,
    stepsTotal: r.steps_total,
  }));

  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    description: row.description ?? "",
    templateId: row.template_id ?? undefined,
    status: row.status as "active" | "inactive" | "draft",
    steps,
    runs,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  if (isSeedMode()) {
    const { workflows } = getStore();
    return NextResponse.json({ workflows });
  }

  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();
    const { data, error } = await supabase
      .from("maxx_workflows")
      .select("*, maxx_workflow_steps(*), maxx_workflow_runs(*)")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: supabaseErrorStatus(error) });
    }

    const workflows = (data ?? []).map(mapWorkflowRow);
    return NextResponse.json({ workflows });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = workflowSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid workflow." }, { status: 400 });
  }

  if (isSeedMode()) {
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

  try {
    const supabase = getSupabaseClient();
    const orgId = getCurrentOrgId();
    const { name, description, templateId, steps } = parsed.data;

    const { data: workflowRow, error } = await supabase
      .from("maxx_workflows")
      .insert([
        {
          organization_id: orgId,
          name,
          description,
          template_id: templateId ?? null,
          status: "draft",
        },
      ])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: supabaseErrorStatus(error) });
    }

    const stepRows = steps.map((step, index) => ({
      organization_id: orgId,
      workflow_id: workflowRow.id,
      type: step.type,
      label: step.label,
      config: step.config,
      step_order: index + 1,
    }));

    const { data: insertedSteps, error: stepsError } = await supabase
      .from("maxx_workflow_steps")
      .insert(stepRows)
      .select("*");

    if (stepsError) {
      return NextResponse.json({ error: stepsError.message }, { status: supabaseErrorStatus(stepsError) });
    }

    const workflow = mapWorkflowRow({ ...workflowRow, maxx_workflow_steps: insertedSteps, maxx_workflow_runs: [] });
    return NextResponse.json({ workflow }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
