import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  trend,
  helpText,
  icon,
}: {
  label: string;
  value: string;
  trend?: { direction: "up" | "down" | "flat"; label: string };
  helpText?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        {icon}
      </div>
      <div className="mt-2 font-display text-3xl font-semibold text-text">{value}</div>
      {trend && (
        <div
          className={`mt-2 text-xs font-medium ${
            trend.direction === "up"
              ? "text-accent"
              : trend.direction === "down"
                ? "text-red-400"
                : "text-muted"
          }`}
        >
          {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"} {trend.label}
        </div>
      )}
      {helpText && <p className="mt-2 text-xs text-muted">{helpText}</p>}
    </div>
  );
}
