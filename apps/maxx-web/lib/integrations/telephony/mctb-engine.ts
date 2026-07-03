import type { SmsOptOut, SmsTemplate } from "@/lib/types/telephony";
import type { TelephonyProvider } from "@/lib/integrations/telephony/telephony-provider";

export interface MctbContext {
  organizationName: string;
  fromNumber: string;
  bookingLink?: string;
}

export interface MctbDecision {
  shouldSend: boolean;
  reason: string;
  renderedBody?: string;
}

const STOP_KEYWORDS = ["stop", "unsubscribe", "cancel", "end", "quit"];

export function isStopMessage(body: string): boolean {
  return STOP_KEYWORDS.includes(body.trim().toLowerCase());
}

export function renderTemplate(template: SmsTemplate, context: MctbContext): string {
  return template.body
    .replaceAll("{{organizationName}}", context.organizationName)
    .replaceAll("{{bookingLink}}", context.bookingLink ?? "")
    .trim();
}

export function evaluateMissedCall({
  fromNumber,
  mctbEnabled,
  phoneConfigured,
  optOuts,
  template,
  context,
}: {
  fromNumber: string;
  mctbEnabled: boolean;
  phoneConfigured: boolean;
  optOuts: SmsOptOut[];
  template: SmsTemplate | undefined;
  context: MctbContext;
}): MctbDecision {
  if (!phoneConfigured) {
    return { shouldSend: false, reason: "not_configured" };
  }
  if (!mctbEnabled) {
    return { shouldSend: false, reason: "mctb_disabled" };
  }
  if (optOuts.some((o) => o.phoneNumber === fromNumber)) {
    return { shouldSend: false, reason: "opted_out" };
  }
  if (!template) {
    return { shouldSend: false, reason: "no_template" };
  }
  return { shouldSend: true, reason: "ok", renderedBody: renderTemplate(template, context) };
}

export async function runMissedCallTextBack(params: {
  provider: TelephonyProvider;
  fromNumber: string;
  mctbEnabled: boolean;
  phoneConfigured: boolean;
  optOuts: SmsOptOut[];
  template: SmsTemplate | undefined;
  context: MctbContext;
}) {
  const decision = evaluateMissedCall(params);
  if (!decision.shouldSend || !decision.renderedBody) {
    return { sent: false, reason: decision.reason };
  }
  const result = await params.provider.sendSms({
    toNumber: params.fromNumber,
    body: decision.renderedBody,
  });
  return { sent: result.success, reason: result.status, providerMessage: result.message };
}
