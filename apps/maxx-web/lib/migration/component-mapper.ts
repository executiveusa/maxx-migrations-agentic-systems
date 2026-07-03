export interface ComponentMapping {
  legacyPattern: string;
  targetComponent: string;
  notes: string;
}

export const componentMap: ComponentMapping[] = [
  { legacyPattern: "hero banner with image + heading", targetComponent: "HeroSection", notes: "Reused across marketing and migration preview pages." },
  { legacyPattern: "3-column feature grid", targetComponent: "FeatureStack", notes: "Rebuilt with design-system Card and MetricCard primitives." },
  { legacyPattern: "donation button / embedded form", targetComponent: "MigrationAuditForm pattern", notes: "Replaced with typed, validated forms wired to /api routes." },
  { legacyPattern: "footer with social icons", targetComponent: "Footer", notes: "Standardized footer shared across all public routes." },
  { legacyPattern: "testimonial carousel", targetComponent: "ProofPanel", notes: "Static, accessible proof panel — no auto-rotating carousel." },
];

export function mapLegacyPattern(pattern: string): ComponentMapping | undefined {
  return componentMap.find((m) => m.legacyPattern === pattern);
}
