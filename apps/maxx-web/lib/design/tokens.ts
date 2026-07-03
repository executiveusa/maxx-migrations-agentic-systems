/**
 * Mirrors the CSS custom properties defined in app/globals.css. Use this
 * when a color value is needed in JS/TS (e.g. chart color scales) rather
 * than a Tailwind class — keep both in sync when the palette changes.
 */
export const colorTokens = {
  bg: "#0d0f0e",
  surface: "#121714",
  surface2: "#17211c",
  text: "#f4f7f2",
  muted: "#9aa89f",
  accent: "#10b981",
  accentSoft: "rgba(16, 185, 129, 0.14)",
  border: "rgba(255, 255, 255, 0.1)",
} as const;

export const fontTokens = {
  display: "'Cormorant Garamond', serif",
  body: "'DM Sans', system-ui, sans-serif",
} as const;

export const radiusTokens = {
  xl: "1rem",
  "2xl": "1.5rem",
} as const;
