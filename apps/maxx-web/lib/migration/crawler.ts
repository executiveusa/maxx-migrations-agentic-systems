import { isIntegrationConfigured } from "@/lib/data/mode";

export interface CrawlPlanPage {
  path: string;
  title: string;
  discoveredFrom: string;
}

export interface CrawlPlan {
  sourceUrl: string;
  pages: CrawlPlanPage[];
  mode: "seed" | "live";
}

export function isLiveCrawlEnabled(): boolean {
  return isIntegrationConfigured("MIGRATION_CRAWLER_ENABLED");
}

/**
 * Builds a crawl plan for a source URL. In seed mode this returns a
 * deterministic sample plan so the UI has something real to render locally.
 * When MIGRATION_CRAWLER_ENABLED is set, callers should route through the
 * server-side crawl adapter (a Playwright/HTTP fetch job outside this
 * request/response cycle) rather than fetching arbitrary URLs inline.
 */
export function buildSeedCrawlPlan(sourceUrl: string): CrawlPlan {
  const commonPaths = ["/", "/about", "/donate", "/volunteer", "/contact"];
  return {
    sourceUrl,
    mode: "seed",
    pages: commonPaths.map((path) => ({
      path,
      title: path === "/" ? "Home" : path.slice(1).replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
      discoveredFrom: sourceUrl,
    })),
  };
}
