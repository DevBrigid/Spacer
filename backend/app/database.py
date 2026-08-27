import os
from pathlib import Path

from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

try:
    from app.config import settings
    SQLALCHEMY_DATABASE_URL = settings.database_url
except Exception:
    DEFAULT_DATABASE_URL = f"sqlite:///{Path(__file__).resolve().parents[1] / 'spacer.db'}"
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

engine_options = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_options)


if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def enable_sqlite_foreign_keys(dbapi_connection, _connection_record):
        """Enable foreign-key enforcement for every SQLite connection."""
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
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
