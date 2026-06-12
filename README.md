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
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Backend

The backend is implemented in FastAPI and lives under the `backend/` folder.

### Key Backend Files

- `backend/main.py` — FastAPI app entrypoint with CORS middleware
- `backend/database.py` — SQLAlchemy engine, session, and base model
- `backend/models/` — SQLAlchemy models for users, items, and claims
- `backend/routers/auth.py` — Authentication routes (register, login)
- `backend/routers/items.py` — Item management routes
- `backend/routers/claims.py` — Claims management routes
- `backend/schemas/` — Pydantic request/response models
- `backend/requirements.txt` — Python dependencies

### Prerequisites

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
# Build backend image
sudo docker build -f backend/Dockerfile.backend -t campus-backend ./backend

# Run backend container on port 8000
sudo docker run -p 8000:8000 -d --name campus-backend-container campus-backend
```

### Build and Run Frontend

```bash
# Build frontend image
sudo docker build -f frontend/Dockerfile.frontend -t campus-frontend ./frontend

# Run frontend container on port 3000 with API base URL
sudo docker run -p 3000:3000 -d --name campus-frontend-container -e VITE_API_BASE_URL=http://localhost:8000 campus-frontend
```

### Verify Containers Are Running

```bash
sudo docker ps --filter "name=campus"
```

You should see both `campus-backend-container` and `campus-frontend-container` with status `Up`.

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

