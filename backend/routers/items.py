# Define item-related API routes here.
# Implement endpoints to list, create, update, and delete items.
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.routers.auth import get_db
from backend.models.item import Item
from backend.schemas.item import ItemCreate, ItemService

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