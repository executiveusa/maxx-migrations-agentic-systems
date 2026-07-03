import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";
import { getIntegrationConnections } from "@/lib/mock-data/integrations";
import { phoneNumbers, smsTemplates } from "@/lib/mock-data/telephony";
import { getTelephonyProvider } from "@/lib/integrations/telephony";
import { runMissedCallTextBack } from "@/lib/integrations/telephony/mctb-engine";
import { currentOrganization } from "@/lib/mock-data/organizations";
import type { CallEvent, MissedCallEvent } from "@/lib/types/telephony";

const MISSED_STATUSES = new Set(["no-answer", "busy", "failed"]);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const callStatus = String(formData.get("CallStatus") ?? "");
  const from = String(formData.get("From") ?? "");
  const to = String(formData.get("To") ?? "");
  const duration = Number(formData.get("CallDuration") ?? 0);

  const isMissed = MISSED_STATUSES.has(callStatus) || (callStatus === "completed" && duration === 0);
  const now = new Date().toISOString();

  const callEvent: CallEvent = {
    id: `call_${Date.now()}`,
    organizationId: currentOrganization.id,
    fromNumber: from,
    toNumber: to,
    direction: "inbound",
    status: isMissed ? "missed" : "completed",
    durationSeconds: duration,
    occurredAt: now,
  };

  if (!isMissed) {
    return NextResponse.json({ recorded: true, missed: false });
  }

  const phoneNumber = phoneNumbers.find((p) => p.number === to);
  const rule = getStore().mctbRules.find((r) => r.organizationId === currentOrganization.id && r.active);
  const template = smsTemplates.find((t) => t.id === rule?.templateId);
  const twilioConnected = getIntegrationConnections().find((c) => c.provider === "twilio")?.status === "connected";

  const outcome = await runMissedCallTextBack({
    provider: getTelephonyProvider(),
    fromNumber: from,
    mctbEnabled: phoneNumber?.mctbEnabled ?? false,
    phoneConfigured: twilioConnected,
    optOuts: getStore().smsOptOuts,
    template,
    context: { organizationName: currentOrganization.name, fromNumber: from },
  });

  const missedCallEvent: MissedCallEvent = {
    id: `mc_${Date.now()}`,
    callEventId: callEvent.id,
    fromNumber: from,
    textBackSent: outcome.sent,
    textBackStatus: outcome.sent ? "sent" : outcome.reason === "opted_out" ? "opted_out" : outcome.reason === "not_configured" ? "not_configured" : "failed",
    occurredAt: now,
  };

  return NextResponse.json({ recorded: true, missed: true, missedCallEvent });
}
