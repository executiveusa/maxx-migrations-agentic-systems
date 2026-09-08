import { NextRequest, NextResponse } from "next/server";
import { generateRecoveryReceipts } from "@/lib/revenue-capture/recovery-receipt";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateRecoveryReceipts();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Recovery Receipt generation failed." },
      { status: 500 },
    );
  }
}
