#!/usr/bin/env bash
set -euo pipefail

# Ensure node modules installed (useful in some CI contexts)
if [ ! -d node_modules ]; then
  npm ci --legacy-peer-deps
fi

# Normalize docker-hosted backend environment values for Linux.
if [ -n "${VITE_API_BASE_URL:-}" ]; then
  case "$VITE_API_BASE_URL" in
    *host.docker.internal*)
      export VITE_API_BASE_URL="$(printf '%s' "$VITE_API_BASE_URL" | sed -E 's/host\.docker\.internal/localhost/g')"
      ;;
  esac
else
  export VITE_API_BASE_URL="http://localhost:8000"
fi

exec npm run dev -- --host 0.0.0.0
