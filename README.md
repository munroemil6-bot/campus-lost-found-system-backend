# Campus Lost & Found System

Campus Lost & Found is a web application that helps students, staff, and visitors report, browse, and claim lost or found items on a campus.

## Project Overview

**Core Features:**
- Report lost items with descriptions, photos, and locations.
- Report found items and provide details for the finder.
- Browse reported items and search by category, location, and date.
- Submit and manage claims to reunite owners with their belongings.
- User authentication and admin dashboard for moderation.

**Technology Stack:**
- **Backend**: FastAPI (Python 3.12)
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: SQLite
- **Containerization**: Docker & Docker Compose

---

## Frontend

The frontend is implemented in the `frontend/` folder using Vite, React, and Tailwind CSS.

### Frontend Features (In Development)

- **Authentication Pages**
  - Login page with form validation
  - Register page for new account creation
  - Responsive design with blue & gold color scheme
  
- **Navigation**
  - Home page with campus community landing
  - Lost Items browsing
  - Found Items browsing
  - Submit Item reporting
  - Login/Register links in navbar

- **Styling**
  - Tailwind CSS for responsive, modern UI
  - Dark theme with amber accents
  - Mobile-friendly layouts

### Frontend Tech

- `frontend/src/pages/` — Login, Register, Home, and other page components
- `frontend/src/components/` — Reusable UI components (Navbar, ItemCard, etc.)
- `frontend/src/services/api.js` — Axios instance for backend API calls
- `frontend/tailwind.config.js` — Tailwind CSS configuration
- `frontend/Dockerfile.frontend` — frontend container build instructions

### Frontend Setup

```bash
cd frontend
npm install
npm run dev -- --host
```

Frontend runs on `http://localhost:3000`

---

## Backend

The backend is implemented in FastAPI and lives under the `backend/` folder.

### Key Backend Files

- `backend/main.py` — FastAPI app entrypoint with CORS middleware
- `backend/models/` — SQLAlchemy models for users, items, and claims
- `backend/routers/auth.py` — Authentication routes (register, login)

## Frontend: How it works and how to access from a link

**Overview**

- The frontend is a Vite + React app located in the `frontend/` folder. It provides the public UI (Home, Browse, Report Lost/Found), and authentication pages (Login, Register). The authenticated views are `StudentDashboard` and `AdminDashboard`.
- Routing is handled by React Router in `frontend/src/App.jsx`. Key routes:
   - `/` — Home
   - `/login` — Login form
   - `/register` — Registration form
   - `/browse` — Browse reported items
   - `/report/lost` and `/report/found` — report item forms
   - `/student-dashboard` — student landing page (shows user's claims inline)
   - `/admin` — admin dashboard (requires admin user)

**API integration**

- API client is `frontend/src/services/api.js`. It reads `VITE_API_BASE_URL` at build/runtime and normalizes hostnames so the app works on Linux (replacing `host.docker.internal` with `localhost`). It sets `window.__CLF_API_BASE` in the browser for debugging.
- Authentication flow: `Login.jsx` sends `{ username, password }` to `POST /auth/login`. The app accepts either username or email (case-insensitive). On success, the returned user object is stored in `localStorage` under the key `clf_user` (no expiry) so the session persists until sign-out.

**Accessing the running frontend from a link**

If you run the frontend locally (dev server) it listens on `http://localhost:3000`. You can provide a direct link to testers like:

```
http://localhost:3000
```

When running in Docker, expose port `3000` and set `VITE_API_BASE_URL` to your backend address (default in `docker-compose.yml` is `http://localhost:8000`). Example run command from README sections:

```bash
sudo docker run -p 3000:3000 -d --name campus-frontend -e VITE_API_BASE_URL=http://localhost:8000 campus-frontend
```

If testers are on the same machine, `http://localhost:3000` will load the frontend. If you need to share to other machines on your LAN, run Vite with `--host` and use the host machine's IP address:

```bash
# start dev server
cd frontend
npm run dev -- --host

# if your host IP is 192.168.1.50, the link becomes
http://192.168.1.50:3000
```

**Troubleshooting**

- If login attempts fail from the browser but `curl` to the API works, ensure the frontend dev server was restarted after code changes (so `api.js` normalization is applied).
- If you see requests to `host.docker.internal:8000` on Linux, restart the frontend dev server or use the Docker run example with `VITE_API_BASE_URL=http://localhost:8000`.
- Python 3.12 (recommended)
- `pip` for Python package installation
- `docker` if using containers

### Install Backend Dependencies

```bash
cd backend
python3 -m pip install -r requirements.txt
```

### Run Backend Locally

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://127.0.0.1:8000`

### Current Backend Endpoints

**Authentication:**
- `POST /auth/register` — create a new user account
- `POST /auth/login` — authenticate and log in

**Items:**
- `GET /items/` — list all items
- `POST /items/` — create a lost or found item
- `GET /items/lost` — list lost items
- `GET /items/found` — list found items

**Claims:**
- `GET /claims/` — list claims
- `POST /claims/` — create a claim

### Notes

- The backend uses a SQLite database file named `app.db` created in the `backend/` folder.
- CORS is enabled for `http://localhost:3000` to allow frontend requests.
- Password validation is currently plain-text. Add hashing (bcrypt) for production.

---

## Docker

Build and run both backend and frontend services using Docker.

### Prerequisites

- Docker installed on your system
- `sudo` access or user added to docker group

### Build and Run Backend

```bash
sudo docker build -f backend/Dockerfile.backend -t campus-backend ./backend
sudo docker run -d --name campus-backend -p 8000:8000 campus-backend
```

### Build and Run Frontend

```bash
sudo docker build -f frontend/Dockerfile.frontend -t campus-frontend ./frontend
sudo docker run -d --name campus-frontend -p 3000:3000 -e VITE_API_BASE_URL=http://localhost:8000 campus-frontend
```

### Verify Containers Are Running

```bash
sudo docker ps --filter "name=campus"
```

You should see both `campus-backend` and `campus-frontend` with status `Up`.

### Alternative: Docker Compose

From the project root:

```bash
docker compose up --build
```

This starts both services together. The compose file sets up networking and environment variables automatically.

---

## How to Access

Once both containers are running:

1. **Frontend**: Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

2. **Backend API**: Available at:
   ```
   http://localhost:8000
   ```

3. **API Documentation**: FastAPI automatically generates interactive docs:
   ```
   http://localhost:8000/docs
   ```

### Test Authentication

1. Click **Register** in the navbar
2. Create a new account:
   - Username: `testuser`
   - Email: `testuser@campus.edu`
   - Password: `testpass123`
3. Click **Login** and use the same credentials
4. On success, you'll see: "Welcome back, testuser!"

---

## What This Project Solves

- Fragmented reporting is centralized in one searchable system.
- Recovery becomes faster by surfacing candidate matches.
- Claims and reports are auditable, reducing lost handoffs.
- Campus communities get a safer, more structured way to reunite items with owners.

---

## Next Steps

- Complete item search and filtering in the UI.
- Add claim verification and admin moderation workflows.
- Add email or notification support for claim updates.
- Implement password hashing and JWT token authentication.
- Add image upload for items.
- Deploy to production with PostgreSQL database.

