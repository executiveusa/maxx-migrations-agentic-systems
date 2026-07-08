"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MaxxLogo } from "@/components/brand/MaxxLogo";
import { isSeedMode } from "@/lib/data/mode";

const getLinks = (inSeedMode: boolean) => [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/app", label: inSeedMode ? "View Demo App" : "Open App" },
];

export function MainNav() {
  const inSeedMode = isSeedMode();
  const links = getLinks(inSeedMode);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <nav
        aria-label="Primary"
        className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
      >
        <Link href="/" className="transition-opacity hover:opacity-80">
          <MaxxLogo compact={false} alt="Maxx Migrations - Home" />
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button href="/migration-audit" className="hidden md:inline-flex">
          Start a Migration Audit
        </Button>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          className="rounded-md border border-border px-3 py-2 text-sm md:hidden"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
        {mobileOpen && (
          <ul
            id="mobile-nav-menu"
            className="absolute left-0 right-0 top-full z-50 space-y-1 border-t border-border bg-surface p-4 shadow-lg md:hidden"
          >
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Button href="/migration-audit" className="mt-2 w-full">
                Start a Migration Audit
              </Button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
