# Quick Start: Deploying to Render

## TL;DR - 5 Min Setup

### 1. **Create PostgreSQL Database**
   - Go to [render.com](https://render.com) → New → PostgreSQL
   - Name: `campus-lost-found-db`
   - Copy the **External Database URL**

### 2. **Create Web Service**
   - New → Web Service → Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT --workers 4`

### 3. **Add Environment Variables**
   ```
   DATABASE_URL = (paste PostgreSQL URL from step 1)
   ALLOWED_ORIGINS = https://your-frontend-domain.vercel.app
   JWT_SECRET = (any random string)
   ENVIRONMENT = production
   ```

### 4. **Deploy Frontend to Vercel**
   - New Project → Same GitHub repo
   - Root Directory: `frontend`
   - Environment Variable: `VITE_API_BASE_URL = https://your-api.onrender.com`

### 5. **Test**
   - Visit: `https://your-api.onrender.com/`
   - Should see: `{"message":"Campus Lost and Found API"}`

---

## What Was Fixed to Prevent Build Errors

✅ **requirements.txt** - Added gunicorn & pinned versions  
✅ **Procfile** - Updated for Render format  
✅ **database.py** - PostgreSQL support + connection pooling  
✅ **main.py** - Error handling on startup (won't crash on seed failure)  
✅ **.env.example** - Config template  
✅ **render.yaml** - Render config file  
✅ **RENDER_SETUP.md** - Complete deployment guide  

---

## Key Changes Made

### 1. backend/requirements.txt
- Added `gunicorn==21.2.0` for production server
- Added `python-dotenv==1.0.0` for environment variables
- Pinned all versions to prevent compatibility issues

### 2. backend/Procfile
```bash
# OLD (Heroku format)
web: uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

# NEW (Render format with gunicorn)
web: gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT --workers 4
```

### 3. backend/database.py
- Detects PostgreSQL URLs and sets up proper connection pooling
- Auto-converts `postgres://` to `postgresql://`
- Added `pool_pre_ping=True` to prevent stale connections

### 4. backend/main.py
- Wrapped startup events in try-catch blocks
- Demo data seeding won't crash deployment if it fails
- Added proper logging instead of print statements

---

## Environment Variables You'll Need

| Variable | Example | Where to Set |
|----------|---------|--------------|
| `DATABASE_URL` | `postgresql://user:pwd@host:5432/db` | Render Service → Settings |
| `ALLOWED_ORIGINS` | `https://myapp.vercel.app` | Render Service → Settings |
| `JWT_SECRET` | `abc123def456...` | Render Service → Settings |
| `ENVIRONMENT` | `production` | Render Service → Settings |
| `VITE_API_BASE_URL` | `https://myapi.onrender.com` | Vercel → Environment Variables |

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `ModuleNotFoundError: gunicorn` | ✅ Fixed in requirements.txt |
| Database connection fails | Check DATABASE_URL in env vars |
| `No DATABASE_URL` error | Add DATABASE_URL to Render service settings |
| CORS errors from frontend | Update ALLOWED_ORIGINS with Vercel domain |
| Startup tables fail | DB auto-creates on first run, just redeploy |

---

## Files Modified

```
backend/
  ├── requirements.txt      ← Added gunicorn, pinned versions
  ├── Procfile              ← Updated to gunicorn format
  ├── database.py           ← PostgreSQL support added
  └── main.py               ← Error handling added
.env.example                ← New: config template
render.yaml                 ← New: Render config
RENDER_SETUP.md             ← New: Full deployment guide
```

---

## Next Steps

1. **Push to GitHub** - Commit and push all changes
2. **Create DB on Render** - PostgreSQL database (Step 1 above)
3. **Create Web Service** - Connect GitHub repo (Step 2 above)
4. **Set Env Vars** - Add DATABASE_URL, ALLOWED_ORIGINS, etc (Step 3)
5. **Deploy Frontend** - Vercel project with VITE_API_BASE_URL (Step 4)
6. **Test API** - Visit `https://your-api.onrender.com/`
7. **Test App** - Use Vercel frontend URL

---

## Verification Checklist

- [ ] All files pushed to GitHub
- [ ] PostgreSQL database created on Render
- [ ] Web service created with correct root directory (`backend`)
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT --workers 4`
- [ ] DATABASE_URL environment variable set
- [ ] ALLOWED_ORIGINS environment variable set
- [ ] Service deployed successfully (check logs for "✓" messages)
- [ ] API responds at `https://your-api.onrender.com/`
- [ ] Frontend deployed to Vercel with correct API URL

---

For detailed troubleshooting, see **RENDER_SETUP.md**
