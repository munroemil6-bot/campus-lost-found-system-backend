# Define Pydantic schemas for user input and output.
# Include schemas such as UserCreate, UserRead, and UserBase.
# backend/services/user_service.py

from models.user import User
from pydantic import BaseModel
from typing import Optional

class UserService:

    @staticmethod
    def create_user(db, user):
        db.add(user)
        db.commit()
        db.refresh(user)
        return user