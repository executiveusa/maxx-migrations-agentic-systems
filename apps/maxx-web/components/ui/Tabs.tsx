"use client";

import { useState, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ items, defaultTab }: { items: TabItem[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id);

  return (
    <div>
      <div className="overflow-x-auto border-b border-border">
        <div role="tablist" aria-label="Tabs" className="flex w-max min-w-full gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={active === item.id}
              onClick={() => setActive(item.id)}
              className={`shrink-0 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active === item.id
                  ? "border-b-2 border-accent text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="pt-6">
        {items.map((item) =>
          item.id === active ? (
            <div key={item.id} role="tabpanel">
              {item.content}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
