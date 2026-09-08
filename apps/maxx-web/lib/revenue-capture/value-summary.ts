export const CONFIDENCE = ["VERIFIED", "ATTRIBUTED", "ESTIMATED", "UNKNOWN"] as const;
export type Confidence = (typeof CONFIDENCE)[number];
export type MoneyTotals = Record<Confidence, number>;
export interface LedgerRow {
  entry_type: string;
  amount_cents: number;
  currency: string;
  confidence: string;
  source_provider?: string | null;
  source_ref?: string | null;
}
export interface CurrencySummary {
  currency: string;
  totalsCents: MoneyTotals;
  recoveredCents: MoneyTotals;
  bookedCents: MoneyTotals;
  otherCents: MoneyTotals;
}
const empty = (): MoneyTotals => ({ VERIFIED: 0, ATTRIBUTED: 0, ESTIMATED: 0, UNKNOWN: 0 });
export function summarizeValueLedger(rows: LedgerRow[]): CurrencySummary[] {
  const groups = new Map<string, CurrencySummary>();
  const seen = new Set<string>();
  for (const row of rows) {
    const currency = (row.currency || "").toUpperCase();
    const amount = Number(row.amount_cents);
    if (!/^[A-Z]{3}$/.test(currency) || !Number.isSafeInteger(amount)) throw new Error("Invalid ledger currency or amount");
    const confidence = CONFIDENCE.includes(row.confidence as Confidence) ? row.confidence as Confidence : "UNKNOWN";
    const sourceKey = row.source_provider && row.source_ref ? JSON.stringify([currency, row.entry_type, row.source_provider, row.source_ref]) : null;
    if (sourceKey && seen.has(sourceKey)) throw new Error("Duplicate economic source in Value Ledger");
    if (sourceKey) seen.add(sourceKey);
    let group = groups.get(currency);
    if (!group) {
      group = { currency, totalsCents: empty(), recoveredCents: empty(), bookedCents: empty(), otherCents: empty() };
      groups.set(currency, group);
    }
    // Only actual payment evidence is additive cash. Booking and recovery are
    // separate classifications, never additional cash from the same sale.
    if (row.entry_type === "payment") group.totalsCents[confidence] += amount;
    else if (row.entry_type === "refund") group.totalsCents[confidence] -= Math.abs(amount);
    else if (row.entry_type === "booked_revenue") group.bookedCents[confidence] += amount;
    else if (row.entry_type === "recovered_revenue") group.recoveredCents[confidence] += amount;
    else group.otherCents[confidence] += amount;
  }
  return [...groups.values()].sort((a, b) => a.currency.localeCompare(b.currency));
}
export function singleCurrency(groups: CurrencySummary[], currency = "USD") {
  return groups.find((group) => group.currency === currency) ?? { currency, totalsCents: empty(), recoveredCents: empty(), bookedCents: empty(), otherCents: empty() };
}
export function moneyByCurrency(rows: Array<{ currency: string; value_cents: number | null }>) {
  const totals: Record<string, number> = {};
  for (const row of rows) {
    const currency = (row.currency || "").toUpperCase();
    const value = Number(row.value_cents ?? 0);
    if (!/^[A-Z]{3}$/.test(currency) || !Number.isSafeInteger(value)) throw new Error("Invalid opportunity currency or amount");
    totals[currency] = (totals[currency] ?? 0) + value;
  }
  return totals;
}
