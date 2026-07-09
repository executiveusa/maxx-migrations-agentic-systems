#!/usr/bin/env bash
# Bootstraps a Hostinger Ubuntu VPS into the flywheel engine for the 6-agency
# Maxx Migrations command center. Run this ON THE VPS over SSH — it cannot be
# run from this repo's CI or from a Claude Code session without SSH access.
#
# Usage: ssh root@<your-vps-ip> 'bash -s' < ops/flywheel-vps-setup.sh
set -euo pipefail

echo "== Maxx Flywheel VPS bootstrap =="

# 1. Base tooling: Bun (flywheel toolchain), Claude Code CLI, git.
if ! command -v bun &>/dev/null; then
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

if ! command -v claude &>/dev/null; then
  echo "Install Claude Code CLI: https://code.claude.com/docs/en/claude-code"
  echo "  npm install -g @anthropic-ai/claude-code"
fi

apt-get update -y
apt-get install -y git curl build-essential

# 2. Agentic Coding Flywheel Setup — installs AgentMail MCP + bv bead tracker.
#    This is a THIRD-PARTY installer, not run automatically by this script.
#    Review it yourself before executing:
#      https://github.com/Dicklesworthstone/agentic_coding_flywheel_setup
#      https://github.com/Dicklesworthstone/agentic_coding_flywheel_setup/blob/main/install.sh
#    Once you've reviewed it and are comfortable running it, do so manually:
#      curl -fsSL https://raw.githubusercontent.com/Dicklesworthstone/agentic_coding_flywheel_setup/main/install.sh -o /tmp/flywheel-install.sh
#      less /tmp/flywheel-install.sh   # read it first
#      bash /tmp/flywheel-install.sh
echo "Skipping automatic install of the third-party flywheel toolchain."
echo "Review and run it yourself — see the comment above this line in $0."

# 3. One workspace directory per agency.
mkdir -p /opt/maxx-flywheel/{pauli-effect,afromations,macs-digital,kupuri-media,cheggie-media,myweblane}

# 4. Per-agency AGENTS.md — copy from this repo's agencies/ directory.
#    Run this script from a checkout of the repo, or scp the agencies/
#    directory to the VPS first.
if [ -d "./agencies" ]; then
  for agency in pauli-effect afromations macs-digital kupuri-media cheggie-media myweblane; do
    if [ -f "./agencies/${agency}/AGENTS.md" ]; then
      cp "./agencies/${agency}/AGENTS.md" "/opt/maxx-flywheel/${agency}/AGENTS.md"
    fi
  done
  echo "Copied per-agency AGENTS.md files."
else
  echo "WARNING: ./agencies not found — copy AGENTS.md files manually before launching sessions."
fi

# 5. Shared secret for the Vercel <-> VPS API bridge. Generate once, then set
#    FLYWHEEL_VPS_SECRET in both this VPS's environment AND the Vercel
#    project's env vars (Settings -> Environment Variables).
if [ ! -f /opt/maxx-flywheel/.secret ]; then
  openssl rand -hex 32 > /opt/maxx-flywheel/.secret
fi
echo "Flywheel VPS shared secret (copy this into Vercel's FLYWHEEL_VPS_SECRET):"
cat /opt/maxx-flywheel/.secret

echo ""
echo "== Bootstrap complete =="
echo "Next steps:"
echo "  1. Deploy ops/flywheel-vps-api (see docs/deployment/FLYWHEEL_VPS_SETUP.md)"
echo "  2. Set FLYWHEEL_VPS_URL and FLYWHEEL_VPS_SECRET in Vercel env vars"
echo "  3. Confirm each agency workspace has its AGENTS.md and a git remote configured"
