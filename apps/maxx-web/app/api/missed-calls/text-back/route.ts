import { NextRequest, NextResponse } from "next/server";
import { missedCallRuleSchema } from "@/lib/validation/missed-call";
import { getStore } from "@/lib/data/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const store = getStore();

  if (typeof body.ruleId === "string" && typeof body.active === "boolean") {
    const rule = store.mctbRules.find((r) => r.id === body.ruleId);
    if (!rule) {
      return NextResponse.json({ error: "Rule not found." }, { status: 404 });
    }
    rule.active = body.active;
    return NextResponse.json({ rule, message: `Text-back rule ${rule.active ? "enabled" : "disabled"}.` });
  }

  const parsed = missedCallRuleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid rule." }, { status: 400 });
  }

  const rule = {
    id: `rule_${Date.now()}`,
    organizationId: store.mctbRules[0]?.organizationId ?? "",
    ...parsed.data,
  };
  store.mctbRules.push(rule);
  return NextResponse.json({ rule }, { status: 201 });
}
