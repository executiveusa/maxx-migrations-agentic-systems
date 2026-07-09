"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { suggestMappings } from "@/lib/import/ghl/mapper";

const SAMPLE_HEADERS = ["Full Name", "Email", "Phone", "Pipeline Stage", "Notes"];

export function GhlImportMapperArtifact() {
  const [headers] = useState(SAMPLE_HEADERS);
  const mappings = useMemo(() => suggestMappings(headers, "contacts"), [headers]);

  return (
    <Card>
      <h3 className="mb-4 font-display text-lg font-semibold text-text">Field mapping preview</h3>
      <ul className="space-y-2">
        {mappings.map((mapping) => (
          <li key={mapping.sourceField} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
            <span className="text-text">{mapping.sourceField}</span>
            <span className="text-muted">→</span>
            <span className="text-text">{mapping.targetField || "Don't import"}</span>
            <Badge tone={mapping.confidence > 0.8 ? "accent" : mapping.confidence > 0 ? "warning" : "neutral"}>
              {Math.round(mapping.confidence * 100)}%
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
