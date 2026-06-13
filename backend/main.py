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


@app.on_event('startup')
def seed_demo_data():
    db = SessionLocal()
    try:
        # Demo student users
        demo_users = [
            {"username": "mykes", "email": "mykkes@gmail.com", "password": "myles123"},
            {"username": "najib", "email": "najib@gmail.com", "password": "najib123"},
        ]

        created_users = {}
        from sqlalchemy import func
        for u in demo_users:
            existing = db.query(User).filter(func.lower(User.email) == u['email'].lower()).first()
            if not existing:
                user = User(username=u['username'], email=u['email'].lower(), hashed_password=u['password'])
                db.add(user)
                db.commit()
                db.refresh(user)
                created_users[u['username']] = user
            else:
                created_users[u['username']] = existing

        # Demo items (past reports)
        existing_item = db.query(Item).filter(Item.name == 'Blue backpack (2025)').first()
        if not existing_item:
            item1 = Item(name='Blue backpack (2025)', category='Bags', description='Worn blue backpack found last year', location='Student Center', item_type='Found')
            item2 = Item(name='Leather wallet (2025)', category='Accessories', description='Brown leather wallet, contents removed', location='Gymnasium', item_type='Found')
            db.add_all([item1, item2])
            db.commit()
            db.refresh(item1)
            db.refresh(item2)
        else:
            item1 = existing_item
            item2 = db.query(Item).filter(Item.name == 'Leather wallet (2025)').first()

        # Demo claims for the demo users (linked to past items)
        # Create a claim for mykes on item1 and none for najib (so najib has no claims initially)
        from models.claim import Claim
        mykes_user = created_users.get('mykes')
        if mykes_user and item1:
            claim_exist = db.query(Claim).filter(Claim.user_id == mykes_user.id, Claim.item_id == item1.id).first()
            if not claim_exist:
                claim = Claim(user_id=mykes_user.id, item_id=item1.id, proof='Claim by Mykes for backpack (2025)', claimant_name='mykes', claimant_email=mykes_user.email, status='Resolved')
                db.add(claim)
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