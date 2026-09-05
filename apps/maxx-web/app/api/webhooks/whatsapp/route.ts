import { NextRequest, NextResponse } from "next/server";
import { verifyWhatsAppSignature } from "@/lib/integrations/whatsapp";
import {
  recordProviderEvent,
  resolveTenantByProviderAccount,
  stableCorrelationKey,
} from "@/lib/revenue-capture/runtime";

type WhatsAppMessage = {
  id?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
};

type WhatsAppStatus = {
  id?: string;
  status?: string;
  timestamp?: string;
  recipient_id?: string;
};

type WhatsAppPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        metadata?: { phone_number_id?: string; display_phone_number?: string };
        messages?: WhatsAppMessage[];
        statuses?: WhatsAppStatus[];
      };
    }>;
  }>;
};

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");
  const expected = process.env.WHATSAPP_VERIFY_TOKEN;
  if (mode === "subscribe" && expected && token === expected && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Webhook verification failed." }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!verifyWhatsAppSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid WhatsApp webhook signature." }, { status: 403 });
  }

  let payload: WhatsAppPayload;
  try {
    payload = JSON.parse(rawBody) as WhatsAppPayload;
  } catch {
    return NextResponse.json({ error: "Invalid WhatsApp JSON." }, { status: 400 });
  }

  const results: Array<{ id: string; type: string }> = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value ?? {};
      const phoneNumberId = value.metadata?.phone_number_id;
      if (!phoneNumberId) continue;
      const tenant = await resolveTenantByProviderAccount("whatsapp_business", phoneNumberId);
      if (!tenant) continue;

      for (const message of value.messages ?? []) {
        if (!message.id) continue;
        const occurredAt = message.timestamp
          ? new Date(Number(message.timestamp) * 1000).toISOString()
          : new Date().toISOString();
        const event = await recordProviderEvent({
          organizationId: tenant.organizationId,
          provider: "whatsapp_business",
          providerEventId: message.id,
          eventType: "message.received",
          direction: "inbound",
          connectionId: tenant.connectionId,
          correlationKey: stableCorrelationKey([tenant.organizationId, message.from, phoneNumberId]),
          occurredAt,
          payload: {
            from: message.from ?? null,
            phoneNumberId,
            messageType: message.type ?? "unknown",
            textLength: message.text?.body?.length ?? 0,
          },
          evidence: { providerMessageId: message.id, signatureValidated: true },
          evidenceState: "VERIFIED",
          processingStatus: "processed",
        });
        results.push({ id: event.id, type: "message.received" });
      }

      for (const status of value.statuses ?? []) {
        if (!status.id || !status.status) continue;
        const occurredAt = status.timestamp
          ? new Date(Number(status.timestamp) * 1000).toISOString()
          : new Date().toISOString();
        const event = await recordProviderEvent({
          organizationId: tenant.organizationId,
          provider: "whatsapp_business",
          providerEventId: `${status.id}:${status.status}`,
          eventType: `message.${status.status}`,
          direction: "inbound",
          connectionId: tenant.connectionId,
          correlationKey: stableCorrelationKey([tenant.organizationId, status.id]),
          occurredAt,
          payload: { providerMessageId: status.id, recipientId: status.recipient_id ?? null },
          evidence: { providerMessageId: status.id, signatureValidated: true, providerStatus: status.status },
          evidenceState: "VERIFIED",
          processingStatus: "processed",
        });
        results.push({ id: event.id, type: `message.${status.status}` });
      }
    }
  }

  return NextResponse.json({ received: true, events: results.length });
}
