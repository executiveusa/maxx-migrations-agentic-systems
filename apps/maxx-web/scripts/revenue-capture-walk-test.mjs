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
  "apps/maxx-web/app/api/revenue/summary/route.ts",
  "apps/maxx-web/app/api/operations/fleet/route.ts",
  "apps/maxx-web/app/app/operations/page.tsx",
];

const failures = [];
for (const relative of required) {
  if (!fs.existsSync(path.join(repoRoot, relative))) failures.push(`missing required artifact: ${relative}`);
}

const checks = [
  {
    file: "apps/maxx-web/app/api/twilio/sms/route.ts",
    forbidden: ["currentOrganization", "@/lib/mock-data", "getStore()"],
  },
  {
    file: "apps/maxx-web/app/api/twilio/voice/route.ts",
    forbidden: ["currentOrganization", "@/lib/mock-data", "getStore()"],
  },
  {
    file: "apps/maxx-web/app/api/twilio/status/route.ts",
    forbidden: ["currentOrganization", "@/lib/mock-data", "getStore()"],
  },
  {
    file: "apps/maxx-web/app/api/agent/chat/route.ts",
    forbidden: ["NEXT_PUBLIC_DEMO_ORG_ID", "@/lib/data/supabase-client\";\nimport { selectModel"],
  },
];

for (const check of checks) {
  const full = path.join(repoRoot, check.file);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, "utf8");
  for (const token of check.forbidden) {
    if (text.includes(token)) failures.push(`${check.file} contains forbidden production fallback: ${token}`);
  }
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
console.log("- state and human-boundary contract present");
