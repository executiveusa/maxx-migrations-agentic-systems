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
const PUBLIC_EXAMPLES = new Set([
  "NEXT_PUBLIC_AUTH_CONFIGURED",
  "MOCK_INTEGRATIONS",
  "MAXX_INTAKE_TENANT_SLUG",
  "MAXX_MIGRATIONS_URL",
]);
const SECRET_NAME =
  /(?:^|_)(?:SECRET|TOKEN|PASSWORD|API_KEY|PRIVATE_KEY|SERVICE_ROLE_KEY)(?:_|$)/i;
const PLACEHOLDER =
  /^(?:<[^<>\r\n]+>|\$\{[A-Z][A-Z0-9_]*\}|your[_-][a-z0-9_-]+|example[_-][a-z0-9_-]+)$/i;
const SENSITIVE_VALUE =
  /(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{30,}|xox[baprs]-[A-Za-z0-9-]{20,}|sb_secret_[A-Za-z0-9_-]{16,})\b)/;
const values = new Map();
let failed = false;
for (const [index, raw] of readFileSync(".env.example", "utf8")
  .split("\n")
  .entries()) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line);
  if (!match) {
    console.error(`  ✗ invalid assignment at line ${index + 1}`);
    failed = true;
    continue;
  }
  const [, key, value] = match;
  if (values.has(key)) {
    console.error(`  ✗ duplicate variable ${key}`);
    failed = true;
  }
  values.set(key, value);
  if (
    SENSITIVE_VALUE.test(value) ||
    (SECRET_NAME.test(key) && value !== "" && !PLACEHOLDER.test(value))
  ) {
    console.error(`  ✗ ${key} contains a non-placeholder secret value.`);
    failed = true;
    continue;
  }
  if (
    value &&
    !SECRET_NAME.test(key) &&
    !PUBLIC_EXAMPLES.has(key) &&
    !PLACEHOLDER.test(value)
  ) {
    console.error(`  ✗ ${key} has an unapproved nonempty example value.`);
    failed = true;
  }
}
for (const key of REQUIRED_VARS) {
  const found = values.has(key);
  console.log(`  ${found ? "✓" : "✗"} ${key}`);
  if (!found) failed = true;
}
for (const key of ["NEXT_PUBLIC_AUTH_CONFIGURED", "MOCK_INTEGRATIONS"]) {
  if (!/^(true|false)$/.test(values.get(key) ?? "")) {
    console.error(`  ✗ ${key} must be a boolean.`);
    failed = true;
  }
}
const slug = values.get("MAXX_INTAKE_TENANT_SLUG");
if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("  ✗ invalid intake tenant slug.");
  failed = true;
}
const base = values.get("MAXX_MIGRATIONS_URL");
if (base) {
  try {
    const url = new URL(base);
    if (
      !(
        ["http:", "https:"].includes(url.protocol) &&
        !url.username &&
        !url.password &&
        !url.search &&
        !url.hash &&
        (url.protocol === "https:" ||
          ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
      )
    )
      throw new Error("invalid endpoint");
  } catch {
    console.error("  ✗ invalid federation example URL.");
    failed = true;
  }
}
if (failed) {
  console.error("\nenv-audit failed.");
  process.exit(1);
}
console.log(
  "\nenv-audit passed: required variables are documented and example values satisfy the secret policy."
);
