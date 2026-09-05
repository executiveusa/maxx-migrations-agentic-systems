import { createHmac, timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyWhatsAppSignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  return safeEqual(expected, header);
}

export async function sendWhatsAppText(input: {
  accessToken: string;
  graphApiVersion: string;
  phoneNumberId: string;
  to: string;
  body: string;
}) {
  const response = await fetch(
    `https://graph.facebook.com/${input.graphApiVersion}/${encodeURIComponent(input.phoneNumberId)}/messages`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${input.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: input.to,
        type: "text",
        text: { preview_url: false, body: input.body },
      }),
      cache: "no-store",
    },
  );
  const text = await response.text();
  if (!response.ok) throw new Error(`WhatsApp API returned HTTP ${response.status}.`);
  const parsed = text ? (JSON.parse(text) as { messages?: Array<{ id?: string }> }) : {};
  return { providerMessageId: parsed.messages?.[0]?.id ?? null };
}
