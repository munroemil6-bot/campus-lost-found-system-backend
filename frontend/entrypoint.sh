#!/usr/bin/env bash
set -euo pipefail

# Ensure node modules installed (useful in some CI contexts)
if [ ! -d node_modules ]; then
  npm ci --legacy-peer-deps
fi

exec npm run dev -- --host 0.0.0.0
