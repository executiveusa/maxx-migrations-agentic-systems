import { createHmac, timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function decodeWebhookSecret(value: string): Buffer {
  const raw = value.startsWith("whsec_") ? value.slice("whsec_".length) : value;
  return Buffer.from(raw, "base64");
}

/** Verify the Svix signature used by Resend webhooks against the raw request body. */
export function verifyResendWebhook(input: {
  rawBody: string;
  id: string | null;
  timestamp: string | null;
  signature: string | null;
}): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret || !input.id || !input.timestamp || !input.signature) return false;

  const timestampSeconds = Number(input.timestamp);
  if (!Number.isFinite(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > 300) return false;

  const signed = `${input.id}.${input.timestamp}.${input.rawBody}`;
  const expected = createHmac("sha256", decodeWebhookSecret(secret)).update(signed).digest("base64");
  const candidates = input.signature
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (part.includes(",") ? (part.split(",", 2)[1] ?? "") : part))
    .filter((candidate): candidate is string => candidate.length > 0);
  return candidates.some((candidate) => safeEqual(expected, candidate));
}

export async function sendResendEmail(input: {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      reply_to: input.replyTo,
    }),
    cache: "no-store",
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Email provider returned HTTP ${response.status}.`);
  const parsed = text ? (JSON.parse(text) as { id?: string }) : {};
  return { providerMessageId: parsed.id ?? null };
}
