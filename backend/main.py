# FastAPI application entry point.
# Import routers, register them on app, and add startup/shutdown events here.
from fastapi import FastAPI

from backend.routers import items, claims
from backend.database import Base, engine
from backend.models.user import User
from backend.models.item import Item
from backend.models.claim import Claim

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(items.router)
app.include_router(claims.router)