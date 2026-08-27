from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_current_user, get_current_admin
from app.database import get_db
from app.models.booking import Booking
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.get("/", response_model=List[BookingResponse])
def list_bookings(all: bool = False, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        if all and current_user.is_admin:
            return db.query(Booking).all()
        return db.query(Booking).filter(Booking.user_id == current_user.id).all()
    except Exception:
        return []


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return booking


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
