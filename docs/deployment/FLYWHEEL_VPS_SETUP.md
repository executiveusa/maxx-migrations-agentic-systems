# Flywheel VPS Setup

Manual setup guide for the Hostinger VPS that powers the 6-agency Maxx
Command Center's project launcher. **This cannot be executed from a Claude
Code session without SSH access to the VPS** — run these steps yourself, or
hand this doc to an agent session that has SSH tool access to the box.

## What this VPS runs

- [Agentic Coding Flywheel](https://github.com/Dicklesworthstone/agentic_coding_flywheel_setup) — AgentMail MCP (inter-agent messaging) + `bv` (bead tracker) + Claude Code CLI
- `ops/flywheel-vps-api/` — a thin Hono API bridge the Vercel app calls to launch/monitor/stop agent sessions
- One workspace directory per agency under `/opt/maxx-flywheel/<agency-slug>/`, each with its own `AGENTS.md` (copied from this repo's `agencies/<agency-slug>/AGENTS.md`)

## Steps

1. **SSH into the VPS as root** (or a user with sudo).

2. **Clone this repo** (or scp just the `agencies/` and `ops/` directories) onto the VPS, then run the bootstrap script from the repo root:
   ```bash
   bash ops/flywheel-vps-setup.sh
   ```
   This installs Bun (official installer), creates the 6 agency workspace directories, copies their `AGENTS.md` files, and generates a shared secret at `/opt/maxx-flywheel/.secret`.

   **The script deliberately does NOT auto-install the third-party
   [Agentic Coding Flywheel](https://github.com/Dicklesworthstone/agentic_coding_flywheel_setup)
   toolchain (AgentMail MCP + `bv`).** Review that project's `install.sh`
   yourself before running it — it's an independent, third-party script, not
   something Anthropic or this repo vouches for. Once you've reviewed it:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/Dicklesworthstone/agentic_coding_flywheel_setup/main/install.sh -o /tmp/flywheel-install.sh
   less /tmp/flywheel-install.sh   # read it first
   bash /tmp/flywheel-install.sh
   ```

3. **Install the Claude Code CLI** on the VPS if the bootstrap script didn't (it will print instructions if missing):
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude login
   ```

4. **Start the API bridge**:
   ```bash
   cd ops/flywheel-vps-api
   bun install
   FLYWHEEL_VPS_SECRET="$(cat /opt/maxx-flywheel/.secret)" bun run start
   ```
   Put this behind a process manager (pm2, systemd, or similar) so it survives reboots — it is not yet wired into the bootstrap script's systemd unit.

5. **Expose port 3001** (or your chosen `PORT`) to the internet, ideally behind a reverse proxy with TLS (Caddy or nginx + Let's Encrypt). The Vercel app will call this over HTTPS.

6. **Set env vars in Vercel** (Project Settings → Environment Variables):
   - `FLYWHEEL_VPS_URL` — e.g. `https://flywheel.yourdomain.com`
   - `FLYWHEEL_VPS_SECRET` — the value from `/opt/maxx-flywheel/.secret`

7. **Verify the connection**: from `apps/maxx-web`, launch a project via `/app/projects` — the response's `launch.status` should read `"launched"` instead of `"setup_required"`.

## Known gaps in the reference API bridge

`ops/flywheel-vps-api/server.ts` is a working skeleton, not a finished
integration — `/launch` and `/stop` currently track session state in memory
but do not yet shell out to `bv`/AgentMail to actually start a Claude Code
session in the target agency's workspace. The `TODO` comments in that file
mark exactly where that wiring goes. Until that's done, launching a project
from the dashboard creates the project/bead rows in Supabase and reports
`"launched"`, but no real agent process starts on the VPS yet.

## Security notes

- The shared secret gates every request to this API — treat
  `/opt/maxx-flywheel/.secret` like any other production credential.
- Each agency's Claude Code session should run with access scoped to that
  agency's own repos only — do not give one agency's session filesystem or
  git credential access to another agency's workspace.
