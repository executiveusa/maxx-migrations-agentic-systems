"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#system", label: "System" },
  { href: "/#about", label: "About" },
];

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-md supports-[backdrop-filter]:bg-bg/90">
      <nav aria-label="Primary" className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="group inline-flex flex-col leading-none">
          <span className="font-display text-xl font-bold tracking-[-0.04em] text-text">MACS</span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-muted">Digital Media</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted transition-colors duration-150 hover:text-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/audit"
            data-event="audit_cta_click"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]"
          >
            Start the $497 Audit
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          className="rounded-full border border-border px-4 py-2 text-sm md:hidden"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>

        {mobileOpen && (
          <div id="mobile-nav-menu" className="absolute left-0 right-0 top-full border-b border-border bg-bg px-5 py-5 md:hidden">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-border py-4 text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/audit"
              onClick={() => setMobileOpen(false)}
              className="mt-5 block rounded-full bg-accent px-5 py-3 text-center text-sm font-bold text-white"
            >
              Start the $497 Audit
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
