import { NextResponse } from "next/server";
import { isSeedMode } from "@/lib/data/mode";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    seedMode: isSeedMode(),
    timestamp: new Date().toISOString(),
  });
}
