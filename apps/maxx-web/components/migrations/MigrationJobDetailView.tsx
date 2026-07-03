"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { StatusPill } from "@/components/ui/StatusPill";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/Table";
import { ButtonEl } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { generateMigrationReport } from "@/lib/migration/report-generator";
import { BeforeAfterSitePreview } from "@/components/artifacts/BeforeAfterSitePreview";
import type { MigrationJob } from "@/lib/types/migrations";

const CHECKLIST = [
  "All pages extracted",
  "Copy rewritten and approved",
  "Design audit score above 80",
  "Assets optimized and re-hosted",
  "Human review complete",
];

export function MigrationJobDetailView({ job }: { job: MigrationJob }) {
  const { pushToast } = useToast();
  const report = generateMigrationReport(job);

  function publish() {
    pushToast("Publish requires human approval — this is a demo checklist, not a live deploy.", "info");
  }

  return (
    <>
      <PageHeader
        eyebrow="Migration"
        title={job.sourceUrl.replace(/^https?:\/\//, "")}
        description={`Design audit score: ${report.designAudit.score}/100`}
        actions={<ButtonEl onClick={publish}>Review publish checklist</ButtonEl>}
      />
      <div className="mb-6"><StatusPill status={job.status === "published" ? "published" : job.status === "review" || job.status === "ready_to_publish" ? "pending" : "running"} /></div>

      <div className="mb-6">
        <BeforeAfterSitePreview job={job} />
      </div>

      <Tabs
        items={[
          {
            id: "pages",
            label: `Pages (${job.pages.length})`,
            content: (
              <Table>
                <Thead>
                  <Th>Path</Th>
                  <Th>Title</Th>
                  <Th>Words</Th>
                  <Th>Status</Th>
                </Thead>
                <Tbody>
                  {job.pages.map((page) => (
                    <tr key={page.id}>
                      <Td className="font-mono text-xs">{page.path}</Td>
                      <Td>{page.title}</Td>
                      <Td>{page.wordCount}</Td>
                      <Td><StatusPill status={page.status === "approved" ? "completed" : page.status === "pending" ? "pending" : "running"} /></Td>
                    </tr>
                  ))}
                </Tbody>
              </Table>
            ),
          },
          {
            id: "assets",
            label: `Assets (${job.assets.length})`,
            content: (
              <Table>
                <Thead>
                  <Th>Filename</Th>
                  <Th>Type</Th>
                  <Th>Size</Th>
                </Thead>
                <Tbody>
                  {job.assets.map((asset) => (
                    <tr key={asset.id}>
                      <Td>{asset.filename}</Td>
                      <Td className="text-muted">{asset.type}</Td>
                      <Td className="text-muted">{asset.sizeKb} KB</Td>
                    </tr>
                  ))}
                </Tbody>
              </Table>
            ),
          },
          {
            id: "timeline",
            label: "Agent timeline",
            content: (
              <ol className="space-y-3">
                {job.taskTimeline.map((task) => (
                  <li key={task.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-text">{task.label}</p>
                      <p className="text-xs text-muted">{task.agent} · {new Date(task.occurredAt).toLocaleString()}</p>
                    </div>
                    <StatusPill status={task.status === "completed" ? "completed" : task.status === "running" ? "running" : "pending"} />
                  </li>
                ))}
              </ol>
            ),
          },
          {
            id: "audit",
            label: "Design audit",
            content: (
              <Card className="max-w-xl">
                <p className="font-display text-3xl font-semibold text-text">{report.designAudit.score}/100</p>
                <div className="mt-4 space-y-1">
                  {report.designAudit.passedChecks.map((check) => (
                    <p key={check} className="text-sm text-accent">✓ {check}</p>
                  ))}
                  {report.designAudit.failedChecks.map((check) => (
                    <p key={check} className="text-sm text-muted">○ {check}</p>
                  ))}
                </div>
              </Card>
            ),
          },
          {
            id: "checklist",
            label: "Publish checklist",
            content: (
              <Card className="max-w-xl">
                <ul className="space-y-2">
                  {CHECKLIST.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-text">
                      <input type="checkbox" readOnly checked={job.status === "ready_to_publish" || job.status === "published"} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ),
          },
        ]}
      />
    </>
  );
}
