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
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
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
        <details className="md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-2 text-sm">
            Menu
          </summary>
          <ul className="absolute left-0 right-0 mt-2 space-y-1 border-t border-border bg-surface p-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block py-2 text-sm">
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
        </details>
      </nav>
    </header>
  );
}
