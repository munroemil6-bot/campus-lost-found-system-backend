# Define the SQLAlchemy Claim model here.
# Include fields for item_id, user_id, status, and timestamps.
from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    item_id = Column(Integer, ForeignKey("items.id"))

    proof = Column(String)
    status = Column(String, default="pending")