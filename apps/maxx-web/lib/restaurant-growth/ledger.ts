/** Restaurant payment evidence. Never confuse payment attribution with causal lift. */
export type Tender = "cash" | "card" | "other";
export interface PaymentEvidence {
  id: string;
  provider: "square" | "csv" | "toast" | "clover";
  recordedAt: string;
  currency: "USD";
  amountCents: number; // charge, excluding tips, can include sales tax
  refundedCents: number;
  tender: Tender;
  campaignId?: string; // only independently reconciled, never inferred from ad clicks
}
export interface PaymentSummary {
  evidence: "VERIFIED_PROVIDER_PAYMENTS" | "NO_CONNECTION";
  paymentCount: number;
  amountCents: number; // payment volume less refunds, excl tips; NOT net sales or incremental sales
  refundCents: number;
  cashCents: number;
  nonCashCents: number;
  campaignTaggedCents: number;
  untaggedCents: number;
  currency: "USD";
  incrementalSalesCents: null;
  incrementalProfitCents: null;
  caveat: string;
}
const caveat = "Completed payment volume excluding tips, less refunds. May include tax and is not equivalent to net sales. Tagged purchases are not proven incremental. Refunds or offline payments can post later.";
const safe = (n: number) => Number.isSafeInteger(n) && n >= 0 && n <= 100_000_000;
export function summarizePayments(evidence: PaymentEvidence[]): PaymentSummary {
  const seen = new Set<string>();
  const summary: PaymentSummary = {
    evidence: "VERIFIED_PROVIDER_PAYMENTS", paymentCount: 0, amountCents: 0,
    refundCents: 0, cashCents: 0, nonCashCents: 0, campaignTaggedCents: 0,
    untaggedCents: 0, currency: "USD", incrementalSalesCents: null,
    incrementalProfitCents: null, caveat,
  };
  for (const row of evidence) {
    if (!row.id || !row.provider || row.currency !== "USD" ||
      !safe(row.amountCents) || !safe(row.refundedCents) ||
      row.refundedCents > row.amountCents ||
      !["cash", "card", "other"].includes(row.tender) ||
      !Number.isFinite(Date.parse(row.recordedAt))) {
      throw new Error("Invalid payment evidence: fail closed");
    }
    const key = row.provider + ":" + row.id;
    if (seen.has(key)) throw new Error("Duplicate provider payment ID: fail closed");
    seen.add(key);
    const value = row.amountCents - row.refundedCents;
    summary.paymentCount++;
    summary.amountCents += value;
    summary.refundCents += row.refundedCents;
    if (row.tender === "cash") summary.cashCents += value;
    else summary.nonCashCents += value;
    if (row.campaignId) summary.campaignTaggedCents += value;
    else summary.untaggedCents += value;
  }
  if (![summary.amountCents, summary.refundCents, summary.cashCents, summary.nonCashCents].every(Number.isSafeInteger)) {
    throw new Error("Payment totals exceed safe range");
  }
  return summary;
}
export function noConnection(): PaymentSummary {
  return { ...summarizePayments([]), evidence: "NO_CONNECTION" };
}
