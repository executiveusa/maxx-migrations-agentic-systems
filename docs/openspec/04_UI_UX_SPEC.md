# 04 — UI/UX Spec

See `docs/design/DESIGN_SYSTEM.md` for the full token and component
reference. This document covers page-level UX rules.

## Every page answers

- Where am I? — `PageHeader`'s eyebrow + title on every app page;
  breadcrumb-free by design since the sidebar nav shows the active route.
- What can I do here? — primary action always in `PageHeader`'s `actions`
  slot, top-right on desktop.
- What changed? — every mutation confirms via `Toast` (success/error/info)
  or an inline `StatusPill` change; nothing mutates silently.
- What should I click next? — empty states always carry a specific next
  action (see `EmptyState` usages across Contacts, Workflows, DMs).

## States every list/detail view handles

Populated, empty (`EmptyState` with a real next action), loading
(`LoadingState`, used where an async fetch could be slow), and error
(`ErrorState`). No view renders a blank screen while data is missing.

## Navigation

Public site: `MainNav` (7 links max) + `Footer` (Product / Recent Updates
/ Legal columns). App: `AppNav` sidebar, 12 top-level items, active-state
highlighted via `usePathname()`.

## Accessibility

Every dialog uses `role="dialog"`, `aria-modal`, a labelled heading, and
closes on Escape or backdrop click (`components/ui/Dialog.tsx`). Every
icon-only control has an `aria-label`. Focus rings use the accent color at
2px offset globally, and `prefers-reduced-motion: reduce` collapses all
transitions.
