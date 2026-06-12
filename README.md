# Campus Lost & Found System

Campus Lost & Found is a web application that helps students, staff, and visitors report, browse, and claim lost or found items on a campus.

## Overview

Core ideas:
- Report lost items with descriptions, photos, and locations.
- Report found items and provide details for the finder.
- Browse reported items and search by category, location, and date.
- Submit and manage claims to reunite owners with their belongings.
- Support user authentication and an admin dashboard for moderation.

## Backend

The backend is implemented in FastAPI and lives under the `backend/` folder.

### Key backend files

- `backend/main.py` — FastAPI app entrypoint
- `backend/database.py` — SQLAlchemy engine, session, and base model
- `backend/models/` — SQLAlchemy models for users, items, and claims
- `backend/routers/` — API route definitions for items, claims, and auth
- `backend/schemas/` — schema/service helpers and Pydantic request models
- `backend/requirements.txt` — Python dependencies for the backend
- `backend/Dockerfile.backend` — backend container build instructions

### Prerequisites

- Python 3.12 (recommended)
- `pip` for Python package installation
- `docker` and `docker compose` if using containers

### Install backend dependencies

From the project root:

```bash
cd backend
python3 -m pip install -r requirements.txt
```

### Run backend locally

From the project root:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Or from inside the `backend/` directory:

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://127.0.0.1:8000`.

### Run backend with Docker Compose

From the project root:

```bash
docker compose up --build
```

This starts both the backend and frontend services. The backend is exposed on port `8000`.

### Current backend endpoints

- `GET /items/` — list all items
- `POST /items/` — create a lost or found item
- `GET /items/lost` — list lost items
- `GET /items/found` — list found items
- `GET /claims/` — list claims
- `POST /claims/` — create a claim

### Notes

- The backend uses a SQLite database file named `lost_found.db` created in the `backend/` folder.
- Backend code imports are now aligned to use the `backend` package path to avoid module resolution issues.

## Frontend

The frontend is implemented in the `frontend/` folder using Vite and Tailwind CSS.

## What this project solves

- Fragmented reporting is centralized in one searchable system.
- Recovery becomes faster by surfacing candidate matches.
- Claims and reports are auditable, reducing lost handoffs.
- Campus communities get a safer, more structured way to reunite items with owners.

## Next steps

- Add frontend/backend authentication and user registration.
- Implement item search and filtering in the UI.
- Add claim verification and admin moderation workflows.
- Add email or notification support for claim updates.
