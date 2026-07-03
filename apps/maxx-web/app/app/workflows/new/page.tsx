import type { Metadata } from "next";
import { WorkflowBuilder } from "@/components/workflows/WorkflowBuilder";
import { workflowTemplates } from "@/lib/mock-data/workflows";

export const metadata: Metadata = { title: "New Workflow" };

export default function NewWorkflowPage() {
  return <WorkflowBuilder templates={workflowTemplates} />;
}
