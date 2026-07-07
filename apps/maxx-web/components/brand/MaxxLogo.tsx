/**
 * MaxxLogo - Brand identity for Maxx Migrations
 * Mission-driven logo for AI-powered CRM migrations.
 * Supports light/dark mode via CSS custom properties.
 */

import type { SVGProps } from "react";

interface MaxxLogoProps {
  /** Show compact version (monogram only on mobile, full on desktop) */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for the logo */
  alt?: string;
}

export function MaxxLogo({
  compact = false,
  className = "",
  alt = "Maxx Migrations",
}: MaxxLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Monogram: geometric mark with "M" concept */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        {/* Background circle for icon context */}
        <circle
          cx="16"
          cy="16"
          r="14"
          className="fill-accent/10 dark:fill-accent/15"
        />

        {/* Primary geometric mark: upward ascending columns representing growth/migration */}
        <g className="stroke-accent dark:stroke-accent" strokeWidth="1.5" strokeLinecap="round">
          {/* Left column */}
          <line x1="8" y1="22" x2="8" y2="10" />
          {/* Middle column (tallest) */}
          <line x1="16" y1="22" x2="16" y2="6" />
          {/* Right column */}
          <line x1="24" y1="22" x2="24" y2="14" />
        </g>

        {/* Connection lines at top, suggesting unified system */}
        <g className="stroke-accent dark:stroke-accent opacity-70" strokeWidth="1.25" strokeLinecap="round">
          <line x1="8" y1="10" x2="16" y2="6" />
          <line x1="16" y1="6" x2="24" y2="14" />
        </g>

        {/* Base connection point */}
        <circle cx="16" cy="22" r="1.5" className="fill-accent dark:fill-accent" />
      </svg>

      {/* Wordmark: show on desktop or when not compact */}
      {!compact && (
        <div className="flex flex-col items-start">
          {/* "Maxx" in larger, bold serif */}
          <div
            className="font-display text-xl font-bold leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="text-text dark:text-text">Maxx</span>
          </div>
          {/* "Migrations" as secondary line, smaller */}
          <div className="text-xs font-medium text-muted dark:text-muted uppercase tracking-wider">
            Migrations
          </div>
        </div>
      )}

      {/* Accessibility label */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}

/**
 * MaxxLogoHorizontal - Full wordmark suitable for headers/footers
 * Shows "Maxx Migrations" with full horizontal layout
 */
export function MaxxLogoHorizontal(props: Omit<MaxxLogoProps, "compact">) {
  return <MaxxLogo {...props} compact={false} />;
}

/**
 * MaxxLogoCompact - Icon-only version for tight spaces
 * Shows only the monogram mark
 */
export function MaxxLogoCompact(props: Omit<MaxxLogoProps, "compact">) {
  return <MaxxLogo {...props} compact={true} />;
}

/**
 * MaxxLogoMark - Raw SVG monogram for use as favicon or icon
 * Returns just the geometric mark without wrapper
 */
export function MaxxLogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Background circle */}
      <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.1" />

      {/* Ascending columns */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="8" y1="22" x2="8" y2="10" />
        <line x1="16" y1="22" x2="16" y2="6" />
        <line x1="24" y1="22" x2="24" y2="14" />
      </g>

      {/* Connection lines */}
      <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7">
        <line x1="8" y1="10" x2="16" y2="6" />
        <line x1="16" y1="6" x2="24" y2="14" />
      </g>

      {/* Base point */}
      <circle cx="16" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}
