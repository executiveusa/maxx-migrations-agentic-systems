import { NextRequest, NextResponse } from "next/server";
import { currentOrganization } from "@/lib/mock-data/organizations";

/**
 * Twilio voice webhook. Twilio expects TwiML back, not JSON. This greets the
 * caller and records a voicemail if no one picks up — the resulting call
 * status (including missed/no-answer) is reported separately to
 * /api/twilio/status, which drives the missed-call text-back flow.
 */
export async function POST(request: NextRequest) {
  await request.formData().catch(() => null);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thanks for calling ${currentOrganization.name}. Please leave a message after the tone, and we'll text you back shortly.</Say>
  <Record maxLength="120" playBeep="true" />
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
