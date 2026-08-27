from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.booking import Booking
from app.models.space import Space
from app.schemas.booking import BookingCreate, BookingResponse
from app.schemas.user_schema import UserOut
import datetime
from datetime import timedelta

router = APIRouter(prefix="/spacer", tags=["spacer"])


@router.get("/dashboard")
def client_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        bookings_count = db.query(Booking).filter(Booking.user_id == current_user.id).count()
    except Exception:
        bookings_count = 0
    return {"user": {"id": current_user.id, "email": current_user.email}, "bookings_count": bookings_count}


@router.get("/my/bookings", response_model=List[BookingResponse])
def list_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
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


@router.post("/my/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking_in: BookingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # enforce user ownership from token
    user_id = current_user.id
    # parse start_time and compute end_time from duration if not provided
    def _parse_iso(s: str):
        if s is None:
            return None
        return datetime.datetime.fromisoformat(s.replace('Z', '+00:00'))

    start = _parse_iso(booking_in.start_time)
    if booking_in.end_time:
        end = _parse_iso(booking_in.end_time)
    else:
        end = start + timedelta(hours=booking_in.duration_hours)

    booking = Booking(
        user_id=user_id,
        space_id=booking_in.space_id,
        start_time=start,
        end_time=end,
        total_price=booking_in.total_amount,
        status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserOut)
def update_profile(data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for key, value in data.items():
        if hasattr(current_user, key):
            setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user
