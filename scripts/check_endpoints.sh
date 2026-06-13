#!/usr/bin/env bash
set -euo pipefail

API="http://localhost:8000"

echo "Resetting demo passwords (dev-only endpoint)..."
curl -s -X POST ${API}/auth/dev/reset-demo-passwords -H 'Content-Type: application/json' | jq || true

echo "Login as admin..."
curl -s -X POST ${API}/auth/login -H 'Content-Type: application/json' -d '{"username":"admin@gmail.com","password":"admin123"}' | jq

echo "Login as demo user mykkes..."
curl -s -X POST ${API}/auth/login -H 'Content-Type: application/json' -d '{"username":"mykkes@gmail.com","password":"myles123"}' | jq

echo "List claims..."
curl -s ${API}/claims | jq

echo "Endpoint checks completed."
