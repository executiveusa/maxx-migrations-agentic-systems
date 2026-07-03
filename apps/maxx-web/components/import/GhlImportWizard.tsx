"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ButtonEl } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { parseCsv } from "@/lib/import/ghl/csv-parser";
import { suggestMappings } from "@/lib/import/ghl/mapper";
import { runImport, toErrorCsv } from "@/lib/import/ghl/import-runner";
import { ghlObjectTypes } from "@/lib/validation/ghl-import";
import type { ParsedCsv, MappingSuggestion } from "@/lib/import/ghl/types";
import type { GhlObjectType } from "@/lib/types/imports";
import type { ImportRunResult } from "@/lib/import/ghl/types";

const STEPS = ["Source", "Upload", "Objects", "Map fields", "Validate", "Run", "Summary"] as const;

const SAMPLE_CSV = `Full Name,Email,Phone,Pipeline Stage,Tags\nSample Contact One,contact.one@example.org,+15035550001,New Lead,sample\nSample Contact Two,,+15035550002,Contacted,sample`;

export function GhlImportWizard({ ghlApiConfigured }: { ghlApiConfigured: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [source, setSource] = useState<"csv" | "ghl_api">("csv");
  const [csv, setCsv] = useState<ParsedCsv | null>(null);
  const [objects, setObjects] = useState<GhlObjectType[]>(["contacts"]);
  const [mappings, setMappings] = useState<MappingSuggestion[]>([]);
  const [result, setResult] = useState<ImportRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const { pushToast } = useToast();

  function goTo(index: number) {
    setStepIndex(Math.max(0, Math.min(STEPS.length - 1, index)));
  }

  function loadSample() {
    setCsv(parseCsv(SAMPLE_CSV));
    pushToast("Sample CSV loaded.", "info");
  }

  function onFileSelected(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setCsv(parseCsv(String(reader.result ?? "")));
      pushToast(`Parsed ${file.name}.`, "success");
    };
    reader.readAsText(file);
  }

  function toggleObject(object: GhlObjectType) {
    setObjects((prev) => (prev.includes(object) ? prev.filter((o) => o !== object) : [...prev, object]));
  }

  function goToMapping() {
    if (!csv) return;
    setMappings(suggestMappings(csv.headers, objects[0] ?? "contacts"));
    goTo(3);
  }

  function updateMapping(index: number, targetField: string) {
    setMappings((prev) => prev.map((m, i) => (i === index ? { ...m, targetField, required: targetField === "email" || targetField === "firstName+lastName" } : m)));
  }

  function goToValidation() {
    goTo(4);
  }

  async function executeImport() {
    if (!csv) return;
    setRunning(true);
    const runResult = runImport(csv, mappings);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setResult(runResult);
    setRunning(false);
    goTo(6);
  }

  function downloadErrors() {
    if (!csv || !result) return;
    const blob = new Blob([toErrorCsv(csv, result)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ghl-import-errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        eyebrow="Import"
        title="GHL Import Wizard"
        description="Move contacts, pipelines, opportunities, notes, and tasks out of GoHighLevel and into your owned CRM."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((step, index) => (
          <span
            key={step}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              index === stepIndex ? "bg-accent-soft text-accent" : index < stepIndex ? "bg-surface-2 text-text" : "text-muted"
            }`}
          >
            {index + 1}. {step}
          </span>
        ))}
      </div>

      {stepIndex === 0 && (
        <Card className="max-w-xl">
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Choose a source</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 rounded-lg border border-border p-4">
              <input type="radio" checked={source === "csv"} onChange={() => setSource("csv")} />
              <div>
                <p className="text-sm font-medium text-text">CSV export</p>
                <p className="text-xs text-muted">Upload a CSV exported from GoHighLevel. Works without any API credentials.</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 rounded-lg border border-border p-4 ${!ghlApiConfigured ? "opacity-50" : ""}`}>
              <input type="radio" checked={source === "ghl_api"} disabled={!ghlApiConfigured} onChange={() => setSource("ghl_api")} />
              <div>
                <p className="text-sm font-medium text-text">Connect GHL API</p>
                <p className="text-xs text-muted">
                  {ghlApiConfigured ? "Pull records directly from your GHL account." : "Setup required — add GHL_API_KEY and GHL_LOCATION_ID in Settings → Integrations."}
                </p>
              </div>
            </label>
          </div>
          <ButtonEl className="mt-6" onClick={() => goTo(1)}>Continue</ButtonEl>
        </Card>
      )}

      {stepIndex === 1 && (
        <Card className="max-w-xl">
          <h3 className="mb-4 font-display text-lg font-semibold text-text">
            {source === "csv" ? "Upload CSV" : "Connect to GHL"}
          </h3>
          {source === "csv" ? (
            <div className="space-y-4">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && onFileSelected(e.target.files[0])}
                className="block w-full text-sm text-muted"
              />
              <ButtonEl variant="secondary" onClick={loadSample}>Or load sample data</ButtonEl>
              {csv && <p className="text-sm text-accent">Loaded {csv.rows.length} rows, {csv.headers.length} columns.</p>}
            </div>
          ) : (
            <p className="text-sm text-muted">GHL API connection required to continue with this source.</p>
          )}
          <div className="mt-6 flex gap-3">
            <ButtonEl variant="ghost" onClick={() => goTo(0)}>Back</ButtonEl>
            <ButtonEl onClick={() => goTo(2)} disabled={source === "csv" && !csv}>Continue</ButtonEl>
          </div>
        </Card>
      )}

      {stepIndex === 2 && (
        <Card className="max-w-xl">
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Select objects to import</h3>
          <div className="grid grid-cols-2 gap-2">
            {ghlObjectTypes.map((object) => (
              <label key={object} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                <input type="checkbox" checked={objects.includes(object)} onChange={() => toggleObject(object)} />
                {object.replace(/_/g, " ")}
              </label>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <ButtonEl variant="ghost" onClick={() => goTo(1)}>Back</ButtonEl>
            <ButtonEl onClick={goToMapping} disabled={objects.length === 0}>Continue</ButtonEl>
          </div>
        </Card>
      )}

      {stepIndex === 3 && csv && (
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Map fields</h3>
          <Table>
            <Thead>
              <Th>Source column</Th>
              <Th>Maps to</Th>
              <Th>Confidence</Th>
            </Thead>
            <Tbody>
              {mappings.map((mapping, index) => (
                <tr key={mapping.sourceField}>
                  <Td>{mapping.sourceField}</Td>
                  <Td>
                    <Select value={mapping.targetField} onChange={(e) => updateMapping(index, e.target.value)}>
                      <option value="">Don&apos;t import</option>
                      <option value="firstName+lastName">Full name</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="stageId">Pipeline stage</option>
                      <option value="tags">Tags</option>
                    </Select>
                  </Td>
                  <Td>
                    <Badge tone={mapping.confidence > 0.8 ? "accent" : mapping.confidence > 0 ? "warning" : "neutral"}>
                      {Math.round(mapping.confidence * 100)}%
                    </Badge>
                  </Td>
                </tr>
              ))}
            </Tbody>
          </Table>
          <div className="mt-6 flex gap-3">
            <ButtonEl variant="ghost" onClick={() => goTo(2)}>Back</ButtonEl>
            <ButtonEl onClick={goToValidation}>Continue</ButtonEl>
          </div>
        </Card>
      )}

      {stepIndex === 4 && csv && (
        <Card>
          <h3 className="mb-2 font-display text-lg font-semibold text-text">Validate records</h3>
          <p className="mb-4 text-sm text-muted">{csv.rows.length} records will be checked against your field mapping before import.</p>
          <ButtonEl onClick={executeImport} disabled={running}>
            {running ? "Validating and running…" : "Run import"}
          </ButtonEl>
          <div className="mt-6 flex gap-3">
            <ButtonEl variant="ghost" onClick={() => goTo(3)}>Back</ButtonEl>
          </div>
        </Card>
      )}

      {stepIndex === 5 && (
        <Card><p className="text-sm text-muted">Running import…</p></Card>
      )}

      {stepIndex === 6 && result && (
        <Card className="max-w-xl">
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Import summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-display text-2xl font-semibold text-text">{result.totalRecords}</p>
              <p className="text-xs text-muted">Total</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-accent">{result.importedRecords}</p>
              <p className="text-xs text-muted">Imported</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-red-400">{result.errorRecords}</p>
              <p className="text-xs text-muted">Errors</p>
            </div>
          </div>
          {result.issues.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-text">Issues</p>
              <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-muted">
                {result.issues.map((issue, i) => (
                  <li key={i}>Row {issue.row} — {issue.field}: {issue.message}</li>
                ))}
              </ul>
              <ButtonEl className="mt-3" variant="secondary" onClick={downloadErrors}>Export errors as CSV</ButtonEl>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
