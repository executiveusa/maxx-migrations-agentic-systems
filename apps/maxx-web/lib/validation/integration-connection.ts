import { z } from "zod";

export const integrationProviders = ["twilio", "meta", "ghl_api", "supabase", "postiz"] as const;

export const integrationConnectionSchema = z.object({
  provider: z.enum(integrationProviders),
  status: z.enum(["connected", "setup_required", "error"]),
});

export type IntegrationConnectionInput = z.infer<typeof integrationConnectionSchema>;
