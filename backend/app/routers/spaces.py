from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.dependencies import get_current_user, get_current_admin
from app.database import get_db
from app.models.space import Space
from app.schemas.space import SpaceCreate, SpaceResponse, SpaceUpdate
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingResponse
from app.models.user import User

router = APIRouter(prefix="/spaces", tags=["spaces"])


@router.get("/", response_model=List[SpaceResponse])
def list_spaces(available: Optional[bool] = None, db: Session = Depends(get_db)):
	try:
		q = db.query(Space)
		if available is not None:
			q = q.filter(Space.is_available == available)
		return q.all()
	except Exception:
		return []


@router.get("/{space_id}", response_model=SpaceResponse)
def get_space(space_id: int, db: Session = Depends(get_db)):
	space = db.query(Space).filter(Space.id == space_id).first()
	if not space:
		raise HTTPException(status_code=404, detail="Space not found")
	return space


@router.post("/", response_model=SpaceResponse, status_code=status.HTTP_201_CREATED)
def create_space(space_in: SpaceCreate, current_admin=Depends(get_current_admin), db: Session = Depends(get_db)):
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
	return space


@router.put("/{space_id}", response_model=SpaceResponse)
def update_space(space_id: int, space_in: SpaceUpdate, current_admin=Depends(get_current_admin), db: Session = Depends(get_db)):
	space = db.query(Space).filter(Space.id == space_id).first()
	if not space:
		raise HTTPException(status_code=404, detail="Space not found")
	for key, val in space_in.dict(exclude_unset=True, by_alias=True).items():
		if hasattr(space, key):
			setattr(space, key, val)
	db.commit()
	db.refresh(space)
	return space


@router.get("/{space_id}/bookings", response_model=List[BookingResponse])
def list_space_bookings(space_id: int, db: Session = Depends(get_db)):
	try:
		# Publicly expose confirmed bookings for a space (safe summary)
		return db.query(Booking).filter(Booking.space_id == space_id, Booking.status == "confirmed").all()
	except Exception:
		return []


@router.post("/{space_id}/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_space_booking(space_id: int, booking_in: BookingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	try:
		booking = Booking(
			user_id=current_user.id,
			space_id=space_id,
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

@router.delete("/{space_id}")
def delete_space(space_id: int, current_admin=Depends(get_current_admin), db: Session = Depends(get_db)):
	space = db.query(Space).filter(Space.id == space_id).first()
	if not space:
		raise HTTPException(status_code=404, detail="Space not found")
	db.delete(space)
	db.commit()
	return {"status": "deleted"}
