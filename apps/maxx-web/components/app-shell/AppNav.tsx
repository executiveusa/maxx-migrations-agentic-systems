"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNavItems } from "@/lib/nav";

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Application" className="flex flex-col gap-1 p-3">
      {appNavItems.map((item) => {
        const isActive =
          item.href === "/app" ? pathname === "/app" : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent-soft text-accent"
                : "text-muted hover:bg-surface-2 hover:text-text"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
