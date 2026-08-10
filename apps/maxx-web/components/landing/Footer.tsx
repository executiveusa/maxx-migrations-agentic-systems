import Link from "next/link";
import { MACS_LOGO_DATA_URI } from "@/lib/brand-assets";

const primary = [
  { href: "/blog", label: "Northwest Field Notes" },
  { href: "/work/asc3nd", label: "ASC3ND" },
  { href: "/work/macs-client-zero", label: "Client Zero" },
  { href: "/audit", label: "Start the Vibe Audit" },
  { href: "/app", label: "Client login / demo" },
];

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.3fr_.7fr]">
          <div>
            <img src={MACS_LOGO_DATA_URI} width={160} height={121} alt="MACS Digital Media" className="h-16 w-auto object-contain" />
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted">
              A Pacific Northwest father-and-son company helping nontechnical owners diagnose digital bottlenecks, simplify the stack and build systems they can understand and own.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Navigate</p>
              <ul className="mt-4 space-y-3">
                {primary.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-accent">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Legal</p>
              <ul className="mt-4 space-y-3">
                {legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-accent">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-14 border-t border-border pt-6 text-xs leading-5 text-muted">
          <p>AI may inspect, classify, summarize and propose within authorized scope. Sensitive decisions, financial approvals, destructive actions and final public messaging remain human-controlled unless narrower authority is explicitly approved.</p>
          <p className="mt-3">© {new Date().getFullYear()} MACS Digital Media.</p>
        </div>
      </div>
    </footer>
  );
}
