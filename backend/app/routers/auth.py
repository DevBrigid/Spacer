from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, TokenResponse
from app.core.security import create_access_token, hash_password, verify_password
from app.services import auth_service
from app.services import supabase_auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


class PasswordResetRequest(BaseModel):
    email: str


class PasswordResetConfirmRequest(BaseModel):
    token: str
    password: str


class GoogleLoginRequest(BaseModel):
    email: str
    full_name: str | None = None
    phone_number: str | None = None


class SupabaseSessionRequest(BaseModel):
    access_token: str


class InviteUserRequest(BaseModel):
    email: str
    name: str | None = None
    role: str = "client"


class InviteAcceptRequest(BaseModel):
    token: str
    password: str
    phone_number: str | None = None


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(
        full_name=user_in.name,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        phone_number=user_in.phone_number,
        role="client",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/supabase/register", response_model=TokenResponse)
def register_supabase_user(payload: dict, db: Session = Depends(get_db)):
    email = str(payload.get("email") or "").strip().lower()
    password = str(payload.get("password") or "").strip()
    full_name = str(payload.get("name") or payload.get("full_name") or "").strip()
    phone_number = str(payload.get("phone_number") or payload.get("phoneNumber") or "").strip()

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    supabase_auth_service.create_user(
        email=email,
        password=password,
        full_name=full_name or email.split("@")[0],
        phone_number=phone_number,
    )

    user = User(
        full_name=full_name or email.split("@")[0],
        email=email,
        hashed_password=hash_password(password),
        phone_number=phone_number or "",
        role="client",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/google-login", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    raise HTTPException(status_code=410, detail="Use /auth/supabase/session to exchange a verified Supabase session")


@router.post("/supabase/session", response_model=TokenResponse)
def exchange_supabase_session(payload: SupabaseSessionRequest, db: Session = Depends(get_db)):
    """Verify a Supabase session and issue this API's role-aware access token."""
    remote_user = supabase_auth_service.verify_access_token(payload.access_token)
    email = (remote_user.get("email") or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="The Supabase account does not have an email address")

    metadata = remote_user.get("user_metadata") or {}
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        user = User(
            full_name=metadata.get("full_name") or metadata.get("name") or email.split("@")[0],
            email=email,
            # Password authentication is performed by Supabase. This unusable value
            # protects legacy local-password endpoints from accepting social users.
            hashed_password=hash_password(remote_user.get("id") or "supabase-user"),
            phone_number=metadata.get("phone_number") or "",
            role="client",
        )
        db.add(user)
    else:
        if metadata.get("full_name") and not user.full_name:
            user.full_name = metadata["full_name"]
        if metadata.get("phone_number") and not user.phone_number:
            user.phone_number = metadata["phone_number"]
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/password-reset")
def password_reset(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = db.query(User).filter(User.email == email).first()
    if user:
        token = auth_service.create_password_reset_token(email)
        return {
            "message": "If an account exists for this email, a password reset email has been sent.",
            "email": email,
            "reset_requested": True,
            "reset_token": token,
        }

    return {
        "message": "If an account exists for this email, a password reset email has been sent.",
        "email": email,
        "reset_requested": False,
    }


@router.post("/password-reset-confirm")
def password_reset_confirm(payload: PasswordResetConfirmRequest, db: Session = Depends(get_db)):
    new_password = (payload.password or "").strip()
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

    try:
        user = auth_service.set_user_password_from_token(db, payload.token, new_password)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {"message": "Password updated successfully", "user_id": user.id, "email": user.email}


@router.post("/invite/create")
def create_invite(payload: InviteUserRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    try:
        invite = auth_service.create_user_invite(db, {"email": email, "full_name": payload.name, "role": payload.role})
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"message": "Invite created", **invite}


@router.post("/invite/accept")
def accept_invite(payload: InviteAcceptRequest, db: Session = Depends(get_db)):
    password = (payload.password or "").strip()
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

    try:
        user = auth_service.accept_invite(db, payload.token, password, payload.phone_number)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}
