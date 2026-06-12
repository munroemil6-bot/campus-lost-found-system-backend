# Define claim-related API routes here.
# Implement endpoints to list, create, and manage claims.
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from routers.auth import get_db
from schemas.item import ClaimService

router = APIRouter(prefix="/claims", tags=["Claims"])

@router.post("/")
def create_claim(user_id: int, item_id: int, proof: str, db: Session = Depends(get_db)):
    return ClaimService.create_claim(db, user_id, item_id, proof)