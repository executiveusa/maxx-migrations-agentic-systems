"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import type { Organization } from "@/lib/types/organizations";
import type { FlywheelProject } from "@/lib/types/project";
import type { Bead } from "@/lib/types/bead";
import type { FlywheelSession } from "@/lib/types/bead";

interface CommandCenterViewProps {
  agencies: Organization[];
  projects: FlywheelProject[];
  beads: Bead[];
  sessions: FlywheelSession[];
}

export function CommandCenterView({ agencies, projects, beads, sessions }: CommandCenterViewProps) {
  const [focusedOrgId, setFocusedOrgId] = useState<string | null>(null);

  const statsByOrg = useMemo(() => {
    const map = new Map<string, { activeProjects: number; runningAgents: number; spendUsd: number }>();
    for (const agency of agencies) {
      const orgProjects = projects.filter((p) => p.organizationId === agency.id);
      const orgSessions = sessions.filter((s) => s.organizationId === agency.id);
      map.set(agency.id, {
        activeProjects: orgProjects.filter((p) => p.status === "active").length,
        runningAgents: orgSessions.filter((s) => s.status === "running").length,
        spendUsd: orgSessions.reduce((sum, s) => sum + s.costUsd, 0),
      });
    }
    return map;
  }, [agencies, projects, sessions]);

  const focusedAgency = agencies.find((a) => a.id === focusedOrgId) ?? null;
  const focusedProjects = focusedOrgId ? projects.filter((p) => p.organizationId === focusedOrgId) : [];
  const focusedBeads = focusedOrgId ? beads.filter((b) => b.organizationId === focusedOrgId) : [];
  const focusedSessions = focusedOrgId ? sessions.filter((s) => s.organizationId === focusedOrgId) : [];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agencies.map((agency) => {
          const stats = statsByOrg.get(agency.id) ?? { activeProjects: 0, runningAgents: 0, spendUsd: 0 };
          const isFocused = agency.id === focusedOrgId;
          return (
            <button
              key={agency.id}
              type="button"
              onClick={() => setFocusedOrgId(isFocused ? null : agency.id)}
              className="text-left"
            >
              <Card
                className={`h-full transition-colors ${
                  isFocused ? "border-accent bg-accent-soft/30" : "hover:border-accent/50"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-base font-semibold text-text">{agency.name}</p>
                    <p className="mt-1 text-xs text-muted">{agency.missionFocus}</p>
                  </div>
                  {agency.plan === "sovereign_install_plus_partner" && (
                    <span className="shrink-0 rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                      Hub
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="font-display text-xl font-semibold text-text">{stats.activeProjects}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted">Active</p>
                  </div>
                  <div>
                    <p className="font-display text-xl font-semibold text-text">{stats.runningAgents}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted">Agents</p>
                  </div>
                  <div>
                    <p className="font-display text-xl font-semibold text-text">${stats.spendUsd.toFixed(2)}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted">Spend</p>
                  </div>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {focusedAgency && (
        <div className="space-y-6 border-t border-border pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-text">{focusedAgency.name} — projects</h2>
            <Button variant="secondary" size="sm" href="/app/projects">
              Launch a project for this agency
            </Button>
          </div>

          {focusedProjects.length === 0 ? (
            <Card className="text-sm text-muted">No projects yet for this agency.</Card>
          ) : (
            <div className="space-y-3">
              {focusedProjects.map((project) => {
                const projectBeads = focusedBeads.filter((b) => b.projectId === project.id);
                const projectSessions = focusedSessions.filter((s) => s.projectId === project.id);
                return (
                  <Card key={project.id}>
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-text">{project.name}</p>
                        <p className="text-xs text-muted">{project.description}</p>
                      </div>
                      <StatusPill status={project.status} />
                    </div>
                    {projectBeads.length > 0 && (
                      <div className="space-y-2 border-t border-border pt-3">
                        {projectBeads.map((bead) => (
                          <div key={bead.id} className="flex items-center justify-between text-sm">
                            <span className="text-text">{bead.title}</span>
                            <StatusPill status={bead.status} />
                          </div>
                        ))}
                      </div>
                    )}
                    {projectSessions.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        {projectSessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between text-xs text-muted">
                            <span>
                              {session.model} · {session.tokensUsed.toLocaleString()} tokens · $
                              {session.costUsd.toFixed(2)}
                            </span>
                            <StatusPill status={session.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
