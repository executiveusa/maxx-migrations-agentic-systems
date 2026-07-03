import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { currentOrganization } from "@/lib/mock-data/organizations";

export const metadata: Metadata = { title: "Billing" };

const billingHistory = [
  { id: "inv_1", label: "Sovereign install — final payment", amount: 8500, date: "2025-11-15" },
  { id: "inv_2", label: "Sovereign install — deposit", amount: 4250, date: "2025-10-01" },
];

export default function BillingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Billing"
        description="Your install plan and technology partner retainer, if enabled."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Current plan</h3>
          <p className="text-sm text-text">{currentOrganization.plan.replace(/_/g, " ")}</p>
          <div className="mt-3"><StatusPill status="active" /></div>
          <p className="mt-4 text-xs text-muted">
            Sovereign installs are one-time engagements. The optional AI technology partner retainer
            renews monthly and covers maintenance, agent monitoring, and design updates.
          </p>
        </Card>
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold text-text">Billing history</h3>
          <ul className="space-y-3">
            {billingHistory.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-text">{item.label}</p>
                  <p className="text-xs text-muted">{item.date}</p>
                </div>
                <p className="font-medium text-text">${item.amount.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
