import type { Metadata } from "next";
import Link from "next/link";
import { AuditPreIntake } from "@/components/landing/new-look/AuditCommand";

export const metadata: Metadata = {
  title: "Start the Vibe Audit — MACS Digital Media",
  description: "Start with the business outcome. MACS asks only the decisions it cannot discover from evidence.",
};

export default function AuditPage() {
  return (
    <div className="marketing-shell min-h-screen bg-bg text-text">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-8">
        <Link href="/" className="font-display text-xl font-bold tracking-[-0.03em]">
          MACS
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-text">
          Back to site
        </Link>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-5 py-16 md:px-8 md:py-24">
        <div className="w-full">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.14em] text-accent">
            $497 Vibe Audit · Start with the outcome
          </p>
          <AuditPreIntake />
        </div>
      </main>
    </div>
  );
}
