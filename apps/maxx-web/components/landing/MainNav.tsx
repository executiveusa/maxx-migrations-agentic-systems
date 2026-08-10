"use client";

import { useState } from "react";
import Link from "next/link";
import { MACS_LOGO_DATA_URI } from "@/lib/brand-assets";

const links = [
  { href: "/#about", label: "Why MACS" },
  { href: "/#system", label: "Diagnose First" },
  { href: "/#work", label: "Work" },
  { href: "/blog", label: "Field Notes" },
];

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <nav aria-label="Primary" className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" aria-label="MACS Digital Media home" className="inline-flex items-center gap-3">
          <img src={MACS_LOGO_DATA_URI} width={160} height={121} alt="MACS Digital Media" className="h-11 w-auto object-contain md:h-12" />
          <span className="hidden text-[9px] font-bold uppercase tracking-[0.16em] text-muted sm:block">Pacific Northwest</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <ul className="flex items-center gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted transition-colors duration-150 hover:text-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/audit" data-event="audit_cta_click" className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.98]">
            Start the $497 Audit
          </Link>
        </div>

        <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-controls="mobile-nav-menu" className="rounded-full border border-border px-4 py-2 text-sm md:hidden">
          {mobileOpen ? "Close" : "Menu"}
        </button>

        {mobileOpen && (
          <div id="mobile-nav-menu" className="absolute left-0 right-0 top-full border-b border-border bg-bg px-5 py-5 shadow-lg md:hidden">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setMobileOpen(false)} className="block border-b border-border py-4 text-base">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/audit" onClick={() => setMobileOpen(false)} className="mt-5 block rounded-full bg-accent px-5 py-3 text-center text-sm font-bold text-white">
              Start the $497 Audit
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
