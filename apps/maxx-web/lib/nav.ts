export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

/**
 * Client navigation is intentionally small. Advanced capabilities remain
 * available through Popebot, deep links, and the operator/admin surfaces.
 * A business owner should not need to understand MAXX internals to get value.
 */
export const appNavItems: NavItem[] = [
  { href: "/app", label: "Home", icon: "grid" },
  { href: "/app/revenue", label: "Money", icon: "chart" },
  { href: "/app/pipeline", label: "Pipeline", icon: "kanban" },
  { href: "/app/inbox", label: "Inbox", icon: "inbox" },
  { href: "/app/settings", label: "Settings", icon: "settings" },
];

/** Operator routes are deliberately separate from the client navigation. */
export const operatorNavItems: NavItem[] = [
  { href: "/app/operations", label: "Fleet", icon: "chart" },
  { href: "/app/command-center", label: "Mission Control", icon: "grid" },
  { href: "/app/projects", label: "Projects", icon: "kanban" },
  { href: "/app/contacts", label: "Contacts", icon: "users" },
  { href: "/app/forms", label: "Forms", icon: "form" },
  { href: "/app/workflows", label: "Workflows", icon: "workflow" },
  { href: "/app/community", label: "Community", icon: "community" },
  { href: "/app/social-planner", label: "Social Planner", icon: "calendar" },
  { href: "/app/import/ghl", label: "GHL Import", icon: "import" },
  { href: "/app/missed-calls", label: "Missed Calls", icon: "phone" },
  { href: "/app/migrations", label: "Migrations", icon: "globe" },
  { href: "/app/agents", label: "AI Agents", icon: "agent" },
];

export const publicNavItems: NavItem[] = [
  { href: "/how-it-works", label: "How It Works", icon: "" },
  { href: "/features", label: "Features", icon: "" },
  { href: "/pricing", label: "Pricing", icon: "" },
  { href: "/migration-audit", label: "Migration Audit", icon: "" },
];

export const featureNavItems: NavItem[] = [
  { href: "/features/community", label: "Community", icon: "" },
  { href: "/features/courses", label: "Courses", icon: "" },
  { href: "/features/workflows", label: "Workflow Builder", icon: "" },
  { href: "/features/social-planner", label: "Social Media Planner", icon: "" },
  { href: "/features/ghl-import", label: "GHL Import Wizard", icon: "" },
  { href: "/features/missed-call-text-back", label: "Missed Call Text Back", icon: "" },
  { href: "/features/website-migration", label: "Website Migration", icon: "" },
];
