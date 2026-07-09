import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/data/store";
import { WorkflowDetailView } from "@/components/workflows/WorkflowDetailView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}): Promise<Metadata> {
  const { workflowId } = await params;
  const workflow = getStore().workflows.find((w) => w.id === workflowId);
  return { title: workflow ? workflow.name : "Workflow" };
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  const workflow = getStore().workflows.find((w) => w.id === workflowId);
  if (!workflow) notFound();
  return <WorkflowDetailView workflow={workflow} />;
}
