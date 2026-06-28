#!/bin/bash
# Affluena-WEB SessionStart hook.
# Installs npm dependencies so build, lint, and tests work in Claude Code on the web.
set -euo pipefail

# Only run in the remote (Claude Code on the web) environment.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "[session-start] Affluena-WEB: installing npm dependencies..."
# Use `npm install` (not `npm ci`) so the cached container state is reused
# across sessions instead of wiping node_modules every time.
npm install

echo "[session-start] Affluena-WEB: dependencies ready."
