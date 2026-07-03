import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getStore } from "@/lib/data/store";

export const metadata: Metadata = { title: "Workflows" };
export const dynamic = "force-dynamic";

export default function WorkflowsPage() {
  const { workflows } = getStore();
  return (
    <>
      <PageHeader
        eyebrow="Automation"
        title="Workflows"
        description="Step-by-step automations for follow-up, notifications, and handoffs — readable top to bottom."
        actions={<Button href="/app/workflows/new">New workflow</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {workflows.map((workflow) => (
          <Link key={workflow.id} href={`/app/workflows/${workflow.id}`}>
            <Card className="h-full transition-colors hover:bg-surface-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-text">{workflow.name}</h3>
                  <p className="mt-1 text-sm text-muted">{workflow.description}</p>
                </div>
                <StatusPill status={workflow.status} />
              </div>
              <p className="mt-4 text-xs text-muted">{workflow.steps.length} steps · {workflow.runs.length} runs</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
