# Define claim-related API routes here.
# Implement endpoints to list, create, and manage claims.
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.claim import ClaimCreate, ClaimService
from models.claim import Claim

router = APIRouter(prefix="/claims", tags=["Claims"])

@router.post("/")
def create_claim(claim: ClaimCreate, db: Session = Depends(get_db)):
    return ClaimService.create_claim(db, claim)

@router.get("/")
def get_claims(db: Session = Depends(get_db)):
    return db.query(Claim).all()


@router.patch("/{claim_id}")
def update_claim(claim_id: int, update: dict, db: Session = Depends(get_db)):
    # Accept a partial update dictionary (e.g. {"status": "Resolved"})
    from schemas.claim import ClaimUpdate
    upd = ClaimUpdate(**update)
    updated = ClaimService.update_claim(db, claim_id, upd)
    if updated is None:
        return {"detail": "Not found"}
    return updated
