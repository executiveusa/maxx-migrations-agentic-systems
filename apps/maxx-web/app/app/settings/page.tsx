import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { currentOrganization, organizationMembers } from "@/lib/mock-data/organizations";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Organization settings"
        description="Manage your organization profile, team, integrations, and billing."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Organization</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Name</dt><dd className="text-text">{currentOrganization.name}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Mission focus</dt><dd className="text-text">{currentOrganization.missionFocus}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Plan</dt><dd className="text-text">{currentOrganization.plan.replace(/_/g, " ")}</dd></div>
          </dl>
        </Card>
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Team</h3>
          <ul className="space-y-2">
            {organizationMembers.map((member) => (
              <li key={member.id} className="flex items-center justify-between text-sm">
                <span className="text-text">{member.name}</span>
                <span className="text-muted">{member.role}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-2 font-display text-lg font-semibold text-text">Integrations</h3>
          <p className="mb-4 text-sm text-muted">Connect Twilio, Meta, GHL, and Supabase.</p>
          <Link href="/app/settings/integrations" className="text-sm font-medium text-accent">Manage integrations →</Link>
        </Card>
        <Card>
          <h3 className="mb-2 font-display text-lg font-semibold text-text">Billing</h3>
          <p className="mb-4 text-sm text-muted">View your plan, renewal date, and billing history.</p>
          <Link href="/app/settings/billing" className="text-sm font-medium text-accent">Manage billing →</Link>
        </Card>
      </div>
    </>
  );
}
