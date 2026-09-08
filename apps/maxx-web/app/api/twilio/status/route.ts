import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/data/supabase-client";
import { getTelephonyProvider } from "@/lib/integrations/telephony";
import { readTwilioForm, validateTwilioWebhook } from "@/lib/integrations/telephony/twilio-webhook";
import {
  findContactByPhone,
  recordProviderEvent,
  resolveTenantByPhoneNumber,
  stableCorrelationKey,
} from "@/lib/revenue-capture/runtime";

const MISSED_STATUSES = new Set(["no-answer", "busy", "failed", "canceled"]);

function renderTemplate(body: string, values: Record<string, string>): string {
  return body.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key: string) => values[key] ?? "");
}

export async function POST(request: NextRequest) {
  const params = await readTwilioForm(request);
  const signature = validateTwilioWebhook(request, params);
  if (!signature.valid) {
    return NextResponse.json({ error: "Invalid Twilio webhook signature." }, { status: 403 });
  }

  const callStatus = String(params.get("CallStatus") ?? "");
  const callSid = String(params.get("CallSid") ?? "");
  const from = String(params.get("From") ?? "");
  const to = String(params.get("To") ?? "");
  const duration = Number(params.get("CallDuration") ?? 0);
  const recordingUrl = String(params.get("RecordingUrl") ?? "") || null;
  if (!callSid || !from || !to) {
    return NextResponse.json({ error: "Missing required Twilio call fields." }, { status: 400 });
  }

  const tenant = await resolveTenantByPhoneNumber(to);
  if (!tenant) {
    return NextResponse.json({ error: "Destination number is not bound to a MAXX tenant." }, { status: 404 });
  }

  const supabase = getSupabaseClient();
  const contact = await findContactByPhone(tenant.organizationId, from);
  const isMissed = MISSED_STATUSES.has(callStatus) || (callStatus === "completed" && duration === 0);
  const occurredAt = new Date().toISOString();

  const { data: callEvent, error: callError } = await supabase
    .from("maxx_call_events")
    .upsert(
      {
        organization_id: tenant.organizationId,
        from_number: from,
        to_number: to,
        direction: "inbound",
        status: isMissed ? "missed" : recordingUrl ? "voicemail" : "completed",
        duration_seconds: Number.isFinite(duration) ? duration : 0,
        occurred_at: occurredAt,
        provider: "twilio",
        provider_call_id: callSid,
        recording_url: recordingUrl,
        updated_at: occurredAt,
      },
      { onConflict: "provider,provider_call_id" },
    )
    .select("id")
    .single();
  if (callError) {
    return NextResponse.json({ error: `Could not persist call event: ${callError.message}` }, { status: 500 });
  }

  const providerEvent = await recordProviderEvent({
    organizationId: tenant.organizationId,
    provider: "twilio",
    providerEventId: `${callSid}:status:${callStatus || "unknown"}`,
    eventType: isMissed ? "call.missed" : "call.status",
    direction: "inbound",
    contactId: contact?.id ?? null,
    connectionId: tenant.connectionId,
    correlationKey: stableCorrelationKey([tenant.organizationId, callSid]),
    payload: { from, to, callStatus, duration, hasRecording: Boolean(recordingUrl) },
    evidence: { provider: "twilio", callSid, signatureValidated: true },
    evidenceState: "VERIFIED",
    processingStatus: "processed",
  });

  if (!isMissed) {
    return NextResponse.json({ recorded: true, missed: false, providerEventId: providerEvent.id });
  }

  const [{ data: phone }, { data: rule }, { data: optOut }] = await Promise.all([
    supabase
      .from("maxx_phone_numbers")
      .select("mctb_enabled")
      .eq("organization_id", tenant.organizationId)
      .eq("number", to)
      .maybeSingle(),
    supabase
      .from("maxx_mctb_rules")
      .select("id, template_id, active")
      .eq("organization_id", tenant.organizationId)
      .eq("active", true)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("maxx_sms_opt_outs")
      .select("id")
      .eq("organization_id", tenant.organizationId)
      .eq("phone_number", from)
      .maybeSingle(),
  ]);

  let textBackStatus = "not_configured";
  let textBackSent = false;

  if (optOut) {
    textBackStatus = "opted_out";
  } else if (phone?.mctb_enabled && rule?.active && rule.template_id && tenant.connectionId) {
    const { data: template } = await supabase
      .from("maxx_sms_templates")
      .select("body, active")
      .eq("organization_id", tenant.organizationId)
      .eq("id", rule.template_id)
      .eq("active", true)
      .maybeSingle();

    if (template?.body) {
      const body = renderTemplate(template.body, {
        organization_name: tenant.organizationName,
        first_name: contact?.first_name ?? "there",
      });
      const outcome = await getTelephonyProvider().sendSms({ toNumber: from, fromNumber: to, body });
      textBackSent = outcome.success;
      textBackStatus = outcome.success ? "sent" : outcome.status;

      const { data: smsRow } = await supabase
        .from("maxx_sms_messages")
        .insert({
          organization_id: tenant.organizationId,
          to_number: from,
          from_number: to,
          body,
          status: outcome.success ? "sent" : "failed",
          direction: "outbound",
          provider: "twilio",
          provider_message_id: outcome.providerMessageId ?? null,
        })
        .select("id")
        .single();

      await recordProviderEvent({
        organizationId: tenant.organizationId,
        provider: "twilio",
        providerEventId: outcome.providerMessageId ?? `textback:${callSid}`,
        eventType: outcome.success ? "sms.sent" : "sms.send_failed",
        direction: "outbound",
        contactId: contact?.id ?? null,
        connectionId: tenant.connectionId,
        correlationKey: stableCorrelationKey([tenant.organizationId, callSid]),
        payload: { from: to, to: from, smsMessageId: smsRow?.id ?? null },
        evidence: {
          provider: "twilio",
          providerMessageId: outcome.providerMessageId ?? null,
          triggeredByCallSid: callSid,
        },
        evidenceState: outcome.providerMessageId ? "VERIFIED" : "UNKNOWN",
        processingStatus: outcome.success ? "processed" : "failed",
        errorMessage: outcome.success ? null : outcome.message,
      });
    }
  }

  const { data: missed, error: missedError } = await supabase
    .from("maxx_missed_call_events")
    .insert({
      organization_id: tenant.organizationId,
      call_event_id: callEvent.id,
      contact_id: contact?.id ?? null,
      from_number: from,
      text_back_sent: textBackSent,
      text_back_status: textBackStatus,
      occurred_at: occurredAt,
    })
    .select("id")
    .single();
  if (missedError) {
    return NextResponse.json({ error: `Could not persist missed call: ${missedError.message}` }, { status: 500 });
  }

  return NextResponse.json({
    recorded: true,
    missed: true,
    missedCallEventId: missed.id,
    textBackSent,
    textBackStatus,
    providerEventId: providerEvent.id,
  });
}
