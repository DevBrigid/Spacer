import pytest
from fastapi import HTTPException


@pytest.fixture
def db():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    # Use in-memory SQLite for unit tests
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, future=True)

    # Import Base after creating engine to ensure models use same metadata
    from app.database import Base

    # Ensure model modules are imported so they register tables on Base.metadata
    import importlib
    for m in (
        "app.models.user",
        "app.models.space",
        "app.models.booking",
        "app.models.payment",
        "app.models.invoice",
        "app.models.admin",
    ):
        try:
            importlib.import_module(m)
        except Exception:
            pass

    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_auth_register_and_authenticate(db):
    from app.services import auth_service

    user_data = {"email": "test@example.com", "password": "secret", "full_name": "Test User"}
    user = auth_service.register_user(db, user_data)

    assert user.id is not None
    assert user.email == "test@example.com"

    auth_user = auth_service.authenticate_user(db, "test@example.com", "secret")
    assert auth_user is not None

    token = auth_service.create_token_for_user(auth_user)
    assert isinstance(token, str) and len(token) > 0


def test_booking_create_and_invalid(db):
    from datetime import datetime, timedelta
    from app.services import booking_service, auth_service
    from app.crud import space_crud

    # create user
    user = auth_service.register_user(db, {"email": "btest@example.com", "password": "pw", "full_name": "B Test"})

    # create space
    space = space_crud.create_space(db, {
        "title": "Room A",
        "description": "Nice",
        "location": "HQ",
        "capacity": 4,
        "price_per_hour": 10.0,
    })

    start = datetime.utcnow()
    start_iso = start.isoformat()

    booking = booking_service.create_booking(db, {
        "user_id": user.id,
        "space_id": space.id,
        "start_time": start_iso,
        "durationHours": 2,
        "total_price": 20.0,
    })

    assert booking.id is not None
    assert booking.end_time > booking.start_time

    # invalid duration
    with pytest.raises(HTTPException):
        booking_service.create_booking(db, {
            "user_id": user.id,
            "space_id": space.id,
            "start_time": start_iso,
            "durationHours": 0,
            "total_price": 0,
        })


def test_admin_create_space_validation(db):
    from app.services import admin_service
    from app.services import auth_service

    admin = auth_service.register_user(db, {"email": "admin@example.com", "password": "pw", "full_name": "Admin", "role": "admin"})

    # missing required field 'title'
    with pytest.raises(HTTPException):
        admin_service.create_space_for_admin(db, {"description": "x"}, admin)
