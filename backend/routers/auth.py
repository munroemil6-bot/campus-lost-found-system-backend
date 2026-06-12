# Define authentication-related API routes here.
# Implement /login, /register, and session handling.
from backend.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
