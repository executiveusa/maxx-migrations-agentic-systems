# Revenue Capture OS — Router

## Purpose
This folder is the durable ICM entry point for the Revenue Capture OS implementation inside MAXX Migrations.

## Cold start
A memoryless agent must read only:
1. this file;
2. `../01_context/CONTEXT.md`;
3. the active stage contract named in `../STATE.md`.

After those reads the agent must know the current stage, required inputs, exact output/evidence location, human authority boundary, and next proof step.

## Product role
- Company: MAX Digital Media / MACS Digital Media
- Product: Revenue Capture OS
- Operator layer: MAXX Operations
- Canonical backend/ICM brain: this repository (`executiveusa/maxx-migrations-agentic-systems`)
- Conversational interface: Popebot / Agent MAXX
- Do not create another control plane.

## Outcome
Capture business demand, recover missed opportunities where authorized, correlate real outcomes to evidence, and show owners only what the evidence supports.

## Evidence classes
`VERIFIED | ATTRIBUTED | ESTIMATED | UNKNOWN`

Never upgrade one class to another without new evidence.

## Current state
Read `../STATE.md`. Do not infer state from chat history.
