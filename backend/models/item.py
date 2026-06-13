# Define the SQLAlchemy Item model here.
# Include fields for title, description, location, status, and owner.
from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)
    description = Column(String)
    location = Column(String)
    item_type = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
