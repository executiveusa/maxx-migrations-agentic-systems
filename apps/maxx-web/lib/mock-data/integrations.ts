import type { IntegrationConnection } from "@/lib/types/integrations";
import { isIntegrationConfigured } from "@/lib/data/mode";
import { currentOrganization } from "@/lib/mock-data/organizations";

const orgId = currentOrganization.id;

export function getIntegrationConnections(): IntegrationConnection[] {
  return [
    {
      id: "int_twilio",
      organizationId: orgId,
      provider: "twilio",
      status: isIntegrationConfigured("TWILIO_ACCOUNT_SID") ? "connected" : "setup_required",
      requiredEnvVars: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"],
      configuredEnvVars: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"].filter(
        isIntegrationConfigured,
      ),
      helpUrl: "/app/settings/integrations",
    },
    {
      id: "int_meta",
      organizationId: orgId,
      provider: "meta",
      status: isIntegrationConfigured("META_ACCESS_TOKEN") ? "connected" : "setup_required",
      requiredEnvVars: ["META_ACCESS_TOKEN", "META_PAGE_ID"],
      configuredEnvVars: ["META_ACCESS_TOKEN", "META_PAGE_ID"].filter(isIntegrationConfigured),
      helpUrl: "/app/settings/integrations",
    },
    {
      id: "int_ghl",
      organizationId: orgId,
      provider: "ghl_api",
      status: isIntegrationConfigured("GHL_API_KEY") ? "connected" : "setup_required",
      requiredEnvVars: ["GHL_API_KEY", "GHL_LOCATION_ID"],
      configuredEnvVars: ["GHL_API_KEY", "GHL_LOCATION_ID"].filter(isIntegrationConfigured),
      helpUrl: "/app/settings/integrations",
    },
    {
      id: "int_supabase",
      organizationId: orgId,
      provider: "supabase",
      status: isIntegrationConfigured("NEXT_PUBLIC_SUPABASE_URL") ? "connected" : "setup_required",
      requiredEnvVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
      configuredEnvVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"].filter(
        isIntegrationConfigured,
      ),
      helpUrl: "/app/settings/integrations",
    },
    {
      id: "int_postiz",
      organizationId: orgId,
      provider: "postiz",
      status: isIntegrationConfigured("POSTIZ_API_KEY") ? "connected" : "setup_required",
      requiredEnvVars: ["POSTIZ_API_KEY"],
      configuredEnvVars: ["POSTIZ_API_KEY"].filter(isIntegrationConfigured),
      helpUrl: "/app/settings/integrations",
    },
  ];
}
