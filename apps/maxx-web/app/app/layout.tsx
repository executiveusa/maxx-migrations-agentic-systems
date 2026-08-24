import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { ToastProvider } from "@/components/ui/Toast";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Revenue Capture OS",
    template: "%s — Revenue Capture OS",
  },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
