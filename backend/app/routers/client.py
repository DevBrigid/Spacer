from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.booking import Booking
from app.models.space import Space
from app.schemas.booking import BookingCreate, BookingResponse
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.user import UserResponse, ChangePasswordRequest
from app.core.security import hash_password, verify_password
import datetime
from datetime import timedelta

router = APIRouter(prefix="/spacer", tags=["spacer"])


@router.get("/dashboard")
def client_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()

    upcoming = [
        b for b in bookings
        if b.status in ("pending", "confirmed") and b.start_time > datetime.datetime.now(datetime.timezone.utc)
    ]
    upcoming.sort(key=lambda b: b.start_time)

    return {
        "user": {
            "id": current_user.id,
            "name": current_user.full_name,
        },
        "bookings_summary": {
            "total": len(bookings),
            "pending": len([b for b in bookings if b.status == "pending"]),
            "confirmed": len([b for b in bookings if b.status == "confirmed"]),
            "cancelled": len([b for b in bookings if b.status == "cancelled"]),
        },
        "upcoming_bookings": [_booking_to_resp(b) for b in upcoming[:5]],
    }

def _booking_to_resp(b: Booking):
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


@router.get("/my/bookings", response_model=List[BookingResponse])
def list_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    except Exception:
        bookings = []
    return [_booking_to_resp(b) for b in bookings]


@router.get("/my/bookings/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return _booking_to_resp(booking)


@router.post("/my/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking_in: BookingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id

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
    return _booking_to_resp(booking)


@router.delete("/my/bookings/{booking_id}")
def delete_booking(booking_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(booking)
    db.commit()
    return {"status": "deleted"}


@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)

    if "name" in update_data:
        current_user.full_name = update_data["name"]
    if "phone_number" in update_data:
        current_user.phone_number = update_data["phone_number"]

    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/profile/password")
def change_password(request: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    current_user.hashed_password = hash_password(request.new_password)
    db.commit()
    return {"message": "Password changed successfully"}