#!/usr/bin/env bash
set -euo pipefail

# Ensure DB tables exist and run any startup tasks
python - <<'PY'
from database import Base, engine
Base.metadata.create_all(bind=engine)
print('DB initialized')
PY

# Start uvicorn
exec uvicorn main:app --host 0.0.0.0 --port 8000
