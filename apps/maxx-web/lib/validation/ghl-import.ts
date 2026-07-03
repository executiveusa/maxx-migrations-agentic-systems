import { z } from "zod";

export const ghlObjectTypes = [
  "contacts",
  "opportunities",
  "pipelines",
  "stages",
  "notes",
  "tasks",
  "appointments",
  "conversations",
  "tags",
  "custom_fields",
] as const;

export const ghlImportMappingSchema = z.object({
  sourceField: z.string().min(1),
  targetField: z.string().min(1),
  required: z.boolean().default(false),
});

export const ghlImportSchema = z.object({
  source: z.enum(["csv", "ghl_api"]),
  objects: z.array(z.enum(ghlObjectTypes)).min(1, "Select at least one object to import."),
  mappings: z.array(ghlImportMappingSchema).default([]),
});

export type GhlImportInput = z.infer<typeof ghlImportSchema>;
