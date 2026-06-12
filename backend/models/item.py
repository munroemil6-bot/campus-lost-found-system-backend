# Define the SQLAlchemy Item model here.
# Include fields for title, description, location, status, and owner.
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey
from backend.database import Base

class Item(BaseModel):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    category = Column(String)
    description = Column(String)
    location = Column(String)
    item_type = Column(String, nullable=False)


    # ⭐ KEY FIELD (lost OR found)
    item_type = Column(String, nullable=False)
    # values: "lost" | "found"

    user_id = Column(Integer, ForeignKey("users.id"))