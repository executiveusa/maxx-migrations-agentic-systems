import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  href: Route | string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const base =
  "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-bg hover:bg-accent/90",
  secondary:
    "border border-border bg-transparent text-text hover:bg-surface-2",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
