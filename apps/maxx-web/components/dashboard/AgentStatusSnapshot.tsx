import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { aiAgents } from "@/lib/mock-data/agents";
import { getIntegrationConnections } from "@/lib/mock-data/integrations";

export function AgentStatusSnapshot() {
  const activeAgents = aiAgents.filter((a) => a.status === "active");
  const connections = getIntegrationConnections();
  const connected = connections.filter((c) => c.status === "connected").length;

  return (
    <Card>
      <CardHeader
        title="AI agents & integrations"
        description={`${activeAgents.length} active agents · ${connected}/${connections.length} integrations connected`}
        action={<Link href="/app/agents" className="text-sm text-accent">Open agents</Link>}
      />
      <ul className="space-y-2">
        {aiAgents.slice(0, 4).map((agent) => (
          <li key={agent.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
            <span className="text-sm text-text">{agent.name}</span>
            <StatusPill status={agent.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
