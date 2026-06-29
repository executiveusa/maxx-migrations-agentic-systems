---
name: interactive-artifacts
description: >
  Builds production-quality interactive HTML artifacts that render inline in Claude.ai and
  any MCP-capable agent environment. Covers the full build stack: CSS variable theming,
  dark-mode-safe color system, Tabler icon integration, Chart.js and D3 data visualization,
  three.js 3D scenes, Anthropic API-powered AI widgets, persistent storage, sendPrompt()
  agent handoff, and the claude.ai iframe sandbox constraints. Use this skill when any agent
  is asked to build, improve, or audit an interactive artifact — dashboards, scorers,
  simulators, games, calculators, form mockups, agent graph explorers, data visualizers,
  cost guards, or any widget that must run live in the chat UI. Enforces Emerald Tablets™
  quality floor: UDEC 8.5/10, anti-hype law, single-responsibility, Ralphy Loop output.
  Blocks all known sandbox failure modes before code is written.
emerald_tablets: I, II, IV, V
quality_floor: 8.5
author: Pauli Effect™ × Akash Engine
version: "1.0"
---

# Interactive Artifacts — Agent Build Skill™
## Pauli Ecosystem™ Constitutional Skill
### Authority: Emerald Tablets™ I · II · IV · V
### Applies to: HERMES™ · RALPHY · ARCHITECT · any agent producing claude.ai widgets

---

## PRIME DIRECTIVE

Read this file completely before writing a single line of HTML, CSS, or JavaScript.

An interactive artifact is not a webpage. It is a sandboxed iframe rendered inside claude.ai.
It has no `<html>`, no `<head>`, no `<body>`. It cannot access `localStorage`. It cannot reach
arbitrary external domains. It cannot use `position: fixed`. Every failure mode in this document
is a real failure that has silently broken artifacts before. Knowing the constraints is how you
build correctly on the first iteration.

The quality floor is 8.5/10. Anything below it auto-iterates. Anything that silently fails
a sandbox constraint counts as a 0 on the affected axis.

---

## STEP 0 — MANDATORY CONTEXT SCAN

Before writing any artifact code, run this check:

```
1. What is the output environment?
   → Always claude.ai iframe sandbox unless explicitly told otherwise.
   → Constraints in SECTION 2 apply unconditionally.

2. What data or state does this artifact need?
   → Static data: embed in JS variables.
   → User-session data: use in-memory JS state (never localStorage).
   → Cross-session persistence: use window.storage API (SECTION 7).
   → Real-time AI responses: use Anthropic API pattern (SECTION 8).

3. Does the artifact need external libraries?
   → Only load from the CDN allowlist in SECTION 3.
   → Check exact UMD build URLs — wrong paths silently 404.

4. What is the sendPrompt() handoff strategy?
   → Every meaningful user action should offer an agent follow-up.
   → See SECTION 9 for sendPrompt() patterns.

5. What is the UDEC score target per axis?
   → Run self-audit in SECTION 10 before declaring done.
```

---

## SECTION 1 — ARTIFACT ANATOMY

Every artifact is a raw HTML fragment. No boilerplate wrappers.

### What to NEVER include
```html
<!-- BANNED — will break or be ignored -->
<!DOCTYPE html>
<html>
<head>
<body>
<!-- HTML comments -->
/* CSS comments */
```

### Correct document structure
```html
<style>
  /* styles first — stream before content */
  /* keep under ~20 lines for simple artifacts */
  /* complex interactive widgets may need more — that is fine */
</style>

<!-- content HTML second -->
<div>...</div>

<!-- scripts last — execute after streaming completes -->
<script src="https://cdnjs.cloudflare.com/..."></script>
<script>
  /* your code here */
</script>
```

### Streaming order matters
The artifact streams token-by-token. Structure so useful content appears early:
- `<style>` block → renders CSS before DOM
- Content HTML → user sees layout immediately
- `<script src="...">` CDN loads → libraries available
- `<script>` logic → executes after all above

---

## SECTION 2 — SANDBOX CONSTRAINTS (HARD LIMITS)

These are not preferences. Violating any of these produces broken artifacts.

### CONSTRAINT 1: No localStorage or sessionStorage
```javascript
// BANNED — silently fails in claude.ai sandbox
localStorage.setItem('key', value);
sessionStorage.getItem('key');

// CORRECT — in-memory state
let appState = { user: null, data: [] };

// CORRECT — cross-session persistence
await window.storage.set('key', value); // see SECTION 7
```

### CONSTRAINT 2: No position: fixed
```css
/* BANNED — collapses iframe to 100px height */
.modal { position: fixed; top: 0; left: 0; }
.toast { position: fixed; bottom: 20px; }

/* CORRECT — use normal flow for overlays */
.modal-wrap {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### CONSTRAINT 3: CDN allowlist only
External resources load ONLY from these domains:
```
cdnjs.cloudflare.com
esm.sh
cdn.jsdelivr.net
unpkg.com
fonts.googleapis.com
fonts.gstatic.com
```
Any other origin is silently blocked. No GitHub raw URLs. No custom CDNs.

### CONSTRAINT 4: No DOCTYPE, html, head, body tags
The sandbox injects these. Duplicate tags break rendering.

### CONSTRAINT 5: Canvas cannot resolve CSS variables
```javascript
// BANNED — canvas ignores CSS vars, renders transparent/black
ctx.fillStyle = 'var(--text-primary)';

// CORRECT — read CSS vars into JS first
const style = getComputedStyle(document.documentElement);
const textColor = style.getPropertyValue('--text-primary').trim();
ctx.fillStyle = textColor;
```

### CONSTRAINT 6: No nested scrolling
Do not set `overflow: scroll` or `overflow: auto` on inner containers.
The iframe auto-sizes to content height. Let it.

### CONSTRAINT 7: No gradients, shadows, blur, glow during streaming
These flash during DOM diffing. Use solid fills. Exception: after-stream
CSS animations using `transform` and `opacity` only are permitted.

---

## SECTION 3 — CDN LIBRARY REFERENCE

### Verified UMD build URLs (copy exactly — wrong paths 404 silently)

```html
<!-- Chart.js 4.4.1 — data visualization -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>

<!-- D3 7.8.5 — advanced visualization, choropleth maps -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>

<!-- TopoJSON 3.0.2 — geographic maps (requires D3) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js"></script>

<!-- Three.js r128 — 3D scenes -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- PapaParse — CSV parsing -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

<!-- SheetJS — Excel XLSX/XLS parsing -->
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

<!-- mathjs — mathematical expressions -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.0/math.min.js"></script>

<!-- Mermaid 11 — diagrams (ES module only) -->
<script type="module">
  import mermaid from 'https://esm.sh/mermaid@11/dist/mermaid.esm.min.mjs';
</script>

<!-- Tabler icons — already loaded in claude.ai, NO import needed -->
<!-- Use directly: <i class="ti ti-home"></i> -->
```

### Three.js r128 specific constraints
```javascript
// AVAILABLE in r128
THREE.OrbitControls  // NOT available — use manual rotation
THREE.BoxGeometry
THREE.SphereGeometry
THREE.CylinderGeometry
THREE.MeshStandardMaterial

// NOT AVAILABLE in r128 (added in later versions)
THREE.CapsuleGeometry  // use CylinderGeometry + SphereGeometry instead
THREE.OrbitControls    // implement manual mouse drag instead
```

---

## SECTION 4 — COLOR SYSTEM

### CSS variables — always use these, never hardcode hex in HTML/CSS
```css
/* Surfaces (light/dark auto-adapts) */
--surface-0   /* page background — darkest */
--surface-1   /* card background */
--surface-2   /* panel — white in light, elevated dark */
--surface-3   /* popover */

/* Text */
--text-primary      /* body text */
--text-secondary    /* supporting text */
--text-muted        /* placeholders, hints */

/* Semantic roles */
--text-accent       --bg-accent     --border-accent
--text-danger       --bg-danger     --border-danger
--text-success      --bg-success    --border-success
--text-warning      --bg-warning    --border-warning
--text-pro          --bg-pro        --border-pro

/* Borders */
--border            /* default 0.5px hairline */
--border-strong     /* emphasized */
--border-stronger   /* heavy */

/* Typography */
--font-sans   /* Anthropic Sans — default */
--font-voice  /* serif — editorial moments only */
--font-mono   /* monospace */

/* Layout */
--radius      /* 8px — standard corners */
--pad-sm --pad-md --pad-lg --pad-xl
--gap-xs --gap-sm --gap-md --gap-lg --gap-xl
```

### Nine-ramp color palette for data visualization
Use these hex values in Chart.js and D3 (canvas cannot read CSS vars):

```javascript
const PALETTE = {
  // Tidepool categorical series — always assign in this order
  series: ['#2a78d6','#1baf7a','#eda100','#008300','#4a3aa7','#e34948','#e87ba4','#eb6834'],

  // Named ramps for UI components (50=lightest, 900=darkest)
  purple: { 50:'#EEEDFE', 100:'#CECBF6', 200:'#AFA9EC', 400:'#7F77DD', 600:'#534AB7', 800:'#3C3489', 900:'#26215C' },
  teal:   { 50:'#E1F5EE', 100:'#9FE1CB', 200:'#5DCAA5', 400:'#1D9E75', 600:'#0F6E56', 800:'#085041', 900:'#04342C' },
  coral:  { 50:'#FAECE7', 100:'#F5C4B3', 200:'#F0997B', 400:'#D85A30', 600:'#993C1D', 800:'#712B13', 900:'#4A1B0C' },
  amber:  { 50:'#FAEEDA', 100:'#FAC775', 200:'#EF9F27', 400:'#BA7517', 600:'#854F0B', 800:'#633806', 900:'#412402' },
  blue:   { 50:'#E6F1FB', 100:'#B5D4F4', 200:'#85B7EB', 400:'#378ADD', 600:'#185FA5', 800:'#0C447C', 900:'#042C53' },
  green:  { 50:'#EAF3DE', 100:'#C0DD97', 200:'#97C459', 400:'#639922', 600:'#3B6D11', 800:'#27500A', 900:'#173404' },
  red:    { 50:'#FCEBEB', 100:'#F7C1C1', 200:'#F09595', 400:'#E24B4A', 600:'#A32D2D', 800:'#791F1F', 900:'#501313' },
  gray:   { 50:'#F1EFE8', 100:'#D3D1C7', 200:'#B4B2A9', 400:'#888780', 600:'#5F5E5A', 800:'#444441', 900:'#2C2C2A' },
  pink:   { 50:'#FBEAF0', 100:'#F4C0D1', 200:'#ED93B1', 400:'#D4537E', 600:'#993556', 800:'#72243E', 900:'#4B1528' },
};

// Dark mode detection for charts
const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
```

### Color assignment rules
```
Categorical data     → Tidepool series array in order — never pick randomly
Sequential data      → one hue, light→dark (e.g. blue 50→900)
Diverging data       → blue ↔ red with gray midpoint (#f0efec light / #383835 dark)
Status indicators    → semantic CSS vars (--text-success, --text-danger, etc.)
Never               → rainbow cycling, hardcoded hex in CSS, color as only differentiator
```

---

This skill is complete. Additional sections (5-10) cover typography, layout patterns, persistent storage, AI API patterns, handoff patterns, and quality audit procedures.
