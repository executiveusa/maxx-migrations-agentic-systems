import type { PaymentEvidence, Tender } from "./ledger";

export interface SquareReadOptions {
  accessToken: string;
  locationId: string;
  begin: string;
  end: string;
  sandbox?: boolean;
}
interface SquarePayment {
  id?: string;
  created_at?: string;
  location_id?: string;
  status?: string;
  source_type?: string;
  amount_money?: { amount?: number; currency?: string };
  refunded_money?: { amount?: number; currency?: string };
}
interface SquarePage {
  payments?: SquarePayment[];
  cursor?: string;
  errors?: Array<{ category?: string; code?: string }>;
}
export class ProviderReadError extends Error {
  constructor(message: string) { super(message); this.name = "ProviderReadError"; }
}
export async function readSquarePayments(
  options: SquareReadOptions,
  request: typeof fetch = fetch,
): Promise<PaymentEvidence[]> {
  if (!options.accessToken || !/^[a-zA-Z0-9_-]{2,100}$/.test(options.locationId)) {
    throw new ProviderReadError("Square credentials or location configuration missing");
  }
  const start = Date.parse(options.begin);
  const end = Date.parse(options.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start ||
      end - start > 31 * 86_400_000) {
    throw new ProviderReadError("Invalid Square reporting period");
  }
  // Fixed provider origins; never accept a caller-supplied URL or merchant ID.
  const origin = options.sandbox ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
  const all: PaymentEvidence[] = [];
  const cursors = new Set<string>();
  let cursor: string | undefined;
  for (let page = 0; page < 10; page++) {
    const url = new URL("/v2/payments", origin);
    url.searchParams.set("location_id", options.locationId);
    url.searchParams.set("begin_time", new Date(start).toISOString());
    url.searchParams.set("end_time", new Date(end).toISOString());
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);
    let response: Response;
    try {
      response = await request(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
          "Square-Version": "2026-09-16",
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      });
    } catch {
      throw new ProviderReadError("Square request unavailable");
    }
    if (!response.ok) throw new ProviderReadError("Square returned an error (check credentials, scope and connection)");
    let body: SquarePage;
    try { body = await response.json() as SquarePage; } catch {
      throw new ProviderReadError("Square response was not valid JSON");
    }
    if (body.errors?.length || !Array.isArray(body.payments)) {
      throw new ProviderReadError("Square returned incomplete or unsuccessful payment data");
    }
    for (const p of body.payments) {
      if (!p.id || !p.created_at || p.location_id !== options.locationId) {
        throw new ProviderReadError("Square payment identity/tenant mismatch");
      }
      if (p.status !== "COMPLETED") continue;
      if (p.amount_money?.currency !== "USD") throw new ProviderReadError("Square payment currency mismatch");
      const amount = p.amount_money.amount;
      const refund = p.refunded_money?.amount ?? 0;
      if (!Number.isSafeInteger(amount) || !Number.isSafeInteger(refund)) {
        throw new ProviderReadError("Square payment amount invalid");
      }
      const tender: Tender = p.source_type === "CASH" ? "cash" : p.source_type === "CARD" ? "card" : "other";
      all.push({
        id: p.id, provider: "square", recordedAt: p.created_at,
        currency: "USD", amountCents: amount!, refundedCents: refund,
        tender,
        // Square's payment reference_id isn't a proven campaign tag.
      });
    }
    if (!body.cursor) return all;
    if (cursors.has(body.cursor)) throw new ProviderReadError("Square returned a repeating cursor");
    cursors.add(body.cursor);
    cursor = body.cursor;
  }
  // Better no report than misrepresenting a truncated dataset as complete.
  throw new ProviderReadError("Square result exceeded bounded pagination; choose a shorter period");
}
