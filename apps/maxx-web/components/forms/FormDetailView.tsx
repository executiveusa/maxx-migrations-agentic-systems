"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { StatusPill } from "@/components/ui/StatusPill";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select, Textarea } from "@/components/ui/Input";
import type { CrmForm, FormSubmission } from "@/lib/types/forms";

export function FormDetailView({ form, submissions }: { form: CrmForm; submissions: FormSubmission[] }) {
  const embedCode = `<iframe src="https://app.maxxmigrations.com/f/${form.slug}" style="width:100%;border:0;min-height:480px" title="${form.name}"></iframe>`;
  const [copied, setCopied] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Form"
        title={form.name}
        description={form.description}
        actions={<StatusPill status={form.status} />}
      />
      <Tabs
        items={[
          {
            id: "fields",
            label: "Fields",
            content: (
              <div className="space-y-3">
                {form.fields.map((field) => (
                  <Card key={field.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">{field.label}</p>
                      <p className="text-xs text-muted">{field.type}{field.required ? " · required" : ""}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: "preview",
            label: "Public preview",
            content: (
              <Card className="max-w-xl">
                <CardHeader title={form.name} description={form.description} />
                <div className="space-y-4">
                  {form.fields.map((field) => (
                    <label key={field.id} className="block text-sm">
                      <span className="font-medium text-text">
                        {field.label}
                        {field.required && <span className="text-accent"> *</span>}
                      </span>
                      <div className="mt-1.5">
                        {field.type === "textarea" ? (
                          <Textarea disabled placeholder={field.label} />
                        ) : field.type === "select" ? (
                          <Select disabled>
                            {(field.options ?? []).map((opt) => (
                              <option key={opt}>{opt}</option>
                            ))}
                          </Select>
                        ) : field.type === "checkbox" ? (
                          <input type="checkbox" disabled className="h-4 w-4" />
                        ) : (
                          <Input disabled type={field.type === "phone" ? "tel" : field.type} placeholder={field.label} />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </Card>
            ),
          },
          {
            id: "submissions",
            label: `Submissions (${submissions.length})`,
            content:
              submissions.length === 0 ? (
                <EmptyState title="No submissions yet" description="Once this form is published and shared, submissions will appear here." />
              ) : (
                <Table>
                  <Thead>
                    {Object.keys(submissions[0]?.data ?? {}).map((key) => (
                      <Th key={key}>{key}</Th>
                    ))}
                    <Th>Submitted</Th>
                  </Thead>
                  <Tbody>
                    {submissions.map((sub) => (
                      <tr key={sub.id}>
                        {Object.values(sub.data).map((value, i) => (
                          <Td key={i}>{value}</Td>
                        ))}
                        <Td className="text-muted">{new Date(sub.createdAt).toLocaleDateString()}</Td>
                      </tr>
                    ))}
                  </Tbody>
                </Table>
              ),
          },
          {
            id: "embed",
            label: "Embed code",
            content: (
              <Card>
                <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 text-xs text-muted">{embedCode}</pre>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="mt-4 rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-surface-2"
                >
                  {copied ? "Copied!" : "Copy embed code"}
                </button>
              </Card>
            ),
          },
        ]}
      />
    </>
  );
}
