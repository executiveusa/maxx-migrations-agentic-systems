# MAXX — ICM root map

One job: orient any human or agent to the MAXX system without loading the whole company.

## Governing idea

**Complexity underneath. Simplicity on top.**

MAXX should become more capable while the owner experiences less software, less prompting, less dashboard work, and less cognitive load.

The universal working flow is:

`01_orient -> 02_plan -> 03_work -> 04_verify -> 05_release -> 06_learn`

This is the one ICM grammar to learn. Specialized protocols plug into these stages; they do not replace the grammar.

## System boundary

- Public storefront: `executiveusa/macsdigitalmedia`
- Owner/operator surface: `executiveusa/macs-agent-portal`
- Canonical business brain and execution backend: this repository
- Bambu's personal Hermes/Cosmos is separate from Agent MAXX.

## Start here

| Need | Read |
|---|---|
| philosophy and product behavior | `icm/maxx-os/_shared/product-principles.md` |
| system/repository map | `icm/maxx-os/_shared/architecture.md` |
| human vs machine authority | `docs/icm/HUMAN_MACHINE_CONTRACT.md` |
| evidence and proof | `icm/maxx-os/_shared/evidence.md` |
| security/sovereignty | `icm/maxx-os/_shared/security.md` |
| communication/copy/UX behavior | `icm/maxx-os/_shared/communication.md` |
| current work | start at `icm/maxx-os/01_orient/CONTEXT.md` |

## Specialized routes

Use these only when the current stage requires them:

- commercial growth: `icm/growth-engine/`
- site transformation: `icm/site-transformation-protocol/`
- product portfolio decisions: `icm/maxx-suite/`
- three-repo machine routing: `icm/federation/`

## Walk rule

A cold agent should understand where it is and where to go from this file plus at most two more reads.

Do not bulk-load the repository. Do not duplicate canonical truth. Do not create another control plane.
