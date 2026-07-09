"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AgentToolPermission, AiAgent } from "@/lib/types/agents";

const ALL_PERMISSIONS: AgentToolPermission[] = ["read", "write", "send", "publish", "billing"];

export function ToolPermissionMatrix({ agents }: { agents: AiAgent[] }) {
  const [filter, setFilter] = useState<AgentToolPermission | "all">("all");

  const visibleAgents = filter === "all" ? agents : agents.filter((a) => a.toolPermissions.includes(filter));

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-text">Tool permission matrix</h3>
        <select
          aria-label="Filter by permission"
          value={filter}
          onChange={(e) => setFilter(e.target.value as AgentToolPermission | "all")}
          className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm"
        >
          <option value="all">All permissions</option>
          {ALL_PERMISSIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      {visibleAgents.length === 0 ? (
        <EmptyState title="No agents match this filter" description="Try a different permission." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4">Agent</th>
                {ALL_PERMISSIONS.map((p) => (
                  <th key={p} className="px-2 py-2 text-center">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleAgents.map((agent) => (
                <tr key={agent.id} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">{agent.name}</td>
                  {ALL_PERMISSIONS.map((p) => (
                    <td key={p} className="px-2 py-2 text-center">
                      {agent.toolPermissions.includes(p) ? (
                        <span className="text-accent" aria-label={`${agent.name} has ${p}`}>✓</span>
                      ) : (
                        <span className="text-muted" aria-label={`${agent.name} does not have ${p}`}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
