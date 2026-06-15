Render (backend) + Vercel (frontend) deployment guide

Step 1 — Prepare backend for Render

1. Ensure `backend` is ready
   - `backend/Procfile` exists (this repo has `Procfile` with `uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}`).
   - `requirements.txt` lists runtime deps (`fastapi`, `uvicorn[standard]`, etc.).
   - CORS is configurable via the `ALLOWED_ORIGINS` env var in `backend/main.py` (set to your Vercel domain).

2. Recommended files
   - Optional: `runtime.txt` to pin Python version (example: `python-3.11.4`).

Step 2 — Deploy backend to Render

1. Create a new Web Service on Render
   - Go to https://render.com -> New -> Web Service -> Connect GitHub and select this repository.
   - Set the `Root Directory` to `backend` (or the repo root if Render auto-detects).

2. Build & Start commands
   - Build Command: `pip install -r requirements.txt`
   - Start Command (choose one):
     - Simple: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - Production (recommended): `gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT --workers 4` (add `gunicorn` to `requirements.txt` if using this)

3. Environment variables (Render service > Environment)
   - `ALLOWED_ORIGINS` = your Vercel frontend URL (example: `https://your-frontend.vercel.app`)
   - `DATABASE_URL`, `JWT_SECRET`, etc., as required by your app.

4. Deploy
   - Click `Create Web Service` / `Deploy` and wait for Render to build and start the service.
   - Copy the public URL Render provides (for example: `https://your-backend.onrender.com`).

Step 3 — Deploy frontend to Vercel and link to Render backend

1. Create Vercel Project
   - In Vercel, import the same GitHub repository and select the `frontend` directory for the project.

2. Build settings
   - Build Command: `npm ci && npm run build`
   - Output Directory: `dist`

3. Environment variables (Vercel Project Settings)
   - `VITE_API_BASE_URL` (or `FRONTEND_API_URL`) = the Render backend URL (e.g., `https://your-backend.onrender.com`)

4. Deploy
   - Deploy the Vercel project. After build, Vercel will publish your frontend.

Step 4 — Verify and test

1. Confirm CORS
   - Ensure `ALLOWED_ORIGINS` on Render includes your Vercel deployment domain.

2. Test login and API calls
   - Open the Vercel URL and test login/register. If requests fail, open browser devtools and inspect network requests to the backend URL.

Quick troubleshooting

- If API calls return CORS errors: update `ALLOWED_ORIGINS` on Render to include the exact Vercel domain (with `https://`).
- If the frontend still points to the wrong backend: confirm `VITE_API_BASE_URL` is set in Vercel and that `frontend/src/services/api.js` reads it (it does in this repo).

Useful local commands

```bash
# Run backend locally
pip install -r backend/requirements.txt
cd backend
uvicorn main:app --reload --port 8000

# Run frontend locally
cd frontend
npm ci
npm run dev -- --host
```

If you want I can:
- create `runtime.txt` with a pinned Python version, and
- add `gunicorn` to `backend/requirements.txt` and push those changes.

