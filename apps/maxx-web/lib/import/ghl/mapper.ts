import type { GhlObjectType } from "@/lib/types/imports";
import { TARGET_FIELDS_BY_OBJECT, type MappingSuggestion } from "@/lib/import/ghl/types";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const KNOWN_ALIASES: Record<string, string> = {
  fullname: "firstName+lastName",
  name: "firstName+lastName",
  emailaddress: "email",
  phonenumber: "phone",
  pipelinestage: "stageId",
  stage: "stageId",
  opportunityvalue: "value",
  dealvalue: "value",
};

export function suggestMappings(headers: string[], object: GhlObjectType): MappingSuggestion[] {
  const targetFields = TARGET_FIELDS_BY_OBJECT[object];

  return headers.map((sourceField) => {
    const normalized = normalize(sourceField);
    const aliasTarget = KNOWN_ALIASES[normalized];
    const exactTarget = targetFields.find((t) => normalize(t) === normalized);
    const target = aliasTarget ?? exactTarget;

    return {
      sourceField,
      targetField: target ?? "",
      required: target === "email" || target === "firstName+lastName",
      confidence: target ? (aliasTarget ? 0.85 : 1) : 0,
    };
  });
}
