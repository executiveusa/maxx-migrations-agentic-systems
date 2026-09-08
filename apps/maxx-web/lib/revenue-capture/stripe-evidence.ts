export interface StripeTenant { organizationId: string; connectionId: string | null }
export async function resolveStripeTenant<T extends StripeTenant>(accountId: string | null, hintedOrgId: string | null, lookup: (accountId: string) => Promise<T | null>): Promise<T | null> {
  if (!accountId) return null;
  const tenant = await lookup(accountId);
  if (!tenant?.connectionId) return null;
  if (hintedOrgId && hintedOrgId !== tenant.organizationId) throw new Error("Stripe tenant metadata conflicts with the bound account");
  return tenant;
}
export interface StripeEconomicEntry { entryType: "payment" | "refund"; amountCents: number; currency: string; sourceRef: string }
export function stripeEconomicEntry(type: string, object: { id?: string; amount?: number; amount_received?: number; currency?: string; status?: string }): StripeEconomicEntry | null {
  const payment = type === "payment_intent.succeeded";
  const refund = (type === "refund.created" || type === "refund.updated") && object.status === "succeeded";
  if (!payment && !refund) return null;
  const amount = payment ? object.amount_received : object.amount;
  const currency = object.currency?.toUpperCase() ?? "";
  if (!object.id || !object.id.startsWith(payment ? "pi_" : "re_") || !Number.isSafeInteger(amount) || Number(amount) < 0 || !/^[A-Z]{3}$/.test(currency)) throw new Error("Invalid Stripe economic evidence");
  return { entryType: payment ? "payment" : "refund", amountCents: Number(amount), currency, sourceRef: object.id };
}
