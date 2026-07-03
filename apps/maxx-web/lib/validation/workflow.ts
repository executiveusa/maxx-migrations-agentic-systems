import { z } from "zod";

export const workflowStepTypes = [
  "trigger",
  "condition",
  "wait",
  "send_email",
  "send_sms",
  "create_task",
  "update_contact",
  "move_pipeline_stage",
  "notify_user",
  "webhook",
  "ai_generate",
  "human_approval",
] as const;

export const workflowStepSchema = z.object({
  type: z.enum(workflowStepTypes),
  label: z.string().min(1, "Step label is required."),
  config: z.record(z.string()).default({}),
});

export const workflowSchema = z.object({
  name: z.string().min(2, "Workflow name is required."),
  description: z.string().min(1, "Add a short description."),
  templateId: z.string().optional(),
  steps: z.array(workflowStepSchema).min(1, "A workflow needs at least one step."),
});

export type WorkflowInput = z.infer<typeof workflowSchema>;
