import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "../..");
const required = [
  "icm/revenue-capture-os/00_router/CONTEXT.md",
  "icm/revenue-capture-os/01_context/CONTEXT.md",
  "icm/revenue-capture-os/STATE.md",
  "icm/revenue-capture-os/02_build/CONTRACT.md",
  "icm/revenue-capture-os/03_walk/WALK_TEST.md",
  "apps/maxx-web/lib/revenue-capture/runtime.ts",
  "apps/maxx-web/lib/agents/approval.ts",
  "apps/maxx-web/app/api/agent/proposals/[id]/decision/route.ts",
  "apps/maxx-web/app/api/revenue/summary/route.ts",
  "apps/maxx-web/app/api/operations/fleet/route.ts",
  "apps/maxx-web/app/app/operations/page.tsx",
  "apps/maxx-web/supabase/migrations/20260904000103_revenue_capture_approvals_v1.sql",
  "apps/maxx-web/supabase/migrations/20260904000104_revenue_capture_approval_rpc_hardening_v1.sql",
];

const failures = [];
for (const relative of required) {
  if (!fs.existsSync(path.join(repoRoot, relative))) failures.push(`missing required artifact: ${relative}`);
}

const checks = [
  { file: "apps/maxx-web/app/api/twilio/sms/route.ts", forbidden: ["currentOrganization", "@/lib/mock-data", "getStore()"] },
  { file: "apps/maxx-web/app/api/twilio/voice/route.ts", forbidden: ["currentOrganization", "@/lib/mock-data", "getStore()"] },
  { file: "apps/maxx-web/app/api/twilio/status/route.ts", forbidden: ["currentOrganization", "@/lib/mock-data", "getStore()"] },
  { file: "apps/maxx-web/app/api/agent/chat/route.ts", forbidden: ["NEXT_PUBLIC_DEMO_ORG_ID"] },
];

for (const check of checks) {
  const text = fs.readFileSync(path.join(repoRoot, check.file), "utf8");
  for (const token of check.forbidden) {
    if (text.includes(token)) failures.push(`${check.file} contains forbidden production fallback: ${token}`);
  }
}

const chat = fs.readFileSync(path.join(repoRoot, "apps/maxx-web/app/api/agent/chat/route.ts"), "utf8");
if (!chat.includes("persistWriteProposal")) failures.push("Popebot write proposals are not persisted before approval.");
const approval = fs.readFileSync(path.join(repoRoot, "apps/maxx-web/lib/agents/approval.ts"), "utf8");
for (const marker of ["maxx_revenue_create_action_proposal", "maxx_revenue_claim_approved_action", "maxx_revenue_finish_action"]) {
  if (!approval.includes(marker)) failures.push(`Approval runtime missing exact-action gate: ${marker}`);
}

const state = fs.readFileSync(path.join(repoRoot, "icm/revenue-capture-os/STATE.md"), "utf8");
for (const marker of ["ACTIVE_STAGE:", "Known external boundary", "Required before release"]) {
  if (!state.includes(marker)) failures.push(`STATE.md missing marker: ${marker}`);
}

if (failures.length) {
  console.error("Revenue Capture ICM walk test FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Revenue Capture ICM walk test PASS");
console.log("- cold-start artifacts present");
console.log("- Twilio mock/demo fallbacks absent");
console.log("- Popebot demo-org fallback absent");
console.log("- exact write proposal persistence and claim-before-side-effect gate present");
console.log("- state and human-boundary contract present");
