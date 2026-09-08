import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

function signatureBase(url: string, params: URLSearchParams): string {
  const keys = Array.from(new Set(Array.from(params.keys()))).sort();
  let value = url;
  for (const key of keys) {
    for (const item of params.getAll(key)) value += `${key}${item}`;
  }
  return value;
}

function constantTimeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Twilio signs the exact webhook URL plus sorted form fields with HMAC-SHA1.
 * Production fails closed when TWILIO_AUTH_TOKEN or the signature is absent.
 * Set TWILIO_WEBHOOK_BASE_URL when a proxy changes the public URL seen by Twilio.
 */
export function validateTwilioWebhook(
  request: NextRequest,
  params: URLSearchParams,
): { valid: boolean; reason?: string } {
  const token = process.env.TWILIO_AUTH_TOKEN;
  const signature = request.headers.get("x-twilio-signature");
  if (!token) return { valid: false, reason: "TWILIO_AUTH_TOKEN is not configured" };
  if (!signature) return { valid: false, reason: "Missing X-Twilio-Signature" };

  const publicBase = process.env.TWILIO_WEBHOOK_BASE_URL?.replace(/\/$/, "");
  const url = publicBase ? `${publicBase}${request.nextUrl.pathname}${request.nextUrl.search}` : request.url;
  const expected = createHmac("sha1", token).update(signatureBase(url, params)).digest("base64");
  return constantTimeEqual(expected, signature)
    ? { valid: true }
    : { valid: false, reason: "Twilio signature mismatch" };
}

export async function readTwilioForm(request: NextRequest): Promise<URLSearchParams> {
  const text = await request.text();
  return new URLSearchParams(text);
}
