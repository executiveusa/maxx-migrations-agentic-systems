import { NextRequest, NextResponse } from "next/server";
import { readTwilioForm, validateTwilioWebhook } from "@/lib/integrations/telephony/twilio-webhook";
import {
  findContactByPhone,
  recordProviderEvent,
  resolveTenantByPhoneNumber,
  stableCorrelationKey,
} from "@/lib/revenue-capture/runtime";

function xmlEscape(value: string): string {
  return value.replace(/[<>&'\"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[char] ?? char);
}

/** Signed inbound voice webhook with destination-number tenant resolution. */
export async function POST(request: NextRequest) {
  const params = await readTwilioForm(request);
  const signature = validateTwilioWebhook(request, params);
  if (!signature.valid) {
    return NextResponse.json({ error: "Invalid Twilio webhook signature." }, { status: 403 });
  }

  const from = String(params.get("From") ?? "");
  const to = String(params.get("To") ?? "");
  const callSid = String(params.get("CallSid") ?? "");
  if (!from || !to || !callSid) {
    return NextResponse.json({ error: "Missing required Twilio call fields." }, { status: 400 });
  }

  const tenant = await resolveTenantByPhoneNumber(to);
  if (!tenant) {
    return NextResponse.json({ error: "Destination number is not bound to a MAXX tenant." }, { status: 404 });
  }

  const contact = await findContactByPhone(tenant.organizationId, from);
  await recordProviderEvent({
    organizationId: tenant.organizationId,
    provider: "twilio",
    providerEventId: `${callSid}:voice`,
    eventType: "call.received",
    direction: "inbound",
    contactId: contact?.id ?? null,
    connectionId: tenant.connectionId,
    correlationKey: stableCorrelationKey([tenant.organizationId, callSid]),
    payload: { from, to },
    evidence: { provider: "twilio", callSid, signatureValidated: true },
    evidenceState: "VERIFIED",
    processingStatus: "processed",
  });

  const organizationName = xmlEscape(tenant.organizationName);
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thanks for calling ${organizationName}. Please leave a message after the tone, and we'll text you back shortly.</Say>
  <Record maxLength="120" playBeep="true" />
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
