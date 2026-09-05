import { existsSync, readdirSync, readFileSync } from "node:fs";
import process from "node:process";

console.log("Auditing interactive artifact reports");

const artifactsDir = "components/artifacts";
const reportsDir = "../../ops/reports/artifacts";

if (!existsSync(artifactsDir)) {
  console.error(`  ✗ ${artifactsDir} does not exist.`);
  process.exit(1);
}

const artifactFiles = readdirSync(artifactsDir).filter((f) =>
  f.endsWith(".tsx")
);
let failed = false;

for (const file of artifactFiles) {
  const name = file.replace(/\.tsx$/, "");
  const reportPath = `${reportsDir}/${name}.json`;

  if (!existsSync(reportPath)) {
    console.log(
      `  ✗ ${name} — missing report at ops/reports/artifacts/${name}.json`
    );
    failed = true;
    continue;
  }

  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const hasScore =
    typeof report.udec_score === "number" && report.udec_score > 0;
  const meetsTarget =
    typeof report.udec_score === "number" && report.udec_score >= 8.5;

  console.log(
    `  ${hasScore ? "✓" : "✗"} ${name} — udec_score: ${
      report.udec_score ?? "missing"
    }`
  );
  if (!hasScore) failed = true;
  if (!meetsTarget) {
    console.log(`    ⚠ ${name} scored below the 8.5 target.`);
  }
}

if (failed) {
  console.error("\nartifact-audit failed.");
  process.exit(1);
} else {
  console.log(
    `\nartifact-audit passed: ${artifactFiles.length} artifact(s) all have scored reports.`
  );
}
