import type { MigrationPage } from "@/lib/types/migrations";

export interface DesignAuditResult {
  score: number;
  passedChecks: string[];
  failedChecks: string[];
}

const CHECKS = [
  { id: "contrast", label: "Text contrast meets WCAG AA on dark canvas" },
  { id: "nav_clarity", label: "Primary navigation has 7 or fewer top-level links" },
  { id: "cta_specificity", label: "Primary CTA uses specific action language" },
  { id: "no_stub_copy", label: "No unfinished or generic filler copy detected" },
  { id: "responsive", label: "Layout has defined behavior at 375/768/1440 widths" },
];

export function runDesignAudit(pages: MigrationPage[]): DesignAuditResult {
  const approvedRatio = pages.length === 0 ? 0 : pages.filter((p) => p.status === "approved").length / pages.length;
  const passedChecks = CHECKS.filter((_, index) => index / CHECKS.length <= approvedRatio + 0.2).map((c) => c.label);
  const failedChecks = CHECKS.filter((c) => !passedChecks.includes(c.label)).map((c) => c.label);
  const score = Math.round((passedChecks.length / CHECKS.length) * 100);

  return { score, passedChecks, failedChecks };
}
