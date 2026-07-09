import type { ReactNode } from "react";
import { MainNav } from "@/components/landing/MainNav";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";

export interface FeatureHighlight {
  title: string;
  body: string;
}

export function FeaturePageLayout({
  eyebrow,
  title,
  description,
  appRoute,
  appRouteLabel,
  highlights,
  detailTitle,
  detailBody,
  artifact,
}: {
  eyebrow: string;
  title: string;
  description: string;
  appRoute: string;
  appRouteLabel: string;
  highlights: FeatureHighlight[];
  detailTitle: string;
  detailBody: string;
  artifact?: ReactNode;
}) {
  return (
    <>
      <MainNav />
      <main id="main-content">
        <section className="mx-auto max-w-4xl px-4 py-16">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            {eyebrow}
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={appRoute}>{appRouteLabel}</Button>
            <Button href="/migration-audit" variant="secondary">
              Start a Migration Audit
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.title} className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="text-lg font-medium text-accent">{h.title}</h3>
                <p className="mt-2 text-sm text-muted">{h.body}</p>
              </div>
            ))}
          </div>
        </section>

        {artifact && (
          <section className="mx-auto max-w-4xl px-4 pb-16">
            {artifact}
          </section>
        )}

        <section className="mx-auto max-w-4xl px-4 pb-20">
          <div className="rounded-2xl border border-border bg-surface p-8">
            <h2 className="font-display text-2xl font-semibold">{detailTitle}</h2>
            <p className="mt-3 text-muted">{detailBody}</p>
            <div className="mt-6">
              <Button href={appRoute} variant="secondary">
                {appRouteLabel}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
