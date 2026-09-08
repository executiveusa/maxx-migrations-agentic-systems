import { createHmac, timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Verify Stripe's timestamped v1 webhook signature without requiring the Stripe SDK. */
export function verifyStripeWebhook(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return { valid: false, reason: "STRIPE_WEBHOOK_SECRET is not configured" };
  if (!signatureHeader) return { valid: false, reason: "Missing Stripe-Signature" };

  const parts = signatureHeader.split(",").map((part) => part.trim().split("=", 2));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts
    .filter(([key]) => key === "v1")
    .map(([, value]) => value ?? "")
    .filter((value): value is string => value.length > 0);
  if (!timestamp || signatures.length === 0) return { valid: false, reason: "Malformed Stripe signature" };

  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > 300) {
    return { valid: false, reason: "Stripe signature timestamp outside tolerance" };
  }

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  return signatures.some((candidate) => safeEqual(expected, candidate))
    ? { valid: true }
    : { valid: false, reason: "Stripe signature mismatch" };
}
