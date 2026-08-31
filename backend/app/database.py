import os
from pathlib import Path
from typing import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, declarative_base, sessionmaker

try:
    from app.config import settings
    SQLALCHEMY_DATABASE_URL = settings.database_url
except Exception:
    DEFAULT_DATABASE_URL = f"sqlite:///{Path(__file__).resolve().parents[1] / 'spacer.db'}"
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

# Configurable engine options via environment variables
DB_ECHO = os.getenv("DB_ECHO", "False").lower() in ("1", "true", "yes")
DB_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "5"))
DB_MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "10"))

engine_options = {"pool_pre_ping": True}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    # required for SQLite when used with multiple threads
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=DB_ECHO,
    pool_size=DB_POOL_SIZE,
    max_overflow=DB_MAX_OVERFLOW,
    **engine_options,
)


if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def enable_sqlite_foreign_keys(dbapi_connection, _connection_record):
        """Enable foreign-key enforcement for every SQLite connection."""
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


# Use 2.0 "future" sessions and avoid expiring on commit to reduce detached object issues
SessionLocal = sessionmaker(bind=engine, autoflush=False, future=True, expire_on_commit=False)
Base = declarative_base()


def init_db():
    """Create the schema for a new database after registering all models."""
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


__all__ = ["Base", "engine", "SessionLocal", "get_db", "init_db"]
