import process from "node:process";
import { BANNED_PATTERNS, SOURCE_DIRS, walkFiles, readText, relative } from "./_shared.mjs";

console.log("Scanning app/, components/, and lib/ for banned stub/placeholder content");

let violations = 0;

for (const dir of SOURCE_DIRS) {
  for (const file of walkFiles(dir)) {
    const text = readText(file);
    const lines = text.split("\n");

    lines.forEach((line, index) => {
      for (const { name, pattern } of BANNED_PATTERNS) {
        if (pattern.test(line)) {
          console.log(`  ✗ ${relative(file)}:${index + 1} — "${name}" — ${line.trim().slice(0, 100)}`);
          violations += 1;
        }
      }
    });
  }
}

if (violations > 0) {
  console.error(`\nno-stubs failed: ${violations} banned pattern match(es) found.`);
  process.exit(1);
} else {
  console.log("\nno-stubs passed: no banned stub/placeholder patterns found in app/, components/, or lib/.");
}
