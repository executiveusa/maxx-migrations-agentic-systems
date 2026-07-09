# Skills Registry

This directory contains reusable skills and patterns for agents working on the maxx-migrations-agentic-systems project. All agents should reference these skills when appropriate.

## Available Skills

### 1. **skills-library.md**
- **Purpose**: Central repository of 76+ categorized skills organized by domain
- **Use when**: Planning which skills/tools to apply to a task, understanding the broader agent ecosystem
- **Key sections**:
  - Category map for skill classification
  - Repo skill router default stack
  - Detailed skills by category with confidence levels
  - Best practices for skill selection

### 2. **interactive-artifacts.md**
- **Purpose**: Build production-quality interactive HTML artifacts for Claude.ai and agent environments
- **Use when**: Creating dashboards, calculators, simulators, games, data visualizers, or any live widget
- **Key coverage**:
  - Claude.ai sandbox constraints (no localStorage, no position:fixed, etc.)
  - HTML artifact anatomy and streaming order
  - CSS variable theming and dark-mode support
  - Chart.js, D3, Three.js, and other CDN libraries
  - Color system and typography standards
  - Persistent storage patterns (window.storage API)
  - Anthropic API integration for AI-powered widgets
  - sendPrompt() handoff patterns for agent interaction

## Discovery and Usage

### For Agents
1. Check this README first to understand available skills
2. Read the relevant skill file completely before starting work
3. Reference the quality standards and patterns defined in each skill
4. When uncertain which skill applies, consult `skills-library.md` categories

### For Adding New Skills
1. Create a new `.md` file in this directory
2. Use the YAML frontmatter format (see `interactive-artifacts.md` for example)
3. Include clear sections with examples and constraints
4. Add the skill to this README's "Available Skills" section
5. Update `skills-library.md` if adding to the broader ecosystem

## Quick Links

- **Repo Type**: Python/Frappe backend (ERPNext) + Vite/React frontend (`/banking`)
- **Tech Stack**: Python, React 19.2, Tailwind CSS v4, Radix UI, Jotai, React Hook Form
- **Key Quality Standards**:
  - Interactive Artifacts: UDEC 8.5/10 quality floor
  - Design: 3-5 colors max, 2 fonts max, mobile-first
  - Frontend Polish: Follow impeccable design patterns
  - Code: Token-efficient retrieval, semantic search, structural refactors

## File Structure

```
skills/
├── README.md                    (this file — skill registry and discovery)
├── skills-library.md            (76+ categorized skills ecosystem)
└── interactive-artifacts.md     (claude.ai widget building skill)
```

---

All skills in this directory are discoverable and should be referenced by agents working on this project.
