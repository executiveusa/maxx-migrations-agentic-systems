import { NextRequest, NextResponse } from "next/server";
import { verifyResendWebhook } from "@/lib/integrations/email";
import { recordProviderEvent, resolveTenantByProviderAccount, stableCorrelationKey } from "@/lib/revenue-capture/runtime";

type EmailEvent = {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    message_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
  };
};

function emailDomain(value: string): string | null {
  const match = value.toLowerCase().match(/@([^>\s,]+)>?$/);
  return match?.[1] ?? null;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const verified = verifyResendWebhook({
    rawBody,
    id: request.headers.get("svix-id"),
    timestamp: request.headers.get("svix-timestamp"),
    signature: request.headers.get("svix-signature"),
  });
  if (!verified) {
    return NextResponse.json({ error: "Invalid email webhook signature." }, { status: 403 });
  }

  let event: EmailEvent;
  try {
    event = JSON.parse(rawBody) as EmailEvent;
  } catch {
    return NextResponse.json({ error: "Invalid email webhook JSON." }, { status: 400 });
  }

  const data = event.data ?? {};
  const providerMessageId = data.email_id ?? data.message_id;
  if (!event.type || !providerMessageId) {
    return NextResponse.json({ error: "Email event is missing provider identity." }, { status: 400 });
  }

  const candidateAddresses = event.type === "email.received" ? data.to ?? [] : data.from ? [data.from] : [];
  let tenant = null;
  for (const address of candidateAddresses) {
    const domain = emailDomain(address);
    if (!domain) continue;
    tenant = await resolveTenantByProviderAccount("email", domain);
    if (tenant) break;
  }
  if (!tenant) {
    return NextResponse.json({ error: "Email domain is not bound to a MAXX tenant." }, { status: 404 });
  }

  const providerEvent = await recordProviderEvent({
    organizationId: tenant.organizationId,
    provider: "email",
    providerEventId: `${providerMessageId}:${event.type}`,
    eventType: event.type,
    direction: event.type === "email.received" ? "inbound" : "outbound",
    connectionId: tenant.connectionId,
    correlationKey: stableCorrelationKey([tenant.organizationId, data.message_id ?? providerMessageId]),
    occurredAt: event.created_at ?? new Date().toISOString(),
    payload: {
      emailId: data.email_id ?? null,
      messageId: data.message_id ?? null,
      recipientCount: data.to?.length ?? 0,
      hasSubject: Boolean(data.subject),
    },
    evidence: {
      provider: "resend",
      emailId: data.email_id ?? null,
      messageId: data.message_id ?? null,
      signatureValidated: true,
      providerEventType: event.type,
    },
    evidenceState: "VERIFIED",
    processingStatus: "processed",
  });

  return NextResponse.json({ received: true, providerEventId: providerEvent.id });
}
