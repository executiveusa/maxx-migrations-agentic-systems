"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { workflowTemplates } from "@/lib/mock-data/workflows";

export function WorkflowBuilderPreviewArtifact() {
  const [templateId, setTemplateId] = useState(workflowTemplates[0]?.id ?? "");
  const template = workflowTemplates.find((t) => t.id === templateId);

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-text">Workflow builder preview</h3>
        <select
          aria-label="Choose a template"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm"
        >
          {workflowTemplates.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      {template && (
        <ol className="space-y-2">
          {template.steps.map((step, index) => (
            <li key={index} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {index + 1}
              </span>
              <span className="text-text">{step.label}</span>
              <span className="ml-auto text-xs text-muted">{step.type.replace(/_/g, " ")}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
