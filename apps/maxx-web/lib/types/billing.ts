export interface BillingCustomer {
  id: string;
  organizationId: string;
  planName: string;
  status: "active" | "trialing" | "past_due";
  renewsOn: string;
}

export interface BillingEvent {
  id: string;
  organizationId: string;
  type: "invoice_paid" | "invoice_failed" | "plan_changed";
  amountUsd: number;
  occurredAt: string;
}
