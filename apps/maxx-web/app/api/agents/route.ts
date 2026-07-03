import { NextResponse } from "next/server";
import { aiAgents } from "@/lib/mock-data/agents";

export async function GET() {
  return NextResponse.json({ agents: aiAgents });
}
