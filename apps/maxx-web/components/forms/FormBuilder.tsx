"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonEl } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formFieldTypes, type FormFieldInput } from "@/lib/validation/form";

export function FormBuilder() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormFieldInput[]>([
    { type: "text", label: "Full name", required: true },
    { type: "email", label: "Email", required: true },
  ]);
  const [submitting, setSubmitting] = useState(false);

  function addField() {
    setFields((prev) => [...prev, { type: "text", label: "", required: false }]);
  }

  function updateField(index: number, patch: Partial<FormFieldInput>) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSubmitting(true);
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, fields }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = await res.json();
      pushToast(body.error ?? "Could not save form.", "error");
      return;
    }
    const { form } = await res.json();
    pushToast("Form saved.", "success");
    router.push(`/app/forms/${form.id}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="New form"
        description="Build a public intake form. Fields feed directly into contact records once published."
        actions={
          <ButtonEl onClick={handleSave} disabled={submitting || !name || fields.length === 0}>
            {submitting ? "Saving…" : "Save form"}
          </ButtonEl>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Field label="Form name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Volunteer Sign-Up" />
          </Field>
          <Field label="Description">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
        </div>
        <div className="space-y-4 lg:col-span-2">
          {fields.length === 0 ? (
            <EmptyState
              title="No fields yet"
              description="Add at least one field before saving this form."
              action={<ButtonEl onClick={addField}>Add field</ButtonEl>}
            />
          ) : (
            fields.map((field, index) => (
              <Card key={index} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <Field label="Label" className="flex-1">
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                  />
                </Field>
                <Field label="Type" className="w-40">
                  <Select
                    value={field.type}
                    onChange={(e) => updateField(index, { type: e.target.value as FormFieldInput["type"] })}
                  >
                    {formFieldTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </Field>
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(index, { required: e.target.checked })}
                  />
                  Required
                </label>
                <ButtonEl variant="ghost" size="sm" onClick={() => removeField(index)}>
                  Remove
                </ButtonEl>
              </Card>
            ))
          )}
          <ButtonEl variant="secondary" onClick={addField}>
            Add field
          </ButtonEl>
        </div>
      </div>
    </>
  );
}
