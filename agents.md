# Agent Workflow Configuration

This file defines how agents should work on the maxx-migrations-agentic-systems repository.

## Agent Discovery Rules

All agents working in this repo MUST:
1. Check `/skills/README.md` for available skills
2. Load relevant skills from `/skills/` directory based on task type
3. Follow the constraints and patterns defined in each skill file
4. Update this file when establishing new conventions or patterns

## Project Context

### Repository Structure
- **Root**: ERPNext (Python/Frappe framework) — banking module
- **Web App**: `/banking/` — Vite + React 19.2 + Tailwind CSS v4 + Radix UI + React Router v7
- **State Management**: Jotai (atoms) + frappe-react-sdk
- **Build Output**: `/banking/dist/` built with `yarn build` command
- **Vercel Config**: Set to root=`/banking`, build command=`yarn build`

### Design Tokens (globals.css)
- Color system: oklch-based, full light/dark support
- Semantic tokens: `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`
- Sidebar tokens available
- Radius: `--radius: 0.625rem` with scale (sm/md/lg/xl/2xl/3xl/4xl)

## Skill Selection Matrix

### For Frontend / UI Work
Required skills (in order):
1. `interactive-artifacts.md` — if building widgets or dashboards
2. Design guidelines from `/banking/globals.css`
3. Radix UI + Tailwind patterns from existing components

### For Backend / Integration Work
Recommended skills:
1. `skills-library.md` — infrastructure, backend, data integration skills
2. Frappe SDK documentation
3. ERPNext module patterns

### For Uncertain Tasks
1. Start with `skills-library.md` category map
2. Find matching category
3. Load the appropriate specialized skill
4. Reference that skill completely before starting work

## Code Organization

### Frontend (`/banking/src/`)
- **pages**: React Router page components
- **components**: Reusable UI components (Radix UI + Tailwind)
- **hooks**: Custom React hooks
- **atoms**: Jotai state atoms
- **utils**: Helper functions and utilities
- **types**: TypeScript type definitions

### Package Manager
- Use `yarn` for all operations in `/banking`
- Run `yarn build` to create `/banking/dist`
- Run `yarn dev` to start dev server

## Quality Standards

### Frontend Polish (from interactive-artifacts.md)
- UDEC quality floor: 8.5/10 minimum
- No hardcoded colors — use CSS variables
- No localStorage — use window.storage or in-memory state
- No position:fixed — use normal flow
- Responsive design — mobile-first, enhanced for larger screens

### Design System
- 3-5 colors maximum per feature
- 2 fonts maximum (one heading, one body)
- Semantic HTML with proper ARIA
- Alt text for all meaningful images
- Typography scale: h1 (22px), h2 (18px), h3 (16px), p (16px)

### Code Quality
- Use token-efficient code retrieval before editing
- Prefer Edit tool over Bash for file changes
- Follow existing component patterns
- Write postambles explaining changes (2-4 sentences max)

## Agent Initialization Checklist

When an agent starts work on this repo:
- [ ] Read this file (agents.md)
- [ ] Review `/skills/README.md` for available skills
- [ ] Load skill(s) relevant to the task
- [ ] Read skill file completely before writing code
- [ ] Check existing code patterns for the component/module type
- [ ] Follow design tokens and quality standards
- [ ] Test changes in preview before declaring done

## Handoff Protocol

When handing off work to another agent:
1. Update this file with new conventions or patterns discovered
2. Summarize project context in the handoff message
3. Reference specific skills that apply to the next task
4. Include links to relevant skill files and configuration

---

This file is the source of truth for agent workflows in this project. Update it as patterns and conventions evolve.
