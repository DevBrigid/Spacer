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
import datetime
from datetime import timedelta

router = APIRouter(prefix="/spaces", tags=["spaces"])


@router.get("/", response_model=List[SpaceResponse])
def list_spaces(available: Optional[bool] = None, db: Session = Depends(get_db)):
	try:
		q = db.query(Space)
		if available is not None:
			q = q.filter(Space.is_available == available)
		spaces = q.all()
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
	except Exception:
		return []


@router.get("/{space_id}", response_model=SpaceResponse)
def get_space(space_id: int, db: Session = Depends(get_db)):
	space = db.query(Space).filter(Space.id == space_id).first()
	if not space:
		raise HTTPException(status_code=404, detail="Space not found")
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
	return to_resp(space)


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
	return to_resp(space)


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
	return {
		"id": space.id,
		"title": space.title,
		"description": space.description,
		"location": space.location,
		"capacity": space.capacity,
		"pricePerHour": float(space.price_per_hour) if space.price_per_hour is not None else 0.0,
		"ownerId": getattr(space, 'owner_id', None),
		"status": getattr(space, 'status', 'active'),
		"images": getattr(space, 'images', []),
		"created_at": getattr(space, 'created_at', None),
	}


@router.get("/{space_id}/bookings", response_model=List[BookingResponse])
def list_space_bookings(space_id: int, db: Session = Depends(get_db)):
	try:
		# Publicly expose confirmed bookings for a space (safe summary)
		bookings = db.query(Booking).filter(Booking.space_id == space_id, Booking.status == "confirmed").all()
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


@router.post("/{space_id}/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_space_booking(space_id: int, booking_in: BookingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	try:
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
			user_id=current_user.id,
			space_id=space_id,
			start_time=start,
			end_time=end,
			total_price=booking_in.total_amount,
			status="pending",
		)
		db.add(booking)
		db.commit()
		db.refresh(booking)
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
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{space_id}")
def delete_space(space_id: int, current_admin=Depends(get_current_admin), db: Session = Depends(get_db)):
	space = db.query(Space).filter(Space.id == space_id).first()
	if not space:
		raise HTTPException(status_code=404, detail="Space not found")
	db.delete(space)
	db.commit()
	return {"status": "deleted"}
