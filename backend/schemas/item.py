# Define Pydantic schemas for item input and output.
# Include schemas such as ItemCreate, ItemRead, and ItemBase.
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from backend.models.item import Item as ItemModel

class ItemCreate(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    item_type: str
    user_id: Optional[int] = None

class ItemService:

    @staticmethod
    def create_item(db: Session, item: ItemCreate):
        new_item = ItemModel(
            name=item.name,
            category=item.category,
            description=item.description,
            location=item.location,
            item_type=item.item_type,
            user_id=item.user_id,
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item

    @staticmethod
    def get_items_by_type(db, item_type):
        return db.query(ItemModel).filter(ItemModel.item_type == item_type).all()
