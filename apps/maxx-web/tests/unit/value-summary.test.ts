import { describe, expect, it } from "vitest";
import { summarizeValueLedger, moneyByCurrency } from "@/lib/revenue-capture/value-summary";
const row = (entry_type: string, amount_cents: number, currency = "USD", confidence = "VERIFIED") => ({ entry_type, amount_cents, currency, confidence });
describe("Value Ledger economics", () => {
  it("does not count a booking and recovery as three payments", () => {
    const result = summarizeValueLedger([row("booked_revenue",10000),row("recovered_revenue",10000),row("payment",10000),row("refund",2000)]);
    expect(result[0]?.totalsCents.VERIFIED).toBe(8000);
    expect(result[0]?.bookedCents.VERIFIED).toBe(10000);
    expect(result[0]?.recoveredCents.VERIFIED).toBe(10000);
  });
  it("does not turn leads, costs or estimates into verified cash", () => {
    const result = summarizeValueLedger([row("lead_value",50000),row("cost",1000),row("payment",2000,"USD","ESTIMATED")]);
    expect(result[0]?.totalsCents.VERIFIED).toBe(0);
    expect(result[0]?.totalsCents.ESTIMATED).toBe(2000);
  });
  it("keeps currencies separate", () => {
    const result = summarizeValueLedger([row("payment",100,"USD"),row("payment",200,"MXN")]);
    expect(result).toHaveLength(2);
    expect(moneyByCurrency([{currency:"USD",value_cents:100},{currency:"MXN",value_cents:200}])).toEqual({USD:100,MXN:200});
  });
  it("rejects duplicate economic source records", () => {
    const value = { ...row("payment",100),source_provider:"stripe",source_ref:"pi_1" };
    expect(() => summarizeValueLedger([value,value])).toThrow("Duplicate economic source");
  });
});
