# Render Deployment Guide

Complete setup guide to deploy the Campus Lost & Found backend to Render without build errors.

## Prerequisites

- GitHub account with the repository connected
- Render account (https://render.com)
- Backend code is in the `backend/` directory

---

## Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://render.com)
2. Click **New +** → **PostgreSQL**
3. Fill in details:
   - **Name**: `campus-lost-found-db` (or your choice)
   - **Database**: `campus_lost_found`
   - **User**: `campus_user`
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 15 or higher
4. Click **Create Database**
5. Copy the **External Database URL** (looks like: `postgresql://user:password@host:port/dbname`)
   - You'll need this in Step 3

---

## Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://render.com)
2. Click **New +** → **Web Service**
3. Select your GitHub repository
4. Fill in the configuration:

   **Basic Settings:**
   - **Name**: `campus-lost-found-api` (or your choice)
   - **Environment**: `Python 3`
   - **Region**: Same as database (for best performance)
   - **Branch**: `main`

   **Build & Deploy:**
   - **Root Directory**: `backend` ← **IMPORTANT**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT --workers 4`
   - **Auto-Deploy**: ✓ Checked

5. Click **Create Web Service**

---

## Step 3: Configure Environment Variables

Once the service is created:

1. Go to your service's **Settings** tab
2. Scroll to **Environment Variables**
3. Add the following variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | Paste the PostgreSQL URL from Step 1 | Example: `postgresql://user:password@host:5432/campus_lost_found` |
| `ALLOWED_ORIGINS` | `https://your-frontend-domain.vercel.app` | Update with your actual Vercel domain |
| `JWT_SECRET` | Generate a strong random string | Use: `openssl rand -hex 32` |
| `ENVIRONMENT` | `production` | For production deployment |

4. Click **Save** after adding each variable
5. Render will automatically redeploy with the new environment

---

## Step 4: Verify Deployment

1. Go to your service's **Logs** tab
2. Look for this success message:
   ```
   ✓ Database tables created successfully
   ✓ Admin user seeded
   ✓ Demo data seeding completed
   ```

3. Test the API:
   - Visit: `https://your-service-name.onrender.com/`
   - You should see: `{"message":"Campus Lost and Found API"}`

4. Copy your **Service URL** (e.g., `https://campus-lost-found-api.onrender.com`)
   - You'll need this for the frontend configuration

---

## Step 5: Connect Frontend (Vercel)

After backend is deployed, set up your frontend on Vercel:

1. In [Vercel Dashboard](https://vercel.com), create a new project from the same GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-service-name.onrender.com` (from Step 4)
4. Deploy

---

## Troubleshooting Build Errors

### Error: `ModuleNotFoundError` or `ImportError`

**Solution**: Ensure all imports in `backend/main.py` are correct:
```python
from database import Base, engine, SessionLocal
from models.user import User
from models.item import Item
from models.claim import Claim
from routers import auth, items, claims
```

### Error: `No module named 'gunicorn'`

**Solution**: Already fixed! The updated `requirements.txt` includes:
```
gunicorn==21.2.0
```

### Error: `DATABASE_URL not found`

**Solution**: 
1. Check that `DATABASE_URL` is set in Render **Environment Variables**
2. Verify the PostgreSQL URL format: `postgresql://user:password@host:port/dbname`
3. Test the URL manually (some PostgreSQL clients support testing)

### Error: Tables don't exist

**Solution**: The app automatically creates tables on startup with:
```python
Base.metadata.create_all(bind=engine)
```

If it still fails:
1. Check database connectivity in logs
2. Verify `DATABASE_URL` is correct
3. Ensure database user has CREATE TABLE permissions

### Error: `Connection refused` or `Connection timeout`

**Solution**:
1. Ensure database is in the same region as web service
2. Check PostgreSQL database is running (check Render dashboard)
3. Verify DATABASE_URL has correct host and port
4. Wait 30-60 seconds after database creation before connecting

---

## Files Changed for Render Compatibility

1. **backend/requirements.txt**
   - Added pinned versions for consistency
   - Added `gunicorn` for production ASGI server
   - Added `python-dotenv` for env var management

2. **backend/Procfile**
   - Updated to use gunicorn with uvicorn workers
   - Changed from `${PORT:-8000}` to `$PORT` (Render format)

3. **backend/database.py**
   - Added PostgreSQL support with connection pooling
   - Automatic postgres:// → postgresql:// conversion
   - Added pool_pre_ping for connection health checks

4. **backend/main.py**
   - Added error handling for startup events
   - Graceful seeding that won't crash on failure
   - Proper logging instead of print statements

5. **New Files**:
   - `.env.example` - Environment variable template
   - `render.yaml` - Render configuration (optional)
   - `RENDER_SETUP.md` - This guide

---

## Environment Variables Summary

```bash
# Required for Render
DATABASE_URL=postgresql://user:password@host:5432/db
ALLOWED_ORIGINS=https://your-frontend.vercel.app
JWT_SECRET=your-secret-key-here

# Optional (Render provides PORT automatically)
ENVIRONMENT=production
WORKERS=4
```

---

## Next Steps

- ✅ Push changes to GitHub
- ✅ Create PostgreSQL database on Render
- ✅ Create Web Service on Render
- ✅ Configure environment variables
- ✅ Verify API is running
- ✅ Deploy frontend on Vercel
- ✅ Update ALLOWED_ORIGINS with actual Vercel URL
- ✅ Test end-to-end (frontend ↔ backend)

---

## Common API Endpoints to Test

```bash
# Health check
curl https://your-api.onrender.com/

# Get all items
curl https://your-api.onrender.com/items

# Get lost items
curl https://your-api.onrender.com/items/lost

# Register user
curl -X POST https://your-api.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST https://your-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## Support

If you encounter issues:
1. Check Render logs in the **Logs** tab
2. Verify all environment variables are set
3. Ensure PostgreSQL database is running
4. Check GitHub Actions for deployment status
5. Review error messages in the logs carefully

Good luck! 🚀
