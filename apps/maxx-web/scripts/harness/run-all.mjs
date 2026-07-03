import { spawnSync } from "node:child_process";
import process from "node:process";

// build-report.mjs runs every individual check and writes the combined
// report to ops/reports/harness/. This script is the single entry point
// referenced by `npm run harness:all`.
const result = spawnSync(process.execPath, ["scripts/harness/build-report.mjs"], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
