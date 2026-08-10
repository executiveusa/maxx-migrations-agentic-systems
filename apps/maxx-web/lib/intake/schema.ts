import { z } from "zod";

export const intakePayloadSchema = z.object({
  schema_version: z.string().default("1.0"),
  answers: z.record(z.unknown()).default({}),
  icm: z.record(z.unknown()).default({}),
  ontology: z.record(z.unknown()).default({}),
  open_questions: z.array(z.unknown()).default([]),
  evidence: z.union([z.record(z.unknown()), z.array(z.unknown())]).default({}),
});

export type IntakePayload = z.infer<typeof intakePayloadSchema>;

export function buildClientZeroNote(payload: IntakePayload): string {
  const company = readAnswer(payload.answers, "company_name") || "Unknown company";
  const outcome = readAnswer(payload.answers, "outcome_90") || "Outcome not yet specified";
  return `Client Zero intake received for ${company}. 90-day outcome: ${outcome}`;
}

function readAnswer(answers: Record<string, unknown>, key: string): string {
  const raw = answers[key];
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && "value" in raw) {
    const value = (raw as { value?: unknown }).value;
    return typeof value === "string" ? value : "";
  }
  return "";
}
