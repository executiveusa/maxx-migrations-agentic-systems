import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isSeedMode } from "@/lib/data/mode";
import { resolveAuthorizedOrgId, TenantAuthorizationError } from "@/lib/auth/tenant";
import { noConnection, summarizePayments } from "@/lib/restaurant-growth/ledger";
import { ProviderReadError, readSquarePayments } from "@/lib/restaurant-growth/square";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
function equalSecrets(a: string, b: string) {
  const aa = createHash("sha256").update(a).digest();
  const bb = createHash("sha256").update(b).digest();
  return timingSafeEqual(aa, bb);
}
async function authorizedOrg(request: NextRequest): Promise<string> {
  const configured = process.env.MAXX_RESTAURANT_CLIENT_ORG_ID;
  if (!configured) throw new Error("Restaurant organization not configured");
  const auth = request.headers.get("authorization");
  if (auth) {
    const secret = process.env.MAXX_RESTAURANT_AGENT_KEY;
    if (!secret || !/^Bearer [^\s]+$/.test(auth) ||
        !equalSecrets(auth.slice(7), secret)) {
      throw new TenantAuthorizationError("Invalid restaurant agent credential", 401, "UNAUTHENTICATED");
    }
    // This key is scoped to ONE configured org, never an org supplied by the caller.
    return configured;
  }
  const sessionOrg = await resolveAuthorizedOrgId();
  if (sessionOrg !== configured) {
    throw new TenantAuthorizationError("Restaurant not authorized for this organization", 403, "NOT_A_MEMBER");
  }
  return sessionOrg;
}
export async function GET(request: NextRequest) {
  // The parent application's unconfigured seed mode bypasses session middleware.
  // Never serve provider records or agent API data when tenant auth is disabled.
  if (isSeedMode()) return json({ status: "UNAVAILABLE", reason: "Tenant authentication not configured" }, 503);
  let org: string;
  try {
    org = await authorizedOrg(request);
  } catch (error) {
    if (error instanceof TenantAuthorizationError) return json({ error: error.code }, error.status);
    return json({ status: "UNAVAILABLE", reason: "Restaurant configuration incomplete" }, 503);
  }
  const raw = request.nextUrl.searchParams.get("days") ?? "7";
  if (!/^(?:[1-9]|[12][0-9]|30)$/.test(raw)) return json({ error: "days must be 1–30" }, 400);
  const days = Number(raw);
  const token = process.env.MAXX_RESTAURANT_SQUARE_ACCESS_TOKEN;
  const location = process.env.MAXX_RESTAURANT_SQUARE_LOCATION_ID;
  const connectionOrg = process.env.MAXX_RESTAURANT_SQUARE_ORG_ID;
  if (!token || !location || connectionOrg !== org) {
    return json({
      status: "NOT_CONNECTED", source: "square", summary: noConnection(),
      integrations: { square: "NOT_CONNECTED", toast: "NOT_CONNECTED", clover: "NOT_CONNECTED", owner: "NOT_CONNECTED" },
      note: "No real POS evidence is available. A connected account is never inferred from a marketing site.",
    });
  }
  const end = new Date();
  const begin = new Date(end.getTime() - days * 86_400_000);
  try {
    const sandbox = process.env.MAXX_RESTAURANT_SQUARE_ENV !== "production";
    const payments = await readSquarePayments({
      accessToken: token, locationId: location,
      begin: begin.toISOString(), end: end.toISOString(), sandbox,
    });
    return json({
      status: sandbox ? "SANDBOX_TEST_ONLY" : "CONNECTED",
      environment: sandbox ? "sandbox" : "production",
      source: "square",
      period: { begin: begin.toISOString(), end: end.toISOString() },
      summary: summarizePayments(payments),
      integrations: { square: "CONNECTED", toast: "NOT_CONNECTED", clover: "NOT_CONNECTED", owner: "NOT_CONNECTED" },
      note: sandbox ? "TEST DATA ONLY — do not claim real restaurant transactions." : "Read-only completed payments; not a causal estimate of marketing lift or verified food-only net sales.",
    });
  } catch (error) {
    if (error instanceof ProviderReadError) return json({ status: "SOURCE_UNAVAILABLE", error: error.message }, 502);
    return json({ status: "SOURCE_UNAVAILABLE", error: "Unable to verify restaurant payment data" }, 502);
  }
}
