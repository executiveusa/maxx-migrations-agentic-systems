import { z } from "zod";

export const migrationJobSchema = z.object({
  sourceUrl: z.string().url("Enter a valid URL, including https://."),
});

export type MigrationJobInput = z.infer<typeof migrationJobSchema>;
