export type WorkflowStepType =
  | "trigger"
  | "condition"
  | "wait"
  | "send_email"
  | "send_sms"
  | "create_task"
  | "update_contact"
  | "move_pipeline_stage"
  | "notify_user"
  | "webhook"
  | "ai_generate"
  | "human_approval";

export interface WorkflowStep {
  id: string;
  workflowId: string;
  type: WorkflowStepType;
  order: number;
  label: string;
  config: Record<string, string>;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: "success" | "failed" | "running";
  triggeredBy: string;
  startedAt: string;
  finishedAt?: string;
  stepsCompleted: number;
  stepsTotal: number;
}

export interface Workflow {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  templateId?: string;
  status: "active" | "inactive" | "draft";
  steps: WorkflowStep[];
  runs: WorkflowRun[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: Array<{ type: WorkflowStepType; label: string }>;
}
