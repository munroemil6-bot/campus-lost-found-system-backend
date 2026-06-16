import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Use DATABASE_URL from environment when provided (e.g. production/Postgres).
# Fall back to a local SQLite file for development and Docker.
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./app.db")

# When using SQLite, SQLAlchemy needs the check_same_thread flag.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite:") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()