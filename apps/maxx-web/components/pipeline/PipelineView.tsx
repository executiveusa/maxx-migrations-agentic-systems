"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonEl } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import { opportunitySchema, type OpportunityInput } from "@/lib/validation/opportunity";
import type { Opportunity, Pipeline } from "@/lib/types/pipeline";

export function PipelineView({
  pipeline,
  initialOpportunities,
  contacts,
}: {
  pipeline: Pipeline;
  initialOpportunities: Opportunity[];
  contacts: { id: string; name: string }[];
}) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const { pushToast } = useToast();
  const total = opportunities.reduce((sum, o) => sum + o.value, 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OpportunityInput>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      pipelineId: pipeline.id,
      stageId: pipeline.stages[0]?.id ?? "",
      contactId: "",
      title: "",
      value: 0,
    },
  });

  async function onCreate(data: OpportunityInput) {
    const contact = contacts.find((c) => c.id === data.contactId);
    const created: Opportunity = {
      id: `opp_${Date.now()}`,
      organizationId: initialOpportunities[0]?.organizationId ?? "",
      pipelineId: data.pipelineId,
      stageId: data.stageId,
      contactId: data.contactId,
      contactName: contact?.name ?? "Unknown contact",
      title: data.title,
      value: data.value,
      currency: "USD",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOpportunities((prev) => [created, ...prev]);
    pushToast(`"${data.title}" added to ${pipeline.stages.find((s) => s.id === data.stageId)?.name}.`, "success");
    reset();
    setCreateOpen(false);
  }

  function moveStage(opportunityId: string, stageId: string) {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opportunityId ? { ...o, stageId, updatedAt: new Date().toISOString() } : o)),
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title={pipeline.name}
        description={`$${total.toLocaleString()} across ${opportunities.length} open opportunities.`}
        actions={<ButtonEl onClick={() => setCreateOpen(true)}>Add opportunity</ButtonEl>}
      />

      <div className="grid gap-4 overflow-x-auto pb-4 sm:grid-cols-3 lg:grid-cols-5">
        {pipeline.stages.map((stage) => {
          const stageOpps = opportunities.filter((o) => o.stageId === stage.id);
          const stageTotal = stageOpps.reduce((sum, o) => sum + o.value, 0);
          return (
            <div key={stage.id} className="min-w-[220px]">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text">{stage.name}</h3>
                <span className="text-xs text-muted">${stageTotal.toLocaleString()}</span>
              </div>
              <div className="space-y-3">
                {stageOpps.map((opp) => (
                  <Card key={opp.id} className="cursor-pointer p-4" onClick={() => setEditing(opp)}>
                    <p className="text-sm font-medium text-text">{opp.title}</p>
                    <p className="mt-1 text-xs text-muted">{opp.contactName}</p>
                    <p className="mt-2 text-sm font-semibold text-accent">${opp.value.toLocaleString()}</p>
                    <Select
                      className="mt-3 text-xs"
                      value={opp.stageId}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => moveStage(opp.id, e.target.value)}
                    >
                      {pipeline.stages.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </Select>
                  </Card>
                ))}
                {stageOpps.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted">
                    No opportunities
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="Add opportunity">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Field label="Title" error={errors.title?.message}>
            <Input {...register("title")} />
          </Field>
          <Field label="Contact" error={errors.contactId?.message}>
            <Select {...register("contactId")} defaultValue="">
              <option value="" disabled>Select a contact</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Stage" error={errors.stageId?.message}>
            <Select {...register("stageId")}>
              {pipeline.stages.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Value (USD)" error={errors.value?.message}>
            <Input type="number" step="1" {...register("value", { valueAsNumber: true })} />
          </Field>
          <input type="hidden" {...register("pipelineId")} value={pipeline.id} />
          <ButtonEl type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding…" : "Add opportunity"}
          </ButtonEl>
        </form>
      </Dialog>

      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing?.title ?? ""}>
        {editing && (
          <div className="space-y-3 text-sm">
            <p><span className="text-muted">Contact:</span> {editing.contactName}</p>
            <p><span className="text-muted">Value:</span> ${editing.value.toLocaleString()}</p>
            <p><span className="text-muted">Stage:</span> {pipeline.stages.find((s) => s.id === editing.stageId)?.name}</p>
            <p><span className="text-muted">Last updated:</span> {new Date(editing.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </Dialog>
    </>
  );
}
