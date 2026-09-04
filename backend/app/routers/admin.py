from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.user import User
from app.models.space import Space
from app.models.booking import Booking
from app.schemas.user import UserResponse, AdminUserCreate
from app.schemas.space import SpaceResponse, SpaceCreate
from app.schemas.booking import BookingResponse
from app.schemas.admin import AdminUserUpdate
from app.core.security import hash_password
from app.services import supabase_auth_service
import datetime

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


@router.get("/dashboard")
def admin_dashboard(db: Session = Depends(get_db)):
        try:
                users = db.query(User).count()
        except Exception:
                users = 0
        try:
                spaces = db.query(Space).count()
        except Exception:
                spaces = 0
        try:
                bookings = db.query(Booking).count()
        except Exception:
                bookings = 0
        return {"users": users, "spaces": spaces, "bookings": bookings}


@router.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
        try:
                return db.query(User).all()
        except Exception:
                return []


@router.get("/bookings", response_model=List[BookingResponse])
def list_all_bookings(db: Session = Depends(get_db)):
    try:
        bookings = db.query(Booking).all()
    except Exception:
        bookings = []
    def to_resp(b: Booking):
        duration = (b.end_time - b.start_time).total_seconds() / 3600.0
        return {
            "id": b.id,
            "userId": b.user_id,
            "client": getattr(b.user, 'email', None),
            "spaceId": b.space_id,
            "spaceName": getattr(b.space, 'title', None),
            "startTime": b.start_time.isoformat(),
            "durationHours": duration,
            "totalAmount": float(b.total_price),
            "status": b.status,
            "created_at": b.created_at.isoformat(),
        }
    return [to_resp(b) for b in bookings]


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: AdminUserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    role = user_in.role if user_in.role in ("client", "admin") else "client"

    # Provision the identity first. If this fails, no local account is created.
    supabase_auth_service.create_user(
        email=user_in.email.strip().lower(),
        password=user_in.password,
        full_name=user_in.name,
        phone_number=user_in.phone_number,
    )

    user = User(
        full_name=user_in.name,
        email=user_in.email.strip().lower(),
        hashed_password=hash_password(user_in.password),
        phone_number=user_in.phone_number,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
                raise HTTPException(status_code=404, detail="User not found")
        if user.id == current_admin.id:
                raise HTTPException(status_code=400, detail="You cannot delete your own active admin account")
        # If Supabase rejects this operation, leave the local user untouched so
        # the two identity stores cannot get out of sync.
        supabase_auth_service.delete_user_by_email(user.email)
        db.delete(user)
        db.commit()
        return {"status": "deleted"}


@router.put("/users/{user_id}")
def update_user_details(user_id: int, payload: AdminUserUpdate, db: Session = Depends(get_db)):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
                raise HTTPException(status_code=404, detail="User not found")

        updates = {}
        if payload.name is not None:
                updates["full_name"] = payload.name.strip()
        if payload.email is not None:
                email = str(payload.email).strip().lower()
                existing = db.query(User).filter(User.email == email, User.id != user_id).first()
                if existing:
                        raise HTTPException(status_code=409, detail="Email already registered")
                if email != user.email:
                        # Complete the remote update before changing the local
                        # record; failed remote requests must not break login.
                        supabase_auth_service.update_user_email_by_email(user.email, email)
                updates["email"] = email
        if payload.phone_number is not None:
                updates["phone_number"] = payload.phone_number
        if payload.role is not None:
                role = payload.role if payload.role in ("client", "admin") else "client"
                updates["role"] = role

        for key, value in updates.items():
                setattr(user, key, value)

        db.commit()
        db.refresh(user)
        return {"status": "ok", "user": user}


@router.get("/spaces", response_model=List[SpaceResponse])
def list_spaces(db: Session = Depends(get_db)):
        try:
                spaces = db.query(Space).all()
        except Exception:
                spaces = []

        def to_resp(s: Space):
                return {
                        "id": s.id,
                        "title": s.title,
                        "description": s.description,
                        "location": s.location,
                        "capacity": s.capacity,
                        "pricePerHour": float(s.price_per_hour) if s.price_per_hour is not None else 0.0,
                        "ownerId": getattr(s, 'owner_id', None),
                        "status": getattr(s, 'status', 'active'),
                        "images": getattr(s, 'images', []),
                        "created_at": getattr(s, 'created_at', None),
                }

        return [to_resp(s) for s in spaces]


@router.post("/spaces", response_model=SpaceResponse, status_code=status.HTTP_201_CREATED)
def create_space(space_in: SpaceCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
        try:
                space = Space(
                        title=space_in.name,
                        description=space_in.description or "",
                        location=space_in.location,
                        capacity=space_in.capacity,
                        price_per_hour=space_in.price_per_hour,
                )
                db.add(space)
                db.commit()
                db.refresh(space)

                resp = {
                        "id": space.id,
                        "title": space.title,
                        "description": space.description,
                        "location": space.location,
                        "capacity": space.capacity,
                        "pricePerHour": float(space.price_per_hour) if space.price_per_hour is not None else 0.0,
                        "ownerId": current_admin.id if current_admin is not None else getattr(space, "owner_id", None),
                        "status": getattr(space, "status", "active"),
                        "images": getattr(space, "images", []),
                        "created_at": getattr(space, "created_at", datetime.datetime.utcnow()),
                }

                return resp
        except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
