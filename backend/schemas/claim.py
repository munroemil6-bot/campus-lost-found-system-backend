# Define Pydantic schemas for claim input and output.
# Include schemas such as ClaimCreate, ClaimRead, and ClaimBase.
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.models.claim import Claim as ClaimModel

class ClaimCreate(BaseModel):
    user_id: int
    item_id: int
    proof: str

class ClaimService:

    @staticmethod
    def create_claim(db: Session, claim: ClaimCreate):
        new_claim = ClaimModel(
            user_id=claim.user_id,
            item_id=claim.item_id,
            proof=claim.proof,
        )
        db.add(new_claim)
        db.commit()
        db.refresh(new_claim)
        return new_claim
