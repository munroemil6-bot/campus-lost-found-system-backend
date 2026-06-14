#!/usr/bin/env bash
set -euo pipefail

# Start backend and frontend with docker-compose (preferred) and run verification checks.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -S /var/run/docker.sock ]; then
  echo "Detected Docker socket, attempting to bring up services with docker compose..."
  docker compose up --build -d
  echo "Waiting for backend to become available (http://localhost:8000)..."
  for i in {1..30}; do
    if curl -s http://localhost:8000/ >/dev/null 2>&1; then
      echo "Backend is up"
      break
    fi
    sleep 1
  done
  if ! curl -s http://localhost:8000/ >/dev/null 2>&1; then
    echo "Backend did not become ready in time. Check 'docker compose logs backend'"
    exit 1
  fi

  echo "Running endpoint checks..."
  bash scripts/check_endpoints.sh
  echo "All done. Open http://localhost:3000 in your browser to test login."
  exit 0
fi

echo "Docker socket not available. To run locally, follow these steps:" 
cat <<'EOF'
1) Create and activate a Python venv for backend:

   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload

2) In another terminal, start the frontend dev server:

   cd frontend
   npm ci
   npm run dev -- --host

3) After backend is running, run the checks:

   bash scripts/check_endpoints.sh

EOF
