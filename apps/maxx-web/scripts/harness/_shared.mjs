import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

export const APP_ROOT = process.cwd();

export const SOURCE_DIRS = ["app", "components", "lib"];

export const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

export function walkFiles(dir, extensions = SOURCE_EXTENSIONS) {
  const results = [];
  if (!existsSync(dir)) return results;

  function walk(current) {
    for (const entry of readdirSync(current)) {
      if (
        entry === "node_modules" ||
        entry === ".next" ||
        entry.startsWith(".")
      )
        continue;
      const full = join(current, entry);
      const stats = statSync(full);
      if (stats.isDirectory()) {
        walk(full);
      } else if (extensions.has(extname(full))) {
        results.push(full);
      }
    }
  }

  walk(dir);
  return results;
}

export function readText(path) {
  return readFileSync(path, "utf8");
}

export function relative(path) {
  return path.replace(`${APP_ROOT}/`, "");
}

export const REQUIRED_PUBLIC_ROUTES = [
  "app/page.tsx",
  "app/how-it-works/page.tsx",
  "app/pricing/page.tsx",
  "app/migration-audit/page.tsx",
  "app/features/page.tsx",
  "app/features/community/page.tsx",
  "app/features/courses/page.tsx",
  "app/features/workflows/page.tsx",
  "app/features/social-planner/page.tsx",
  "app/features/ghl-import/page.tsx",
  "app/features/missed-call-text-back/page.tsx",
  "app/features/website-migration/page.tsx",
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
];

export const REQUIRED_APP_ROUTES = [
  "app/app/page.tsx",
  "app/app/contacts/page.tsx",
  "app/app/pipeline/page.tsx",
  "app/app/forms/page.tsx",
  "app/app/forms/new/page.tsx",
  "app/app/forms/[formId]/page.tsx",
  "app/app/workflows/page.tsx",
  "app/app/workflows/new/page.tsx",
  "app/app/workflows/[workflowId]/page.tsx",
  "app/app/community/page.tsx",
  "app/app/community/courses/page.tsx",
  "app/app/community/courses/[courseId]/page.tsx",
  "app/app/social-planner/page.tsx",
  "app/app/import/ghl/page.tsx",
  "app/app/missed-calls/page.tsx",
  "app/app/migrations/page.tsx",
  "app/app/migrations/new/page.tsx",
  "app/app/migrations/[jobId]/page.tsx",
  "app/app/agents/page.tsx",
  "app/app/settings/page.tsx",
  "app/app/settings/integrations/page.tsx",
  "app/app/settings/billing/page.tsx",
];

export const REQUIRED_ROUTES = [
  ...REQUIRED_PUBLIC_ROUTES,
  ...REQUIRED_APP_ROUTES,
];

export const REQUIRED_API_ROUTES = [
  "app/api/health/route.ts",
  "app/api/system/health/route.ts",
  "app/api/system/manifest/route.ts",
  "app/api/system/route/route.ts",
  "app/api/contacts/route.ts",
  "app/api/pipeline/route.ts",
  "app/api/forms/route.ts",
  "app/api/forms/[formId]/route.ts",
  "app/api/forms/[formId]/submit/route.ts",
  "app/api/workflows/route.ts",
  "app/api/workflows/[workflowId]/route.ts",
  "app/api/workflows/[workflowId]/run/route.ts",
  "app/api/community/posts/route.ts",
  "app/api/community/comments/route.ts",
  "app/api/community/dm/route.ts",
  "app/api/courses/route.ts",
  "app/api/courses/[courseId]/progress/route.ts",
  "app/api/social/posts/route.ts",
  "app/api/social/schedule/route.ts",
  "app/api/social/publish/route.ts",
  "app/api/social/oauth/callback/route.ts",
  "app/api/import/ghl/upload/route.ts",
  "app/api/import/ghl/map/route.ts",
  "app/api/import/ghl/run/route.ts",
  "app/api/twilio/voice/route.ts",
  "app/api/twilio/status/route.ts",
  "app/api/twilio/sms/route.ts",
  "app/api/missed-calls/text-back/route.ts",
  "app/api/migrations/jobs/route.ts",
  "app/api/migrations/jobs/[jobId]/route.ts",
  "app/api/migrations/extract/route.ts",
  "app/api/agents/route.ts",
  "app/api/agents/[agentId]/run/route.ts",
];

// Terms banned from shipped product source (app/components/lib). Each is a
// RegExp; word-boundary patterns avoid flagging legitimate substrings (e.g.
// the HTML `placeholder=` attribute or Tailwind's `placeholder:` variant).
export const BANNED_PATTERNS = [
  { name: "TODO", pattern: /\bTODO\b/ },
  { name: "FIXME", pattern: /\bFIXME\b/ },
  { name: "stub", pattern: /\bstubs?\b/i },
  { name: "placeholder copy", pattern: /placeholder(?![:=])/i },
  { name: "lorem ipsum", pattern: /\blorem\b/i },
  { name: "coming soon", pattern: /coming soon/i },
  { name: "fake", pattern: /\bfake\b/i },
  { name: "dummy", pattern: /\bdummy\b/i },
  { name: "mock only", pattern: /mock only/i },
  { name: "not implemented", pattern: /not implemented/i },
  { name: "under construction", pattern: /under construction/i },
  { name: "dead anchor href", pattern: /href=["']#["']/ },
  { name: "javascript void link", pattern: /javascript:void\(0\)/i },
  { name: "console.log", pattern: /console\.log\(/ },
];
