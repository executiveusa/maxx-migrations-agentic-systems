# Inputs

- The stage-1 scaffold at `apps/maxx-web` (Next.js 14 App Router,
  TypeScript, Tailwind, Zod, react-hook-form, Supabase client libs already
  in `package.json`).
- The full one-shot build prompt (Sonnet 5 handoff) specifying the
  complete route map, CRM feature set, integration adapters, harness
  requirements, and documentation deliverables.
- Existing design tokens in `app/globals.css` and `tailwind.config.ts`
  (dark sovereign palette: `--color-bg`, `--color-accent`, etc.) — reused
  rather than replaced.
- No external credentials (Supabase, Twilio, Meta, GHL) were available in
  this environment; every integration was built against its documented
  "setup required" contract instead of a live account.
