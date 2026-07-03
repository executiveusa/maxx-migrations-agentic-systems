import { existsSync } from "node:fs";
import process from "node:process";
import { REQUIRED_PUBLIC_ROUTES, walkFiles, readText, relative } from "./_shared.mjs";

// Resolves `@/components/...` style imports to a real file path so
// composition-only pages (a page.tsx that just arranges imported sections)
// get credit for the copy that actually lives in those section components.
function resolveLocalImport(specifier) {
  if (!specifier.startsWith("@/")) return null;
  const base = specifier.replace("@/", "");
  for (const candidate of [`${base}.tsx`, `${base}.ts`, `${base}/index.tsx`]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function collectPageCopyText(entryFile, depth = 1) {
  const text = readText(entryFile);
  let combined = extractStringLiterals(text);

  if (depth > 0) {
    const importPattern = /from\s+"(@\/[^"]+)"/g;
    let match;
    while ((match = importPattern.exec(text))) {
      const resolved = resolveLocalImport(match[1]);
      if (resolved && resolved !== entryFile) {
        combined += " " + extractStringLiterals(readText(resolved));
      }
    }
  }

  return combined;
}

console.log("Auditing public page and doc copy");

const GENERIC_AI_FILLER = [
  /revolutioniz(e|ing)/i,
  /cutting[- ]edge/i,
  /game[- ]chang(er|ing)/i,
  /synerg(y|ies)/i,
  /unlock your (potential|power)/i,
  /seamless(ly)? integrat/i,
  /take .* to the next level/i,
];

const COPY_BAN = [/\blorem\b/i, /coming soon/i, /placeholder(?![:=])/i];

// Pulls every quoted string literal out of a source file so copy that lives
// in JSX text, props (title="...", description="..."), and template
// literals all count — a naive tag-stripping approach mistakenly treats a
// whole multi-attribute self-closing component as a single "tag" and
// discards the copy inside its props.
function extractStringLiterals(text) {
  const literals = [];
  const pattern = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let match;
  while ((match = pattern.exec(text))) {
    const value = match[1] ?? match[2] ?? match[3] ?? "";
    if (value.length > 3 && !value.startsWith("/") && !value.includes("@/")) {
      literals.push(value);
    }
  }
  return literals.join(" ");
}

let violations = 0;

for (const route of REQUIRED_PUBLIC_ROUTES) {
  if (!existsSync(route)) continue; // route-audit.mjs already reports missing routes
  const copyText = collectPageCopyText(route);

  for (const pattern of [...GENERIC_AI_FILLER, ...COPY_BAN]) {
    if (pattern.test(copyText)) {
      console.log(`  ✗ ${relative(route)} — matched banned/filler pattern: ${pattern}`);
      violations += 1;
    }
  }

  if (copyText.length < 150) {
    console.log(`  ✗ ${relative(route)} — suspiciously little copy (${copyText.length} chars across string literals)`);
    violations += 1;
  }
}

console.log("\nAuditing docs/copy/*.md for literal lorem ipsum filler");
for (const file of walkFiles("../../docs/copy", new Set([".md"]))) {
  const text = readText(file);
  // Docs legitimately reference banned-term names (e.g. "no coming soon
  // sections") while documenting the policy, so only flag actual lorem
  // ipsum filler text here, not every mention of a banned word.
  if (/lorem ipsum dolor/i.test(text)) {
    console.log(`  ✗ ${relative(file)} — contains lorem ipsum filler text`);
    violations += 1;
  }
}

if (violations > 0) {
  console.error(`\ncopy-audit failed: ${violations} issue(s) found.`);
  process.exit(1);
} else {
  console.log("\ncopy-audit passed.");
}
