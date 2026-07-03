import { existsSync } from "node:fs";
import process from "node:process";
import { REQUIRED_API_ROUTES } from "./_shared.mjs";

console.log("Checking required API route files exist");

let missing = 0;

for (const route of REQUIRED_API_ROUTES) {
  const ok = existsSync(route);
  console.log(`  ${ok ? "✓" : "✗"} ${route}`);
  if (!ok) missing += 1;
}

if (missing > 0) {
  console.error(`\napi-smoke failed: ${missing} required API route file(s) missing.`);
  process.exit(1);
}

console.log(`\nAll ${REQUIRED_API_ROUTES.length} required API route files exist.`);

// Optional live check: if a dev/preview server is already running, hit
// /api/health and verify the response shape. Skipped gracefully when no
// server is reachable — this script never starts a server itself.
const baseUrl = process.env.HARNESS_BASE_URL ?? "http://localhost:3000";

try {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  const response = await fetch(`${baseUrl}/api/health`, { signal: controller.signal });
  clearTimeout(timeout);
  const body = await response.json();

  if (response.ok && body.status === "ok") {
    console.log(`Live check: ${baseUrl}/api/health responded with { status: "ok" }.`);
  } else {
    console.error(`Live check failed: unexpected response shape from ${baseUrl}/api/health.`);
    process.exit(1);
  }
} catch {
  console.log(`Live check skipped: no server reachable at ${baseUrl} (this is fine outside a running dev/preview server).`);
}
