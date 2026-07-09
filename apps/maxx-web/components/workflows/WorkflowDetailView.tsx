"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonEl } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import type { Workflow } from "@/lib/types/workflows";

export function WorkflowDetailView({ workflow: initial }: { workflow: Workflow }) {
  const [workflow, setWorkflow] = useState(initial);
  const [previewing, setPreviewing] = useState(false);
  const { pushToast } = useToast();

  async function toggleActive() {
    const nextStatus = workflow.status === "active" ? "inactive" : "active";
    setWorkflow((w) => ({ ...w, status: nextStatus }));
    pushToast(`Workflow ${nextStatus === "active" ? "activated" : "deactivated"}.`, "success");
  }

  function runPreview() {
    setPreviewing(true);
    setTimeout(() => {
      setPreviewing(false);
      pushToast("Preview run completed — no live actions were sent.", "info");
    }, 900);
  }

  return (
    <>
      <PageHeader
        eyebrow="Workflow"
        title={workflow.name}
        description={workflow.description}
        actions={
          <div className="flex gap-3">
            <ButtonEl variant="secondary" onClick={runPreview} disabled={previewing}>
              {previewing ? "Running preview…" : "Preview run"}
            </ButtonEl>
            <ButtonEl onClick={toggleActive} variant={workflow.status === "active" ? "danger" : "primary"}>
              {workflow.status === "active" ? "Deactivate" : "Activate"}
            </ButtonEl>
          </div>
        }
      />
      <div className="mb-4">
        <StatusPill status={workflow.status} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Steps</h3>
          <ol className="space-y-3">
            {workflow.steps.map((step, index) => (
              <li key={step.id} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-text">{step.label}</p>
                  <p className="text-xs text-muted">{step.type.replace(/_/g, " ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Run history</h3>
          {workflow.runs.length === 0 ? (
            <EmptyState title="No runs yet" description="This workflow hasn't been triggered yet." />
          ) : (
            <ul className="space-y-3">
              {workflow.runs.map((run) => (
                <li key={run.id} className="rounded-lg border border-border px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text">{run.triggeredBy}</p>
                    <StatusPill status={run.status === "success" ? "completed" : run.status === "failed" ? "failed" : "running"} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {run.stepsCompleted}/{run.stepsTotal} steps · started {new Date(run.startedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
