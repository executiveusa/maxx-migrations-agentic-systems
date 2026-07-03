import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

console.log("Auditing .env.example");

if (!existsSync(".env.example")) {
  console.error("  ✗ .env.example does not exist.");
  process.exit(1);
}

const REQUIRED_VARS = [
  "NEXT_PUBLIC_AUTH_CONFIGURED",
  "MOCK_INTEGRATIONS",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
  "META_ACCESS_TOKEN",
  "META_PAGE_ID",
  "GHL_API_KEY",
  "GHL_LOCATION_ID",
];

const text = readFileSync(".env.example", "utf8");
const lines = text.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));

let failed = false;

for (const key of REQUIRED_VARS) {
  const found = lines.some((line) => line.trim().startsWith(`${key}=`));
  console.log(`  ${found ? "✓" : "✗"} ${key}`);
  if (!found) failed = true;
}

// Guard against accidentally-committed real secrets: every value in
// .env.example must be empty or an obvious placeholder-safe boolean/string.
const SUSPICIOUS_VALUE = /=.{16,}/;
for (const line of lines) {
  const [, value] = line.split("=");
  if (value && SUSPICIOUS_VALUE.test(line) && !/^(true|false)$/i.test(value.trim())) {
    console.log(`  ✗ ${line} looks like it may contain a real secret value.`);
    failed = true;
  }
}

if (failed) {
  console.error("\nenv-audit failed.");
  process.exit(1);
} else {
  console.log("\nenv-audit passed: all required variables are documented and no real secrets detected.");
}
