from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from schemas.user import UserCreate, UserLogin
from models.user import User
from database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if the email is already taken
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    # 2. Check if the username is already taken
    existing_username = db.query(User).filter(User.username == user.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken"
        )

    # 3. Create and save the new user
    new_user = User(
        username=user.username,
        email=user.email,
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
    # 1. Fetch user from database by username
    db_user = db.query(User).filter(User.username == user.username).first()

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
    return {
        "message": f"Welcome back, {db_user.username}!",
        "user_id": db_user.id,
        "email": db_user.email
    }

