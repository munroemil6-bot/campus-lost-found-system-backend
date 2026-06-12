# Authentication helper functions.
# Implement password hashing, token creation, and verification.
from database import SessionLocal
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()