# Define Pydantic schemas for claim input and output.
# Include schemas such as ClaimCreate, ClaimRead, and ClaimBase.
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models.claim import Claim as ClaimModel

class ClaimCreate(BaseModel):
    user_id: int | None = None
    item_id: int
    proof: str
    claimant_name: str | None = None
    claimant_email: str | None = None


class ClaimUpdate(BaseModel):
    status: str | None = None

class ClaimService:

    @staticmethod
    def create_claim(db: Session, claim: ClaimCreate):
        new_claim = ClaimModel(
            user_id=claim.user_id,
            item_id=claim.item_id,
            proof=claim.proof,
            # store claimant details if provided
            )
        if claim.claimant_name:
            setattr(new_claim, 'claimant_name', claim.claimant_name)
        if claim.claimant_email:
            setattr(new_claim, 'claimant_email', claim.claimant_email)

        db.add(new_claim)
        db.commit()
        db.refresh(new_claim)
        return new_claim

    @staticmethod
    def update_claim(db: Session, claim_id: int, update: ClaimUpdate):
        claim = db.query(ClaimModel).filter(ClaimModel.id == claim_id).first()
        if not claim:
            return None
        if update.status is not None:
            claim.status = update.status
        db.add(claim)
        db.commit()
        db.refresh(claim)
        return claim
