"""
SQLAlchemy engine, session factory, and declarative Base.
Supports both SQLite (local dev) and PostgreSQL (Supabase production).
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from typing import Generator

from config import settings

# Build engine with appropriate options per database
connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,
}

if settings.DATABASE_URL.startswith("sqlite"):
    # SQLite needs check_same_thread=False for FastAPI
    connect_args = {"check_same_thread": False}
    # SQLite doesn't support pool_size / max_overflow
else:
    # PostgreSQL connection pool settings
    engine_kwargs["pool_size"] = 5
    engine_kwargs["max_overflow"] = 10

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    **engine_kwargs,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency — yields a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
