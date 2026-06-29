# Skills & Agent Configuration Index

Quick reference for all skills and agent guidelines in this project.

## Start Here

1. **New Agent?** → Read `agents.md` first
2. **Need a Skill?** → Check `skills/README.md` 
3. **Frontend Work?** → See `skills/interactive-artifacts.md`
4. **Finding Tools?** → See `skills/skills-library.md`

## Directory Structure

```
maxx-migrations-agentic-systems/
├── SKILLS.md                    (this file — quick index)
├── agents.md                    (agent workflow config)
├── skills/
│   ├── README.md                (skill registry and discovery)
│   ├── skills-library.md        (76+ categorized skills)
│   ├── interactive-artifacts.md (claude.ai widget skill)
│   └── [additional skills as added]
└── banking/                     (Vite + React frontend)
    ├── src/
    ├── package.json
    ├── vite.config.ts
    └── globals.css              (design tokens)
```

## Available Skills

| Skill | Location | Purpose | Quality Floor |
|-------|----------|---------|---------------|
| **Interactive Artifacts** | `skills/interactive-artifacts.md` | Build dashboards, widgets, calculators for Claude.ai | 8.5/10 UDEC |
| **Skills Library** | `skills/skills-library.md` | 76+ categorized tools for all domains | Reference |
| **Agent Workflows** | `agents.md` | How agents should work in this repo | N/A |

## Quick Skill Matrix

### I'm building a **frontend feature**
→ Use `interactive-artifacts.md` for widgets, dashboards
→ Follow `/banking/globals.css` design tokens
→ Reference existing Radix UI + Tailwind components

### I'm building an **interactive widget**
→ MUST use `interactive-artifacts.md`
→ Quality floor: 8.5/10 (UDEC score)
→ No localStorage, no position:fixed, CDN allowlist only

### I'm choosing **which tools/skills to use**
→ Start with `skills/skills-library.md` category map
→ Find your domain (Backend, Frontend, etc.)
→ Load the specialized skill file

### I'm **unsure about conventions**
→ Read `agents.md` for project standards
→ Check code organization and patterns
→ See quality standards section

## Project Context

- **Root**: ERPNext (Python/Frappe) banking module
- **Frontend**: `/banking/` — Vite + React 19.2 + Tailwind CSS v4
- **Package Manager**: yarn (in `/banking`)
- **Build**: `yarn build` → `/banking/dist`
- **Design System**: oklch colors, 3-5 colors max, 2 fonts max

## Agent Checklist

When starting work:
- [ ] Read `agents.md`
- [ ] Identify task type (frontend, backend, tooling, etc.)
- [ ] Load relevant skill from `skills/`
- [ ] Read skill file **completely** before writing code
- [ ] Check existing code patterns
- [ ] Follow quality standards
- [ ] Test in preview/build before finishing

## Adding New Skills

1. Create new `.md` in `skills/` directory
2. Use YAML frontmatter (see `interactive-artifacts.md` example)
3. Include examples, constraints, and quality metrics
4. Add entry to `skills/README.md` Available Skills section
5. Update this index if skill is high-frequency
6. Update `agents.md` if affecting workflow

---

**Last Updated**: 2026-06-29
**Project**: maxx-migrations-agentic-systems
**Maintained By**: Agent Workflow Team
