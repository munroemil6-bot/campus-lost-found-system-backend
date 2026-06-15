Railway (backend) + Vercel (frontend) deployment guide

Step 1 — Deploy backend to Railway

1. Prepare your code
   - Ensure `backend/main.py` reads port from environment via `PORT` (uvicorn uses `--port ${PORT:-8000}` in `Procfile`).
   - CORS is already enabled in `main.py` via `CORSMiddleware` (the code currently allows `*`).

2. Create Railway project
   - Sign in to Railway (https://railway.app), click `New Project` > `Deploy from GitHub`.
   - Select the repository and the `backend` folder as the service root if Railway asks.

3. Configure Environment Variables
   - Add any secrets (e.g. `DATABASE_URL`, `JWT_SECRET`) under the Railway service’s `Variables` tab.

4. Start the deployment
   - Railway will detect `Procfile` and use `uvicorn` to run the app.
   - After deployment, go to `Settings` > `Networking` and `Generate Domain`. Copy the public URL for the backend (e.g. `https://your-backend.up.railway.app`).

Step 2 — Deploy frontend to Vercel

1. Import the frontend project
   - Sign into Vercel and create a new project. Select the same GitHub repository and choose the `frontend` directory when asked.

2. Configure build settings
   - Build Command: `npm ci && npm run build`
   - Output Directory: `dist` or `frontend/dist` as required by the UI

3. Environment variables
   - Add `VITE_API_BASE_URL` (or `FRONTEND_API_URL`) with the value of your Railway public URL.

4. Deploy
   - Click deploy; Vercel will build and publish your frontend.

Notes & Troubleshooting

- If Vercel builds but the frontend cannot reach the backend, ensure CORS is correctly configured on Railway backend (server should accept requests from the Vercel domain).
- If you prefer `/_/backend` route convention, configure rewrites in Vercel or update `getDefaultApiBaseUrl()` to point to the Railway URL.
