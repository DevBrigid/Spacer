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


def test_password_reset_token_round_trip(db):
    from app.core.security import verify_password
    from app.services import auth_service

    user = auth_service.register_user(db, {"email": "reset@example.com", "password": "old-pass", "full_name": "Reset User"})
    token = auth_service.create_password_reset_token(user.email)

    assert auth_service.verify_password_reset_token(token)["email"] == user.email

    updated_user = auth_service.set_user_password_from_token(db, token, "new-pass-123")
    assert updated_user.id == user.id
    assert verify_password("new-pass-123", updated_user.hashed_password)


def test_invite_token_round_trip(db):
    from app.services import auth_service

    invite = auth_service.create_user_invite(
        db,
        {"email": "invite@example.com", "full_name": "Invited User", "role": "client"},
    )

    assert invite["email"] == "invite@example.com"
    payload = auth_service.verify_invite_token(invite["token"])
    assert payload["email"] == "invite@example.com"
    assert payload["role"] == "client"


def test_booking_overlap_is_rejected(db):
    from datetime import datetime, timedelta
    from app.services import auth_service, booking_service
    from app.crud import space_crud

    user = auth_service.register_user(db, {"email": "overlap@example.com", "password": "pw", "full_name": "Overlap User"})
    space = space_crud.create_space(db, {
        "title": "Overlap Room",
        "description": "Nice",
        "location": "HQ",
        "capacity": 4,
        "price_per_hour": 15.0,
    })

    start = datetime.utcnow() + timedelta(days=1)
    booking_service.create_booking(db, {
        "user_id": user.id,
        "space_id": space.id,
        "start_time": start.isoformat(),
        "durationHours": 2,
        "total_price": 30.0,
    })

    with pytest.raises(HTTPException, match="already booked"):
        booking_service.create_booking(db, {
            "user_id": user.id,
            "space_id": space.id,
            "start_time": (start + timedelta(hours=1)).isoformat(),
            "durationHours": 2,
            "total_price": 30.0,
        })


def test_supabase_password_update_service_uses_email_lookup(monkeypatch):
    from app.services import supabase_auth_service

    calls = []

    def fake_request(path, *, method="GET", token=None, payload=None):
        calls.append((path, method, payload))
        if path == "/auth/v1/admin/users?email=test%40example.com":
            return {"users": [{"id": "supabase-user-123"}]}
        if path == "/auth/v1/admin/users/supabase-user-123":
            return {"id": "supabase-user-123", "password": "updated"}
        raise AssertionError(f"Unexpected path: {path}")

    monkeypatch.setattr(supabase_auth_service.settings, "supabase_url", "https://demo.supabase.co")
    monkeypatch.setattr(supabase_auth_service.settings, "supabase_service_role_key", "service-role-key")
    monkeypatch.setattr(supabase_auth_service, "_request", fake_request)

    result = supabase_auth_service.update_user_password_by_email("test@example.com", "new-pass-123")

    assert result["id"] == "supabase-user-123"
    assert calls[0][0] == "/auth/v1/admin/users?email=test%40example.com"
    assert calls[1][0] == "/auth/v1/admin/users/supabase-user-123"
    assert calls[1][2] == {"password": "new-pass-123"}


def test_supabase_registration_persists_local_user(db, monkeypatch):
    import importlib

    from app.models.user import User
    from app.services import supabase_auth_service

    auth_module = importlib.import_module("app.routers.auth")

    def fake_create_user(**kwargs):
        return {"id": "supabase-user-xyz", **kwargs}

    monkeypatch.setattr(supabase_auth_service, "create_user", fake_create_user)

    response = auth_module.register_supabase_user(
        {
            "email": "supabase-register@example.com",
            "password": "StrongPass123!",
            "name": "Supabase User",
            "phone_number": "+254700000000",
        },
        db,
    )

    assert response["access_token"]
    assert response["user"].email == "supabase-register@example.com"
    assert db.query(User).filter(User.email == "supabase-register@example.com").count() == 1


def test_space_schema_accepts_frontend_payload_shape(db):
    from app.schemas.space import SpaceCreate

    payload = {
        "name": "Horizon Room",
        "description": "Bright meeting room",
        "location": "Nairobi",
        "capacity": 10,
        "pricePerHour": 3000,
    }

    space = SpaceCreate.model_validate(payload)

    assert space.name == "Horizon Room"
    assert space.price_per_hour == 3000


def test_daraja_callback_updates_payment_and_booking_when_metadata_is_single_object(db):
    from datetime import datetime

    from app.models.booking import Booking
    from app.models.payment import Payment
    from app.models.user import User
    from app.models.space import Space
    from app.routers.payments import daraja_callback

    user = User(full_name="Callback User", email="callback@example.com", hashed_password="hashed", phone_number="+254700000000", role="client")
    db.add(user)
    db.commit(); db.refresh(user)

    space = Space(title="Callback Space", description="desc", location="Nairobi", capacity=4, price_per_hour=2000, is_available=True)
    db.add(space)
    db.commit(); db.refresh(space)

    booking = Booking(user_id=user.id, space_id=space.id, start_time=datetime.utcnow(), end_time=datetime.utcnow(), total_price=2000, status="pending")
    db.add(booking)
    db.commit(); db.refresh(booking)

    payment = Payment(booking_id=booking.id, amount=2000, phone_number="254712345678", status="PENDING", checkout_request_id="ws_CO_123456", merchant_request_id="123456")
    db.add(payment)
    db.commit(); db.refresh(payment)

    payload = {
        "Body": {
            "stkCallback": {
                "MerchantRequestID": "123456",
                "CheckoutRequestID": "ws_CO_123456",
                "ResultCode": 0,
                "ResultDesc": "The service request is processed successfully.",
                "CallbackMetadata": {
                    "Item": {
                        "Name": "MpesaReceiptNumber",
                        "Value": "ABC123",
                    }
                },
            }
        }
    }

    import asyncio
    result = asyncio.run(daraja_callback(payload, db))

    db.refresh(payment)
    db.refresh(booking)
    assert result["ResultCode"] == 0
    assert payment.status == "COMPLETED"
    assert payment.mpesa_receipt_number == "ABC123"
    assert booking.status == "confirmed"


def test_admin_create_space_validation(db):
    from app.services import admin_service
    from app.services import auth_service

    admin = auth_service.register_user(db, {"email": "admin@example.com", "password": "pw", "full_name": "Admin", "role": "admin"})

    # missing required field 'title'
    with pytest.raises(HTTPException):
        admin_service.create_space_for_admin(db, {"description": "x"}, admin)
