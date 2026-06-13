# Local development and quick start

Prefer running the app with Docker Compose. If Docker isn't available, run the backend and frontend locally.

Docker (recommended):

```bash
# bring up backend and frontend
./scripts/start.sh
```

Local (no Docker):

```bash
# Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (new terminal)
cd frontend
npm ci
npm run dev -- --host
```

After services start, run the checks:

```bash
bash scripts/check_endpoints.sh
```
