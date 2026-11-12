import { describe, it, expect } from "vitest";
import { noConnection, summarizePayments, type PaymentEvidence } from "@/lib/restaurant-growth/ledger";
import { readSquarePayments } from "@/lib/restaurant-growth/square";

const row: PaymentEvidence = {
  id: "p1", provider: "square", recordedAt: "2026-11-10T12:00:00Z",
  currency: "USD", amountCents: 5000, refundedCents: 500, tender: "cash",
};
const options = {
  accessToken: "server-secret-test", locationId: "LOCATION_1",
  begin: "2026-11-01T00:00:00Z", end: "2026-11-07T00:00:00Z", sandbox: true,
};
function fakeSquare(body: unknown, status = 200) {
  return (async (_input: URL | RequestInfo, init?: RequestInit) => {
    const auth = new Headers(init?.headers).get("Authorization");
    expect(auth).toBe("Bearer server-secret-test");
    expect(init?.method).toBe("GET");
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
}
describe("restaurant ledger: cash and proof are distinct", () => {
  it("reconciles cash/card payments, refunds and tagged receipts without estimating lift", () => {
    const total = summarizePayments([
      row,
      { ...row, id: "p2", tender: "card", amountCents: 10000, refundedCents: 0, campaignId: "OFFICE-01" },
    ]);
    expect(total.paymentCount).toBe(2);
    expect(total.amountCents).toBe(14500);
    expect(total.cashCents).toBe(4500);
    expect(total.nonCashCents).toBe(10000);
    expect(total.refundCents).toBe(500);
    expect(total.campaignTaggedCents).toBe(10000);
    expect(total.incrementalProfitCents).toBeNull();
  });
  it("does not turn missing source data into fake zero-sales evidence", () => {
    expect(noConnection().evidence).toBe("NO_CONNECTION");
    expect(noConnection().incrementalSalesCents).toBeNull();
  });
  it("refuses duplicate IDs and impossible refund amounts", () => {
    expect(() => summarizePayments([row,row])).toThrow(/Duplicate/);
    expect(() => summarizePayments([{...row,refundedCents:9000}])).toThrow(/Invalid/);
  });
});
describe("Square read-only payment adapter", () => {
  it("reads completed cash and card, avoids PII, and excludes pending payments", async () => {
    const request = fakeSquare({ payments: [
      { id:"cash1", location_id:"LOCATION_1", created_at:"2026-11-03T12:00:00Z", status:"COMPLETED", source_type:"CASH",
        amount_money:{amount:4500,currency:"USD"}, refunded_money:{amount:500,currency:"USD"}, card_details:{name:"Never copy"} },
      { id:"pending", location_id:"LOCATION_1", created_at:"2026-11-03T13:00:00Z", status:"APPROVED", amount_money:{amount:1000,currency:"USD"} },
    ]});
    const actual = await readSquarePayments(options, request);
    expect(actual).toHaveLength(1);
    expect(actual[0]).toEqual({ id:"cash1", provider:"square", recordedAt:"2026-11-03T12:00:00Z",
      currency:"USD", amountCents:4500, refundedCents:500, tender:"cash" });
    expect(JSON.stringify(actual)).not.toContain("Never copy");
  });
  it("paginates without silently truncating results", async () => {
    let pages = 0;
    const request = (async () => {
      pages++;
      return new Response(JSON.stringify({payments: [], ...(pages===1 ? {cursor:"next"} : {})}), {status:200});
    }) as typeof fetch;
    expect(await readSquarePayments(options,request)).toEqual([]);
    expect(pages).toBe(2);
  });
  it("fails closed for bad location, currency, repeated cursor and provider errors", async () => {
    const payment = {id:"x", location_id:"OTHER", created_at:"2026-11-03T12:00:00Z", status:"COMPLETED",
      amount_money:{ amount:1000, currency:"USD" }};
    await expect(readSquarePayments(options,fakeSquare({payments:[payment]}))).rejects.toThrow(/identity/);
    await expect(readSquarePayments(options,fakeSquare({payments:[{...payment,location_id:"LOCATION_1",amount_money:{amount:1000,currency:"EUR"}}]}))).rejects.toThrow(/currency/);
    await expect(readSquarePayments(options,fakeSquare({payments:[],cursor:"loop"}))).rejects.toThrow(/repeating/);
    await expect(readSquarePayments(options,fakeSquare({},403))).rejects.toThrow(/error/);
  });
  it("refuses invalid windows, no token, and unbounded queries", async () => {
    await expect(readSquarePayments({...options,accessToken:""})).rejects.toThrow(/credentials/);
    await expect(readSquarePayments({...options,end:"2027-02-01T00:00:00Z"})).rejects.toThrow(/period/);
    await expect(readSquarePayments({...options,begin:options.end,end:options.begin})).rejects.toThrow(/period/);
  });
});
