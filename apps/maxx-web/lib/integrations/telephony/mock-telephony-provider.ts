import type { SendSmsRequest, SendSmsResult, TelephonyProvider } from "@/lib/integrations/telephony/telephony-provider";

export class MockTelephonyProvider implements TelephonyProvider {
  readonly name = "mock";

  isConfigured(): boolean {
    return true;
  }

  async sendSms(request: SendSmsRequest): Promise<SendSmsResult> {
    if (!request.body.trim()) {
      return { success: false, status: "failed", message: "Message body cannot be empty." };
    }
    return {
      success: true,
      status: "sent",
      message: `Local mock SMS sent to ${request.toNumber}.`,
    };
  }
}
