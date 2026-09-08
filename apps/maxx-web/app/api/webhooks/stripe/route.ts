import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/data/supabase-client";
import { verifyStripeWebhook } from "@/lib/integrations/stripe-webhook";
import {
  recordProviderEvent,
  recordValueLedgerEntry,
  resolveTenantByProviderAccount,
  stableCorrelationKey,
} from "@/lib/revenue-capture/runtime";

type StripeObject = {
  id?: string;
  amount?: number;
  amount_received?: number;
  amount_total?: number;
  currency?: string;
  customer_email?: string;
  receipt_email?: string;
  client_reference_id?: string;
  metadata?: Record<string, string>;
};

type StripeEvent = {
  id: string;
  type: string;
  account?: string;
  created?: number;
  data?: { object?: StripeObject };
};

async function resolveTenant(event: StripeEvent, object: StripeObject) {
  if (event.account) {
    const bound = await resolveTenantByProviderAccount("stripe", event.account);
    if (bound) return bound;
  }

  const hintedOrgId = object.metadata?.maxx_organization_id;
  if (!hintedOrgId) return null;
  const supabase = getSupabaseClient();
  const { data: connection, error } = await supabase
    .from("maxx_integration_connections")
    .select("id, organization_id, status, maxx_organizations(name)")
    .eq("provider", "stripe")
    .eq("organization_id", hintedOrgId)
    .eq("status", "connected")
    .maybeSingle();
  if (error || !connection) return null;
  const joined = connection.maxx_organizations as { name?: string } | Array<{ name?: string }> | null;
  return {
    organizationId: connection.organization_id,
    organizationName: Array.isArray(joined) ? joined[0]?.name ?? "the business" : joined?.name ?? "the business",
    connectionId: connection.id,
  };
}

function paymentAmount(object: StripeObject): number | null {
  const value = object.amount_received ?? object.amount_total ?? object.amount;
  return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : null;
}

/**
 * Stripe can emit Checkout, PaymentIntent, and Charge lifecycle events for one purchase.
 * Keep all signed events as evidence, but create the economic ledger entry only from the
 * successful PaymentIntent. Stripe documents a PaymentIntent as the payment lifecycle
 * object that typically maps to one cart/session, while retries can create multiple Charges.
 */
function shouldCreatePaymentLedgerEntry(type: string): boolean {
  return type === "payment_intent.succeeded";
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const verified = verifyStripeWebhook(rawBody, request.headers.get("stripe-signature"));
  if (!verified.valid) {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 403 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Invalid Stripe event JSON." }, { status: 400 });
  }
  if (!event.id || !event.type) {
    return NextResponse.json({ error: "Missing Stripe event identity." }, { status: 400 });
  }

  const object = event.data?.object ?? {};
  const tenant = await resolveTenant(event, object);
  if (!tenant) {
    return NextResponse.json({ error: "Stripe account is not bound to a MAXX tenant." }, { status: 404 });
  }

  const opportunityId = object.metadata?.maxx_opportunity_id ?? null;
  const supabase = getSupabaseClient();
  let contactId: string | null = null;
  const email = object.customer_email ?? object.receipt_email ?? null;
  if (email) {
    const { data: contact } = await supabase
      .from("maxx_contacts")
      .select("id")
      .eq("organization_id", tenant.organizationId)
      .ilike("email", email)
      .limit(1)
      .maybeSingle();
    contactId = contact?.id ?? null;
  }

  const occurredAt = event.created ? new Date(event.created * 1000).toISOString() : new Date().toISOString();
  const providerEvent = await recordProviderEvent({
    organizationId: tenant.organizationId,
    provider: "stripe",
    providerEventId: event.id,
    eventType: event.type,
    direction: "inbound",
    contactId,
    opportunityId,
    connectionId: tenant.connectionId,
    correlationKey: stableCorrelationKey([tenant.organizationId, opportunityId, object.id ?? event.id]),
    occurredAt,
    payload: {
      objectId: object.id ?? null,
      amountCents: paymentAmount(object),
      currency: object.currency ?? null,
      hasCustomerEmail: Boolean(email),
    },
    evidence: {
      provider: "stripe",
      stripeEventId: event.id,
      stripeObjectId: object.id ?? null,
      signatureValidated: true,
    },
    evidenceState: "VERIFIED",
    processingStatus: "processed",
  });

  const amountCents = paymentAmount(object);
  if (shouldCreatePaymentLedgerEntry(event.type) && amountCents !== null) {
    await recordValueLedgerEntry({
      organizationId: tenant.organizationId,
      contactId,
      opportunityId,
      providerEventId: providerEvent.id,
      entryType: "payment",
      amountCents,
      currency: (object.currency ?? "usd").toUpperCase(),
      confidence: "VERIFIED",
      sourceProvider: "stripe",
      sourceRef: object.id ?? event.id,
      attributionModel: opportunityId ? "explicit_opportunity_metadata" : "provider_payment_only",
      attributionReason: opportunityId
        ? "Stripe PaymentIntent carried a MAXX opportunity id in signed provider metadata."
        : "PaymentIntent success is verified, but no opportunity-level attribution was supplied.",
      evidence: {
        stripeEventId: event.id,
        paymentIntentId: object.id ?? null,
        signatureValidated: true,
      },
      occurredAt,
    });
  }

  return NextResponse.json({ received: true, providerEventId: providerEvent.id });
}
