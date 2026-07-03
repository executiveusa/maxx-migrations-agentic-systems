import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

let failed = false;

function check(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    console.log(`  ✗ ${label}`);
    failed = true;
  }
}

console.log("Preflight checks");

const pkgExists = existsSync("package.json");
check("package.json exists", pkgExists);

if (pkgExists) {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  check("package.json has a name", Boolean(pkg.name));
  check("package.json declares engines.node", Boolean(pkg.engines?.node));
}

const nodeMajor = Number(process.versions.node.split(".")[0]);
check(`Node version >= 18 (found ${process.versions.node})`, nodeMajor >= 18);

check("app/ directory exists", existsSync("app"));
check("components/ directory exists", existsSync("components"));
check("lib/ directory exists", existsSync("lib"));
check(".env.example exists", existsSync(".env.example"));
check("app/app (application shell routes) exists", existsSync("app/app"));
check("app/api (API routes) exists", existsSync("app/api"));
check("next.config.mjs exists", existsSync("next.config.mjs"));
check("vercel.json exists", existsSync("vercel.json"));

if (failed) {
  console.error("\nPreflight failed.");
  process.exit(1);
} else {
  console.log("\nPreflight passed.");
}
