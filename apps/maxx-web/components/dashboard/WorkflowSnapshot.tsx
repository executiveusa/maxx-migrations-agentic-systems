import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { workflows } from "@/lib/mock-data/workflows";

export function WorkflowSnapshot() {
  return (
    <Card>
      <CardHeader
        title="Workflows"
        description="Automations currently configured"
        action={<Link href="/app/workflows" className="text-sm text-accent">Open workflows</Link>}
      />
      <ul className="space-y-2">
        {workflows.map((workflow) => (
          <li key={workflow.id}>
            <Link
              href={`/app/workflows/${workflow.id}`}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 transition-colors hover:bg-surface-2"
            >
              <span className="text-sm text-text">{workflow.name}</span>
              <StatusPill status={workflow.status} />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
