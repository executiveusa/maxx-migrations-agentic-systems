import { NextRequest, NextResponse } from "next/server";
import { isStopMessage } from "@/lib/integrations/telephony/mctb-engine";
import { getStore } from "@/lib/data/store";
import { currentOrganization } from "@/lib/mock-data/organizations";

/**
 * Inbound SMS webhook. Twilio expects TwiML back. STOP replies are honored
 * immediately by recording the number in sms_opt_outs — future missed-call
 * text-backs check this list before sending (see mctb-engine.evaluateMissedCall).
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const from = String(formData.get("From") ?? "");
  const body = String(formData.get("Body") ?? "");

  if (isStopMessage(body) && from) {
    const store = getStore();
    if (!store.smsOptOuts.some((o) => o.phoneNumber === from)) {
      store.smsOptOuts.push({
        id: `optout_${Date.now()}`,
        organizationId: currentOrganization.id,
        phoneNumber: from,
        optedOutAt: new Date().toISOString(),
      });
    }
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
  return new NextResponse(twiml, { status: 200, headers: { "Content-Type": "text/xml" } });
}
