export interface SendSmsRequest {
  toNumber: string;
  body: string;
}

export interface SendSmsResult {
  success: boolean;
  status: "sent" | "setup_required" | "failed";
  message: string;
}

export interface TelephonyProvider {
  readonly name: string;
  isConfigured(): boolean;
  sendSms(request: SendSmsRequest): Promise<SendSmsResult>;
}
