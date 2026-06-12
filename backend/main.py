# FastAPI application entry point.
# Import routers, register them on app, and add startup/shutdown events here.
from fastapi import FastAPI

from routers import items, claims

from database import Base, engine

from models.user import User
from models.item import Item
from models.claim import Claim

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(items.router)
app.include_router(claims.router)