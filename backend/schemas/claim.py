# Define Pydantic schemas for claim input and output.
# Include schemas such as ClaimCreate, ClaimRead, and ClaimBase.
from models.claim import Claim
from pydantic import BaseModel
from typing import Optional

class ClaimService:

    @staticmethod
    def create_claim(db, user_id, item_id, proof):

        claim = Claim(
            user_id=user_id,
            item_id=item_id,
            proof=proof
        )

        db.add(claim)
        db.commit()
        db.refresh(claim)

        return claim