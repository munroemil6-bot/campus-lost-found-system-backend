from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

from database import Base, engine, SessionLocal
from models.user import User
from models.item import Item
from models.claim import Claim
from routers import auth, items, claims

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("✓ Database tables created successfully")
except Exception as e:
    logger.error(f"✗ Error creating database tables: {e}")

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
            logger.info("✓ Admin user seeded")
    except Exception as e:
        logger.warning(f"⚠ Could not seed admin user: {e}")
        db.rollback()
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
            try:
                existing = db.query(User).filter(func.lower(User.email) == u['email'].lower()).first()
                if not existing:
                    user = User(username=u['username'], email=u['email'].lower(), hashed_password=u['password'])
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                    created_users[u['username']] = user
                else:
                    created_users[u['username']] = existing
            except Exception as e:
                logger.warning(f"⚠ Could not seed user {u['username']}: {e}")
                db.rollback()

        # Demo items (past reports)
        demo_items = [
            {'name': 'Blue backpack (2025)', 'category': 'Bags', 'description': 'Worn blue backpack found last year', 'location': 'Student Center', 'item_type': 'Found'},
            {'name': 'Leather wallet (2025)', 'category': 'Accessories', 'description': 'Brown leather wallet, contents removed', 'location': 'Gymnasium', 'item_type': 'Found'},
            {'name': 'Stationery bundle (2026)', 'category': 'Books & Stationery', 'description': 'Set of pens, highlighters, and notebooks found near Lecture Hall B', 'location': 'Lecture Hall B', 'item_type': 'Found'},
            {'name': 'Graphite pencil case', 'category': 'Books & Stationery', 'description': 'Lost pencil case with stationery items', 'location': 'Library', 'item_type': 'Lost'},
            {'name': 'Orange notebook', 'category': 'Books & Stationery', 'description': 'Notebook with class notes and stationery', 'location': 'Science Block', 'item_type': 'Lost'},
            {'name': 'Maths textbook', 'category': 'Books & Stationery', 'description': 'Calculus textbook lost after lecture', 'location': 'Lecture Hall A', 'item_type': 'Lost'},
            {'name': 'Campus ID badge', 'category': 'Accessories', 'description': 'Student ID badge with campus access', 'location': 'Library', 'item_type': 'Found'},
            {'name': 'Wireless earbuds', 'category': 'Electronics', 'description': 'Pair of wireless earbuds left on a bench', 'location': 'Cafeteria', 'item_type': 'Found'},
            {'name': 'Black umbrella', 'category': 'Accessories', 'description': 'Umbrella left near the main entrance', 'location': 'Main Gate', 'item_type': 'Lost'},
            {'name': 'Refillable water bottle', 'category': 'Accessories', 'description': 'Stainless steel bottle with a university sticker', 'location': 'Gymnasium', 'item_type': 'Found'},
            {'name': 'Red scarf', 'category': 'Clothing', 'description': 'Scarf lost during an evening study session', 'location': 'Student Center', 'item_type': 'Lost'},
            {'name': 'Leather key pouch', 'category': 'Accessories', 'description': 'Key pouch with fobs and a keychain', 'location': 'Housing office', 'item_type': 'Found'},
            {'name': 'Gold fountain pen', 'category': 'Books & Stationery', 'description': 'Premium pen found on a lecture hall desk', 'location': 'Lecture Hall C', 'item_type': 'Found'},
            {'name': 'Campus map folder', 'category': 'Books & Stationery', 'description': 'Folded campus map and stationery folder', 'location': 'Orientation hall', 'item_type': 'Lost'},
            {'name': 'Glasses case', 'category': 'Accessories', 'description': 'Black case with prescription glasses', 'location': 'Library', 'item_type': 'Lost'},
            {'name': 'USB flash drive', 'category': 'Electronics', 'description': '16GB drive labeled with student initials', 'location': 'Computer lab', 'item_type': 'Found'},
            {'name': 'Blue calculator', 'category': 'Books & Stationery', 'description': 'Scientific calculator with stickers', 'location': 'Engineering Lab', 'item_type': 'Lost'},
            {'name': 'Pink highlighter set', 'category': 'Books & Stationery', 'description': 'Set of highlighters found in the study lounge', 'location': 'Study Lounge', 'item_type': 'Found'},
            {'name': 'Leather journal', 'category': 'Books & Stationery', 'description': 'Personal journal missing from the cafe table', 'location': 'Campus Cafe', 'item_type': 'Lost'},
            {'name': 'Wireless mouse', 'category': 'Electronics', 'description': 'Computer mouse lost in the labs', 'location': 'Computer lab', 'item_type': 'Found'},
            {'name': 'Silver watch', 'category': 'Accessories', 'description': 'Watch with black band found near sports court', 'location': 'Sports Court', 'item_type': 'Found'},
            {'name': 'Gym membership card', 'category': 'Accessories', 'description': 'Card misplaced in the locker room', 'location': 'Locker Room', 'item_type': 'Lost'},
            {'name': 'Lab goggles', 'category': 'Safety', 'description': 'Protective goggles found after lab class', 'location': 'Chemistry Lab', 'item_type': 'Found'},
            {'name': 'Coffee tumbler', 'category': 'Accessories', 'description': 'Thermal tumbler with university logo', 'location': 'Library cafe', 'item_type': 'Lost'},
        ]

        created_items = {}
        from models.claim import Claim
        for item_data in demo_items:
            try:
                existing_item = db.query(Item).filter(Item.name == item_data['name']).first()
                if not existing_item:
                    new_item = Item(
                        name=item_data['name'],
                        category=item_data['category'],
                        description=item_data['description'],
                        location=item_data['location'],
                        item_type=item_data['item_type'],
                    )
                    db.add(new_item)
                    db.commit()
                    db.refresh(new_item)
                    created_items[item_data['name']] = new_item
                else:
                    created_items[item_data['name']] = existing_item
            except Exception as e:
                logger.warning(f"⚠ Could not seed item {item_data['name']}: {e}")
                db.rollback()

        # Demo claims for Najib and Mykes
        najib_user = created_users.get('najib')
        mykes_user = created_users.get('mykes')
        if najib_user:
            najib_claims = [
                ('Stationery bundle (2026)', 'Claim by Najib for stationery bundle found near Lecture Hall B', 'najib', najib_user.email, 'Resolved'),
                ('Orange notebook', 'Claim by Najib for notebook with class notes', 'najib', najib_user.email, 'Pending'),
                ('Graphite pencil case', 'Claim by Najib for lost stationery case', 'najib', najib_user.email, 'Pending'),
            ]
            for item_name, proof, claimant_name, claimant_email, status in najib_claims:
                try:
                    item = created_items.get(item_name)
                    if item:
                        claim_exist = db.query(Claim).filter(Claim.user_id == najib_user.id, Claim.item_id == item.id).first()
                        if not claim_exist:
                            claim = Claim(
                                user_id=najib_user.id,
                                item_id=item.id,
                                proof=proof,
                                claimant_name=claimant_name,
                                claimant_email=claimant_email,
                                status=status,
                            )
                            db.add(claim)
                            db.commit()
                except Exception as e:
                    logger.warning(f"⚠ Could not seed claim for {item_name}: {e}")
                    db.rollback()

        if mykes_user and created_items.get('Blue backpack (2025)'):
            try:
                item1 = created_items['Blue backpack (2025)']
                claim_exist = db.query(Claim).filter(Claim.user_id == mykes_user.id, Claim.item_id == item1.id).first()
                if not claim_exist:
                    claim = Claim(user_id=mykes_user.id, item_id=item1.id, proof='Claim by Mykes for backpack (2025)', claimant_name='mykes', claimant_email=mykes_user.email, status='Resolved')
                    db.add(claim)
                    db.commit()
            except Exception as e:
                logger.warning(f"⚠ Could not seed mykes claim: {e}")
                db.rollback()
                
        logger.info("✓ Demo data seeding completed")
    except Exception as e:
        logger.warning(f"⚠ Demo data seeding error: {e}")
        db.rollback()
    finally:
        db.close()

# Configure allowed CORS origins via the ALLOWED_ORIGINS environment variable.
# If ALLOWED_ORIGINS is not set, default to permissive CORS for easier testing.
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    allowed_origins = ["*"]

logger.info(f"Allowed CORS origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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