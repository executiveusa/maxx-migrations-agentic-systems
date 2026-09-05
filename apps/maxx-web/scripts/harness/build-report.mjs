import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import process from "node:process";

const CHECKS = [
  { id: "preflight", script: "scripts/harness/preflight.mjs" },
  { id: "no-stubs", script: "scripts/harness/no-stubs.mjs" },
  { id: "routes", script: "scripts/harness/route-audit.mjs" },
  { id: "links", script: "scripts/harness/link-check.mjs" },
  { id: "api", script: "scripts/harness/api-smoke.mjs" },
  { id: "copy", script: "scripts/harness/copy-audit.mjs" },
  { id: "env", script: "scripts/harness/env-audit.mjs" },
  { id: "artifacts", script: "scripts/harness/artifact-audit.mjs" },
  { id: "federation", script: "scripts/harness/federation-contract.mjs" },
];

console.log("Running full harness and generating build report\n");

const results = CHECKS.map(({ id, script }) => {
  const result = spawnSync(process.execPath, [script], { encoding: "utf8" });
  const passed = result.status === 0;
  console.log(`${passed ? "PASS" : "FAIL"} — ${id}`);
  return {
    id,
    script,
    passed,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
  };
});

const allPassed = results.every((r) => r.passed);

const report = {
  generatedAt: new Date().toISOString(),
  overallStatus: allPassed ? "pass" : "fail",
  checks: results.map(({ id, script, passed }) => ({ id, script, passed })),
};

mkdirSync("../../ops/reports/harness", { recursive: true });
writeFileSync(
  "../../ops/reports/harness/build-report.json",
  JSON.stringify(report, null, 2) + "\n",
);

const md = [
  "# Build Harness Report",
  "",
  `Generated: ${report.generatedAt}`,
  `Overall status: **${report.overallStatus.toUpperCase()}**`,
  "",
  "| Check | Status |",
  "| --- | --- |",
  ...results.map((r) => `| ${r.id} | ${r.passed ? "✅ pass" : "❌ fail"} |`),
  "",
  ...(allPassed
    ? []
    : [
        "## Failure details",
        "",
        ...results
          .filter((r) => !r.passed)
          .flatMap((r) => [`### ${r.id}`, "", "```", r.output, "```", ""]),
      ]),
].join("\n");

writeFileSync("../../ops/reports/harness/build-report.md", md);

console.log(`\nOverall: ${report.overallStatus.toUpperCase()}`);
console.log(
  "Report written to ops/reports/harness/build-report.json and build-report.md",
);

process.exit(allPassed ? 0 : 1);
