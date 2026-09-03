
from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.crud import user_crud
from app.models.user import User


def register_user(db: Session, user_data: dict) -> User:
    data = user_data.copy()
    if "password" in data:
        data["hashed_password"] = hash_password(data["password"])
        data.pop("password", None)
    return user_crud.create_user(db, data)


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, getattr(user, "hashed_password", None)):
        return None
    return user


def create_token_for_user(user: User, expires_delta: timedelta | None = None) -> str:
    payload = {"sub": str(user.id), "email": user.email, "role": getattr(user, "role", "client")}
    return create_access_token(payload, expires_delta)


def create_password_reset_token(email: str, expires_delta: timedelta | None = None) -> str:
    payload = {"sub": email, "email": email, "purpose": "password_reset"}
    return create_access_token(payload, expires_delta or timedelta(minutes=30))


def verify_password_reset_token(token: str) -> dict:
    payload = decode_access_token(token)
    if payload is None or payload.get("purpose") != "password_reset":
        raise ValueError("Invalid or expired password reset token")
    email = payload.get("email") or payload.get("sub")
    if not email:
        raise ValueError("Invalid password reset token")
    return {"email": email}


def set_user_password_from_token(db: Session, token: str, new_password: str) -> User:
    payload = verify_password_reset_token(token)
    user = db.query(User).filter(User.email == payload["email"]).first()
    if not user:
        raise ValueError("User not found")
    user.hashed_password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user


def create_user_invite(db: Session, user_data: dict) -> dict:
    email = (user_data.get("email") or "").strip().lower()
    full_name = (user_data.get("full_name") or user_data.get("name") or "").strip()
    role = (user_data.get("role") or "client").lower()
    if not email:
        raise ValueError("Email is required")

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise ValueError("User already exists")

    payload = {"sub": email, "email": email, "full_name": full_name, "role": role, "purpose": "invite"}
    return {
        "email": email,
        "full_name": full_name,
        "role": role,
        "token": create_access_token(payload, timedelta(days=7)),
    }


def verify_invite_token(token: str) -> dict:
    payload = decode_access_token(token)
    if payload is None or payload.get("purpose") != "invite":
        raise ValueError("Invalid or expired invite token")
    email = payload.get("email") or payload.get("sub")
    if not email:
        raise ValueError("Invalid invite token")
    return {
        "email": email,
        "full_name": payload.get("full_name", ""),
        "role": payload.get("role", "client"),
    }


def accept_invite(db: Session, token: str, password: str, phone_number: str | None = None) -> User:
    payload = verify_invite_token(token)
    if db.query(User).filter(User.email == payload["email"]).first():
        raise ValueError("User already exists")
    user = User(
        full_name=payload.get("full_name") or payload["email"].split("@")[0],
        email=payload["email"],
        hashed_password=hash_password(password),
        phone_number=phone_number or "",
        role=payload.get("role", "client"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

