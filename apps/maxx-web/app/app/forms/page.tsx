import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/Table";
import { StatusPill } from "@/components/ui/StatusPill";
import { getStore } from "@/lib/data/store";

export const metadata: Metadata = { title: "Forms" };
export const dynamic = "force-dynamic";

export default function FormsPage() {
  const { forms } = getStore();
  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Forms"
        description="Public intake forms that feed contacts and submissions directly into your CRM."
        actions={<Button href="/app/forms/new">New form</Button>}
      />
      <Table>
        <Thead>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Fields</Th>
          <Th>Submissions</Th>
        </Thead>
        <Tbody>
          {forms.map((form) => (
            <tr key={form.id}>
              <Td>
                <Link href={`/app/forms/${form.id}`} className="font-medium text-text hover:text-accent">
                  {form.name}
                </Link>
                <p className="text-xs text-muted">{form.description}</p>
              </Td>
              <Td><StatusPill status={form.status} /></Td>
              <Td>{form.fields.length}</Td>
              <Td>{form.submissionCount}</Td>
            </tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
