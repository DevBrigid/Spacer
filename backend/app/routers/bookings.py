from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_current_user, get_current_admin
from app.database import get_db
from app.models.booking import Booking
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse
import datetime

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.get("/", response_model=List[BookingResponse])
def list_bookings(all: bool = False, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        if all and current_user.is_admin:
            bookings = db.query(Booking).all()
        else:
            bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
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
    except Exception:
        return []


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    duration = (booking.end_time - booking.start_time).total_seconds() / 3600.0
    return {
        "id": booking.id,
        "userId": booking.user_id,
        "client": getattr(booking.user, 'email', None),
        "spaceId": booking.space_id,
        "spaceName": getattr(booking.space, 'title', None),
        "startTime": booking.start_time.isoformat(),
        "durationHours": duration,
        "totalAmount": float(booking.total_price),
        "status": booking.status,
        "created_at": booking.created_at.isoformat(),
    }


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking_in: BookingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        booking = Booking(
            user_id=current_user.id,
            space_id=booking_in.space_id,
            start_time=booking_in.start_time,
            end_time=booking_in.end_time or booking_in.start_time,
            total_price=booking_in.total_amount,
            status="pending",
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking
    except Exception:
        raise HTTPException(status_code=500, detail="Could not create booking")


@router.delete("/{booking_id}")
def delete_booking(booking_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(booking)
    db.commit()
    return {"status": "deleted"}
