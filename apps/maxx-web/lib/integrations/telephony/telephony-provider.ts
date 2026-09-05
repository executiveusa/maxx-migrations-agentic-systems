export interface SendSmsRequest {
  toNumber: string;
  body: string;
  /** Tenant-owned sending number. Falls back to TWILIO_PHONE_NUMBER for single-number installs. */
  fromNumber?: string;
}

export interface SendSmsResult {
  success: boolean;
  status: "sent" | "setup_required" | "failed";
  message: string;
  /** Provider-native identifier used as evidence and for delivery-status correlation. */
  providerMessageId?: string;
}

export interface TelephonyProvider {
  readonly name: string;
  isConfigured(): boolean;
  sendSms(request: SendSmsRequest): Promise<SendSmsResult>;
}
