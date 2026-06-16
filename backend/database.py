import os
from sqlalchemy import create_engine, event, exc
from sqlalchemy.orm import declarative_base, sessionmaker

# Use DATABASE_URL from environment when provided (e.g. production/Postgres).
# Fall back to a local SQLite file for development and Docker.
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./app.db")

# When using SQLite, SQLAlchemy needs the check_same_thread flag.
if DATABASE_URL.startswith("sqlite:"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
    )
elif DATABASE_URL.startswith("postgres://"):
    # Convert postgres:// to postgresql:// for newer SQLAlchemy versions
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(
        DATABASE_URL,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,  # Test connection before using
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
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