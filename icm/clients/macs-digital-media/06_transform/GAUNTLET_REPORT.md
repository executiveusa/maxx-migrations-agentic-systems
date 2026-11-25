# MACS Gauntlet Report

Date: 2026-09-22
State: `GAUNTLET_INCOMPLETE`
Public repo: `executiveusa/macsdigitalmedia`
Production commit: `ba1965abfc2739f45233dca4742bbe100fa50f5e`
Quality bar: live `wearecollins.com`

## Internal gate result

PASS for the current MACS artifact on:
- lint;
- typecheck;
- production build;
- browser usability;
- responsive/overflow matrix;
- reduced motion;
- dynamic scroll/motion regression;
- tactile pressed-state behavior;
- rendered touch geometry after transforms;
- meaningful-copy readability during motion;
- settled phone/tablet/desktop visual capture;
- product screenshot staging;
- exact Netlify production commit match.

## Visual/product finding

The final refinement addressed the largest internally observed craft gaps without adding new page sections:
- secondary copy is no longer weakened by compounded opacity;
- lower-page scenes remain readable while motion is in progress;
- ASC3ND proof now carries more authority inside the existing Work beat;
- Work → Story has tighter pacing;
- Built Here screenshots use consistent art-directed media stages while preserving the real screenshots as evidence.

The motion-saturation rule applies: additional animation is not the default next improvement.

## Why the external Gauntlet is incomplete

`GAUNTLET_CONFIG.md` requires the real MACS site and the real live COLLINS reference captured at equivalent viewports.

The current evidence contains the MACS rendered artifacts, but not a fresh equivalent-viewport reference capture for COLLINS.

Per the protocol:
- do not judge from memory;
- do not substitute a written description;
- do not manufacture a PASS.

## Next comparison

Capture both sites at:
- 375×812
- 390×844
- 768×1024
- 1440×900
- 1920×1080

Judge:
- hero / first impression
- typography
- spacing / negative space
- navigation
- Programs
- Work / proof density
- father-and-son story
- media scale and quality
- CTA restraint
- mobile hierarchy
- interaction / motion
- accessibility / reduced motion

Use a fresh critic. Identify the single largest remaining gap. If the simpler MACS version is stronger for its job, stop rather than adding effects.

## Separate release blocker

This Gauntlet state is not the same as the database blocker.

The production visual/code deploy is current, but the public application persistence path remains unverified because production migration run `35686243782` failed before migration with missing `SUPABASE_DB_URL`.
