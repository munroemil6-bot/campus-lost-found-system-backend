# Define item-related API routes here.
# Implement endpoints to list, create, update, and delete items.
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.item import Item
from schemas.item import ItemCreate, ItemService

router = APIRouter(prefix="/items", tags=["Items"])

@router.post("/")
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    return ItemService.create_item(db, item)

@router.get("/")
def get_items(db: Session = Depends(get_db)):
    return db.query(Item).all()

@router.get("/lost")
def get_lost_items(db: Session = Depends(get_db)):
    return ItemService.get_items_by_type(db, "lost")

@router.get("/found")
def get_found_items(db: Session = Depends(get_db)):
    return ItemService.get_items_by_type(db, "found")


@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    result = ItemService.delete_item(db, item_id)
    if result is None:
        return {"detail": "Not found"}
    return result