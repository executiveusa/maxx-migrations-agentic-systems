import type { SendSmsRequest, SendSmsResult, TelephonyProvider } from "@/lib/integrations/telephony/telephony-provider";
import { isIntegrationConfigured } from "@/lib/data/mode";

export class TwilioProvider implements TelephonyProvider {
  readonly name = "twilio";

  isConfigured(): boolean {
    return (
      isIntegrationConfigured("TWILIO_ACCOUNT_SID") &&
      isIntegrationConfigured("TWILIO_AUTH_TOKEN") &&
      isIntegrationConfigured("TWILIO_PHONE_NUMBER")
    );
  }

  async sendSms(request: SendSmsRequest): Promise<SendSmsResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        status: "setup_required",
        message:
          "Twilio connection required. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in Settings → Integrations.",
      };
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: request.toNumber,
            From: fromNumber ?? "",
            Body: request.body,
          }),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        return { success: false, status: "failed", message: `Twilio API error: ${body}` };
      }

      return { success: true, status: "sent", message: `SMS sent to ${request.toNumber} via Twilio.` };
    } catch (error) {
      return {
        success: false,
        status: "failed",
        message: `Twilio request failed: ${error instanceof Error ? error.message : "unknown error"}`,
      };
    }
  }
}
