import { existsSync } from "node:fs";
import process from "node:process";
import { REQUIRED_ROUTES } from "./_shared.mjs";

console.log("Auditing required routes exist");

let missing = 0;

for (const route of REQUIRED_ROUTES) {
  const ok = existsSync(route);
  console.log(`  ${ok ? "✓" : "✗"} ${route}`);
  if (!ok) missing += 1;
}

if (missing > 0) {
  console.error(`\nroute-audit failed: ${missing} required route(s) missing.`);
  process.exit(1);
} else {
  console.log(
    `\nroute-audit passed: all ${REQUIRED_ROUTES.length} required routes exist.`
  );
}
