"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonEl } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { workflowStepTypes } from "@/lib/validation/workflow";
import type { WorkflowStepType, WorkflowTemplate } from "@/lib/types/workflows";

interface DraftStep {
  type: WorkflowStepType;
  label: string;
}

export function WorkflowBuilder({ templates }: { templates: WorkflowTemplate[] }) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<DraftStep[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function chooseTemplate(template: WorkflowTemplate) {
    setSelectedTemplate(template);
    setName(template.name);
    setDescription(template.description);
    setSteps(template.steps.map((s) => ({ type: s.type, label: s.label })));
  }

  function startFromScratch() {
    setSelectedTemplate(null);
    setName("");
    setDescription("");
    setSteps([{ type: "trigger", label: "Choose a trigger" }]);
  }

  function addStep() {
    setSteps((prev) => [...prev, { type: "wait", label: "New step" }]);
  }

  function updateStep(index: number, patch: Partial<DraftStep>) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function moveStep(index: number, direction: -1 | 1) {
    setSteps((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const step = next[index]!;
      next[index] = next[target]!;
      next[target] = step;
      return next;
    });
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSubmitting(true);
    const res = await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        templateId: selectedTemplate?.id,
        steps: steps.map((s) => ({ type: s.type, label: s.label, config: {} })),
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = await res.json();
      pushToast(body.error ?? "Could not save workflow.", "error");
      return;
    }
    const { workflow } = await res.json();
    pushToast("Workflow saved as draft.", "success");
    router.push(`/app/workflows/${workflow.id}`);
  }

  if (steps.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="Automation"
          title="Choose a starting point"
          description="Start from a proven template, or build a workflow from scratch."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="flex h-full flex-col">
              <Badge>{template.category}</Badge>
              <h3 className="mt-3 font-display text-lg font-semibold text-text">{template.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{template.description}</p>
              <ButtonEl className="mt-4" variant="secondary" onClick={() => chooseTemplate(template)}>
                Use this template
              </ButtonEl>
            </Card>
          ))}
          <Card className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted">Need something custom?</p>
            <ButtonEl className="mt-3" onClick={startFromScratch}>
              Start from scratch
            </ButtonEl>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Automation"
        title="Build your workflow"
        description="Steps run top to bottom. Reorder, edit, or remove any step before activating."
        actions={
          <ButtonEl onClick={handleSave} disabled={submitting || !name}>
            {submitting ? "Saving…" : "Save as draft"}
          </ButtonEl>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <Field label="Workflow name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
        </div>
        <div className="space-y-3 lg:col-span-2">
          {steps.map((step, index) => (
            <Card key={index} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-semibold text-accent">
                {index + 1}
              </span>
              <Field label="Step type" className="w-48 shrink-0">
                <Select value={step.type} onChange={(e) => updateStep(index, { type: e.target.value as WorkflowStepType })}>
                  {workflowStepTypes.map((type) => (
                    <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Label" className="flex-1">
                <Input value={step.label} onChange={(e) => updateStep(index, { label: e.target.value })} />
              </Field>
              <div className="flex gap-1">
                <ButtonEl variant="ghost" size="sm" onClick={() => moveStep(index, -1)} aria-label="Move up">↑</ButtonEl>
                <ButtonEl variant="ghost" size="sm" onClick={() => moveStep(index, 1)} aria-label="Move down">↓</ButtonEl>
                <ButtonEl variant="ghost" size="sm" onClick={() => removeStep(index)} aria-label="Remove step">✕</ButtonEl>
              </div>
            </Card>
          ))}
          <ButtonEl variant="secondary" onClick={addStep}>Add step</ButtonEl>
        </div>
      </div>
    </>
  );
}
