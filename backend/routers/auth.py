from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from schemas.user import UserCreate, UserLogin
from models.user import User
from database import get_db
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    normalized_email = user.email.strip().lower()
    normalized_username = user.username.strip()

    # 1. Check if the email is already taken
    existing_email = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    # 2. Check if the username is already taken
    existing_username = db.query(User).filter(func.lower(User.username) == normalized_username.lower()).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken"
        )

    # 3. Create and save the new user
    new_user = User(
        username=normalized_username,
        email=normalized_email,
        # NOTE: Passwords are raw text for now. You should add hashing later.
        hashed_password=user.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


@router.post("/login", status_code=status.HTTP_200_OK)
def login(user: UserLogin, db: Session = Depends(get_db)):
    credential = user.username.strip()
    normalized_credential = credential.lower()

    # 1. Fetch user from database by username or email (case-insensitive)
    db_user = db.query(User).filter(
        or_(
            func.lower(User.username) == normalized_credential,
            func.lower(User.email) == normalized_credential,
        )
    ).first()

    # 2. Verify user exists
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # 3. Verify password matches (Plain text check for now)
    if db_user.hashed_password != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # 4. Return successful login payload
    # Mark admin by matching email case-insensitively (avoid relying on username equality)
    is_admin = (db_user.email or '').strip().lower() == 'admin@gmail.com'

    return {
        "message": f"Welcome back, {db_user.username}!",
        "user_id": db_user.id,
        "email": db_user.email,
        "username": db_user.username,
        "is_admin": is_admin,
    }


@router.post('/dev/reset-demo-passwords')
def reset_demo_passwords(db: Session = Depends(get_db)):
    """Development-only: reset known demo user passwords.

    Resets passwords for the demo accounts so testing is reliable.
    """
    # Use case-insensitive matching to find demo users and reset their passwords.
    demo = [
        {"email": "mykkes@gmail.com", "password": "myles123"},
        {"email": "najib@gmail.com", "password": "najib123"},
    ]
    updated = []
    for d in demo:
        u = db.query(User).filter(func.lower(User.email) == d['email'].lower()).first()
        if u:
            u.hashed_password = d['password']
            db.add(u)
            updated.append(u.email)
    db.commit()
    return {"updated": updated}


@router.get('/dev/list-users')
def list_users(db: Session = Depends(get_db)):
    """Development-only: list users for debugging (id, username, email)."""
    users = db.query(User).all()
    return [{"id": u.id, "username": u.username, "email": u.email} for u in users]


@router.post('/dev/ensure-admin')
def ensure_admin(db: Session = Depends(get_db)):
    """Development-only: ensure the admin user exists with a known password."""
    admin_email = 'admin@gmail.com'
    admin_username = 'admin'
    admin_password = 'admin123'
    user = db.query(User).filter(func.lower(User.email) == admin_email).first()
    created = False
    if not user:
        user = User(username=admin_username, email=admin_email, hashed_password=admin_password)
        db.add(user)
        db.commit()
        created = True
    return {"admin_exists": True, "created": created, "email": admin_email}

