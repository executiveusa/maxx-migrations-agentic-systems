import { NextRequest, NextResponse } from "next/server";
import { syncAllProviderConnections } from "@/lib/revenue-capture/provider-sync";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await syncAllProviderConnections();
    const failed = results.filter((row) => row.status === "failed");
    return NextResponse.json({
      ok: failed.length === 0,
      synced: results.filter((row) => row.status === "synced").length,
      failed: failed.length,
      results,
    }, { status: failed.length === results.length && results.length > 0 ? 502 : 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Provider sync failed." },
      { status: 500 },
    );
  }
}
