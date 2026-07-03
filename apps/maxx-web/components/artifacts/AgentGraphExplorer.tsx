"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AgentSession, AiAgent } from "@/lib/types/agents";

export function AgentGraphExplorer({ agents, sessions }: { agents: AiAgent[]; sessions: AgentSession[] }) {
  const [selectedId, setSelectedId] = useState(agents[0]?.id ?? "");
  const selected = agents.find((a) => a.id === selectedId);
  const relatedSessions = sessions.filter((s) => s.agentId === selectedId);

  return (
    <Card>
      <h3 className="mb-4 font-display text-lg font-semibold text-text">Agent graph explorer</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <ul className="space-y-1 md:col-span-1" role="listbox" aria-label="Agents">
          {agents.map((agent) => (
            <li key={agent.id}>
              <button
                type="button"
                role="option"
                aria-selected={selectedId === agent.id}
                onClick={() => setSelectedId(agent.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  selectedId === agent.id ? "bg-accent-soft text-accent" : "text-text hover:bg-surface-2"
                }`}
              >
                {agent.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="md:col-span-2">
          {selected ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-medium text-text">{selected.name}</h4>
                <StatusPill status={selected.status} />
              </div>
              <p className="mt-1 text-sm text-muted">{selected.description}</p>
              <p className="mt-3 text-xs text-muted">Model policy: {selected.modelPolicy}</p>
              <h5 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Recent sessions</h5>
              {relatedSessions.length === 0 ? (
                <EmptyState title="No sessions yet" description="This agent hasn't run yet." />
              ) : (
                <ul className="mt-2 space-y-2">
                  {relatedSessions.map((session) => (
                    <li key={session.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                      {session.task}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <EmptyState title="No agent selected" description="Choose an agent from the list." />
          )}
        </div>
      </div>
    </Card>
  );
}
