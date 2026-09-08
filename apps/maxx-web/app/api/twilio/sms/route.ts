import { NextRequest, NextResponse } from "next/server";
import { isStopMessage } from "@/lib/integrations/telephony/mctb-engine";
import { getSupabaseClient } from "@/lib/data/supabase-client";
import { readTwilioForm, validateTwilioWebhook } from "@/lib/integrations/telephony/twilio-webhook";
import {
  findContactByPhone,
  recordProviderEvent,
  resolveTenantByPhoneNumber,
  stableCorrelationKey,
} from "@/lib/revenue-capture/runtime";

const EMPTY_TWIML = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

/**
 * Signed inbound SMS webhook.
 * Tenant identity comes from the destination phone number, never demo/mock state.
 * STOP-family messages are persisted before the webhook acknowledges receipt.
 */
export async function POST(request: NextRequest) {
  const params = await readTwilioForm(request);
  const signature = validateTwilioWebhook(request, params);
  if (!signature.valid) {
    return NextResponse.json({ error: "Invalid Twilio webhook signature." }, { status: 403 });
  }

  const from = String(params.get("From") ?? "");
  const to = String(params.get("To") ?? "");
  const body = String(params.get("Body") ?? "");
  const messageSid = String(params.get("MessageSid") ?? params.get("SmsSid") ?? "");
  if (!from || !to || !messageSid) {
    return NextResponse.json({ error: "Missing required Twilio message fields." }, { status: 400 });
  }

  const tenant = await resolveTenantByPhoneNumber(to);
  if (!tenant) {
    // Do not assign unknown traffic to a fallback organization.
    return NextResponse.json({ error: "Destination number is not bound to a MAXX tenant." }, { status: 404 });
  }

  const contact = await findContactByPhone(tenant.organizationId, from);
  const event = await recordProviderEvent({
    organizationId: tenant.organizationId,
    provider: "twilio",
    providerEventId: messageSid,
    eventType: isStopMessage(body) ? "sms.opt_out" : "sms.received",
    direction: "inbound",
    contactId: contact?.id ?? null,
    connectionId: tenant.connectionId,
    correlationKey: stableCorrelationKey([tenant.organizationId, from, to]),
    payload: {
      from,
      to,
      body,
      numMedia: Number(params.get("NumMedia") ?? 0),
    },
    evidence: {
      provider: "twilio",
      messageSid,
      signatureValidated: true,
    },
    evidenceState: "VERIFIED",
    processingStatus: "processed",
  });

  if (isStopMessage(body)) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("maxx_sms_opt_outs").upsert(
      {
        organization_id: tenant.organizationId,
        phone_number: from,
        opted_out_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "organization_id,phone_number" },
    );
    if (error) {
      await recordProviderEvent({
        organizationId: tenant.organizationId,
        provider: "maxx",
        providerEventId: `optout-failure:${event.id}`,
        eventType: "sms.opt_out.persistence_failed",
        direction: "internal",
        contactId: contact?.id ?? null,
        correlationKey: stableCorrelationKey([tenant.organizationId, from, "optout"]),
        evidenceState: "VERIFIED",
        processingStatus: "failed",
        errorMessage: error.message,
      });
      return NextResponse.json({ error: "Could not persist opt-out." }, { status: 500 });
    }
  }

  return new NextResponse(EMPTY_TWIML, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
