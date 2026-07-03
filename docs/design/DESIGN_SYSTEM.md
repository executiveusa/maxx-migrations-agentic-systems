# Maxx Migrations Design System

Visual direction: **dark sovereign infrastructure**. Dark canvas, emerald
signal accent, editorial serif for hero moments, clean sans for UI,
operator command-center density in the app shell, generous whitespace on
the public site.

## Tokens

Defined in `apps/maxx-web/app/globals.css` and mapped into Tailwind via
`apps/maxx-web/tailwind.config.ts`.

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#0d0f0e` | Page background |
| `--color-surface` | `#121714` | Card / panel background |
| `--color-surface-2` | `#17211c` | Nested surface, inputs, hover states |
| `--color-text` | `#f4f7f2` | Primary text |
| `--color-muted` | `#9aa89f` | Secondary text, helper copy |
| `--color-accent` | `#10b981` | Primary actions, active states, links |
| `--color-accent-soft` | `rgba(16,185,129,0.14)` | Accent backgrounds (badges, active nav) |
| `--color-border` | `rgba(255,255,255,0.1)` | Hairline borders everywhere |
| `--font-display` | Cormorant Garamond | H1–H3, hero moments |
| `--font-body` | DM Sans | Body copy, UI |

Radii: `xl` (1rem) for cards and inputs, `2xl` (1.5rem) for larger panels.

## Component primitives

`apps/maxx-web/components/ui/`:

- `Button` / `ButtonEl` — link vs. real `<button>`, four variants
  (primary/secondary/ghost/danger), three sizes.
- `Card`, `CardHeader` — the base surface for every panel.
- `Input`, `Textarea`, `Select`, `Field` — form controls with consistent
  focus rings and error/hint slots.
- `Badge`, `StatusPill` — tone-based labels; `StatusPill` maps a fixed set
  of domain statuses (active, draft, setup_required, etc.) to a tone so
  every status in the app reads consistently.
- `Table`, `Thead`, `Th`, `Tbody`, `Td` — horizontally scrollable on
  overflow, never causes page-level horizontal scroll.
- `EmptyState`, `LoadingState`, `ErrorState` — every list/detail view in
  the app renders one of these three instead of a blank screen.
- `MetricCard` — dashboard KPI tile with optional trend indicator.
- `PageHeader`, `SectionHeader` — consistent eyebrow/title/description/
  actions layout for every page and section.
- `Tabs` — accessible (`role="tablist"`/`"tab"`/`"tabpanel"`), keyboard
  operable via native button focus order.
- `Dialog` — modal with Escape-to-close and backdrop click-to-close,
  `aria-modal` and labelled title.
- `Toast` — `ToastProvider` + `useToast()`, auto-dismissing, `aria-live`.

`apps/maxx-web/components/app-shell/`:

- `AppShell` — sidebar nav + header + main content region, renders the
  seed-mode banner when auth isn't configured.
- `AppNav` — active-route highlighting via `usePathname()`.
- `AppHeader` — current organization identity + quick links.

## Interaction rules

- Every button describes its outcome ("Add contact," not "Submit").
- Every async action has a pending label ("Saving…", "Publishing…") and a
  toast confirmation or error — no silent failures.
- Every list page has three states covered: populated, empty (with a
  clear next action), and — where data can fail to load — an error state.
- Focus rings use `--color-accent` at 2px offset everywhere via
  `:focus-visible` in `globals.css`; no component removes the outline.
- `prefers-reduced-motion: reduce` collapses all animation/transition
  durations to near-zero globally.

## Layout rules

- Public marketing pages: `max-w-6xl` (wide sections) or `max-w-3xl`/
  `max-w-4xl` (reading-width copy sections), centered, `px-4` gutters.
- App pages: `AppShell`'s `max-w-6xl` content region, `PageHeader` at the
  top of every page, actions right-aligned on desktop and stacked on
  mobile (`flex-col sm:flex-row`).
- Kanban/board layouts (`/app/pipeline`) use CSS grid with horizontal
  scroll on narrow viewports rather than reflowing into an unreadable
  single column.

## What this system explicitly avoids

- No decorative gradients or glassmorphism — flat surfaces, hairline
  borders, one accent color.
- No icon-only buttons without an accessible label.
- No auto-rotating carousels (`ProofPanel` is a static grid, not a slider).
- No default browser `alert()`/`confirm()` — all confirmations go through
  `Dialog` or `Toast`.
