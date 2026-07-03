import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { getIntegrationConnections } from "@/lib/mock-data/integrations";

export const metadata: Metadata = { title: "Integrations" };

const providerLabels: Record<string, { name: string; description: string }> = {
  twilio: { name: "Twilio", description: "Powers SMS and voice for Missed Call Text Back." },
  meta: { name: "Meta (Facebook & Instagram)", description: "Publishes posts scheduled in the Social Media Planner." },
  ghl_api: { name: "GoHighLevel API", description: "Enables live GHL import without a CSV export." },
  supabase: { name: "Supabase", description: "Your sovereign database — contacts, pipelines, community, and more." },
  postiz: { name: "Postiz", description: "Optional alternative scheduling backend for social publishing." },
};

export default function IntegrationsPage() {
  const connections = getIntegrationConnections();
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Integrations"
        description="Connect the external services your CRM depends on. Nothing here fakes a successful connection — each card shows exactly what's missing."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {connections.map((connection) => {
          const info = providerLabels[connection.provider];
          return (
            <Card key={connection.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-text">{info?.name}</h3>
                  <p className="mt-1 text-sm text-muted">{info?.description}</p>
                </div>
                <StatusPill status={connection.status} />
              </div>
              <div className="mt-4 space-y-1">
                {connection.requiredEnvVars.map((envVar) => (
                  <p key={envVar} className="font-mono text-xs text-muted">
                    {connection.configuredEnvVars.includes(envVar) ? "✓" : "○"} {envVar}
                  </p>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
