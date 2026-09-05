import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isFederationMachineAuthorized } from "@/lib/system/machine-auth";
import { routeCommercialCondition } from "@/lib/system/federation";

export const dynamic = "force-dynamic";

const inputSchema = z.object({
  condition: z.string().trim().min(3).max(10_000),
});

export async function POST(request: NextRequest) {
  if (!isFederationMachineAuthorized(request)) {
    return NextResponse.json({ error: "Machine authentication required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "condition is required." },
      { status: 400 },
    );
  }

  const routed = routeCommercialCondition(parsed.data.condition);
  return NextResponse.json({
    ...routed,
    condition: parsed.data.condition,
    nextContext: `icm/growth-engine/${
      routed.bucket === "reset"
        ? "01_reset"
        : routed.bucket === "momentum"
          ? "02_momentum"
          : routed.bucket === "scale"
            ? "03_scale"
            : "04_launch"
    }/SKILL.md`,
  });
}
