
from datetime import timedelta
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.crud import user_crud
from app.models.user import User


def register_user(db: Session, user_data: dict) -> User:
    data = user_data.copy()
    if "password" in data:
        data["hashed_password"] = hash_password(data["password"])
        # remove plain password key if present
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

