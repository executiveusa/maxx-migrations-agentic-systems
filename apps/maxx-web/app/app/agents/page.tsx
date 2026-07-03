import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/Table";
import { ToolPermissionMatrix } from "@/components/artifacts/ToolPermissionMatrix";
import { ModelCostGuard } from "@/components/artifacts/ModelCostGuard";
import { AgentGraphExplorer } from "@/components/artifacts/AgentGraphExplorer";
import { aiAgents, agentSessions } from "@/lib/mock-data/agents";

export const metadata: Metadata = { title: "AI Agents" };

export default function AgentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI runtime"
        title="AI Agents"
        description="Every agent operating inside your CRM, with its model policy, tool permissions, and spend against budget."
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <ModelCostGuard agents={aiAgents} />
        <AgentGraphExplorer agents={aiAgents} sessions={agentSessions} />
      </div>

      <div className="mb-8">
        <ToolPermissionMatrix agents={aiAgents} />
      </div>

      <Table>
        <Thead>
          <Th>Agent</Th>
          <Th>Model policy</Th>
          <Th>Status</Th>
          <Th>Tool permissions</Th>
          <Th>Spend / Budget</Th>
        </Thead>
        <Tbody>
          {aiAgents.map((agent) => (
            <tr key={agent.id}>
              <Td>
                <p className="font-medium text-text">{agent.name}</p>
                <p className="text-xs text-muted">{agent.description}</p>
              </Td>
              <Td className="font-mono text-xs">{agent.modelPolicy}</Td>
              <Td><StatusPill status={agent.status} /></Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {agent.toolPermissions.map((p) => <Badge key={p}>{p}</Badge>)}
                </div>
              </Td>
              <Td className="text-muted">${agent.monthlySpendUsd.toFixed(2)} / ${agent.monthlyBudgetUsd}</Td>
            </tr>
          ))}
        </Tbody>
      </Table>

      <h2 className="mb-4 mt-10 font-display text-xl font-semibold text-text">Recent agent sessions</h2>
      <div className="space-y-3">
        {agentSessions.map((session) => {
          const agent = aiAgents.find((a) => a.id === session.agentId);
          return (
            <Card key={session.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">{session.task}</p>
                <p className="text-xs text-muted">{agent?.name} · {session.tokensUsed.toLocaleString()} tokens</p>
              </div>
              <StatusPill status={session.status === "completed" ? "completed" : session.status === "running" ? "running" : session.status === "failed" ? "failed" : "pending"} />
            </Card>
          );
        })}
      </div>
    </>
  );
}
