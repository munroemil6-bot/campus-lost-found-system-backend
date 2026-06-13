from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine, SessionLocal
from models.user import User
from models.item import Item
from models.claim import Claim
from routers import auth, items, claims

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event('startup')
def seed_admin_user():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == 'admin@gmail.com').first()
        if not existing:
            admin_user = User(
                username='admin',
                email='admin@gmail.com',
                hashed_password='admin123'
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(items.router)
app.include_router(claims.router)


@app.get("/")
def home():
    return {"message": "Campus Lost and Found API"}