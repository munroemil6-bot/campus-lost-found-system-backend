from fastapi import FastAPI

from database import Base, engine
from models.user import User
from routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)


@app.get("/")
def home():
    return {"message": "Campus Lost and Found API"}