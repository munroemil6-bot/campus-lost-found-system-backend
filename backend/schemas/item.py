# Define Pydantic schemas for item input and output.
# Include schemas such as ItemCreate, ItemRead, and ItemBase.
from models.item import Item
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from backend.models.item import Item

class ItemService:

    @staticmethod
    def create_item(db : Session , item):
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def get_items_by_type(db, item_type):
        return db.query(Item).filter(Item.item_type == item_type).all()