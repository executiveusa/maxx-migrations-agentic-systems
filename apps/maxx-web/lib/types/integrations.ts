export type IntegrationProvider =
  | "twilio"
  | "meta"
  | "ghl_api"
  | "supabase"
  | "postiz";

export interface IntegrationConnection {
  id: string;
  organizationId: string;
  provider: IntegrationProvider;
  status: "connected" | "setup_required" | "error";
  requiredEnvVars: string[];
  configuredEnvVars: string[];
  helpUrl: string;
}
