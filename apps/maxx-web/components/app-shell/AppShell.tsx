"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AppNav } from "@/components/app-shell/AppNav";
import { AppHeader } from "@/components/app-shell/AppHeader";
import { isSeedMode } from "@/lib/data/mode";
import { VoiceButton } from "@/components/voice/VoiceButton";
import { VoiceErrorBoundary } from "@/components/voice/VoiceErrorBoundary";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface/40 md:block">
        <div className="border-b border-border px-6 py-4">
          <Link href="/" className="font-display text-lg font-semibold text-text">
            Maxx Migrations
          </Link>
        </div>
        <AppNav />
      </aside>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppHeader />
        {isSeedMode() && (
          <div className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-2 text-center text-xs text-amber-300">
            Local build mode: auth provider not configured. Demo organization loaded from seed data.
          </div>
        )}
        <main id="main-content" className="min-w-0 flex-1 px-6 py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Voice input/output - floating button */}
      <VoiceErrorBoundary>
        <VoiceButton />
      </VoiceErrorBoundary>
    </div>
  );
}
