from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.dependencies import get_current_user, get_current_admin
from app.database import get_db
from app.models.space import Space
from app.schemas.space import SpaceCreate, SpaceResponse, SpaceUpdate
from app.models.booking import Booking
from app.schemas.booking import BookingResponse
from app.models.user import User
from app.utils.image_upload import upload_space_image

router = APIRouter(prefix="/spaces", tags=["spaces"])

DEFAULT_SPACE_IMAGE = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"


def _space_status(space: Space) -> str:
	if isinstance(getattr(space, "is_available", None), bool):
		return "available" if space.is_available else "booked"
	status = str(getattr(space, "status", "active") or "active").lower()
	if status in {"available", "active", "open"}:
		return "available"
	if status in {"booked", "occupied", "inactive"}:
		return "booked"
	return "available"


def _is_available_from_status(status_value: str | None) -> bool:
	"""Translate the admin form's human-readable status into the DB flag."""
	return str(status_value or "available").strip().lower() in {"available", "active", "open"}


def _space_images(space: Space):
	if isinstance(getattr(space, "images", None), list) and space.images:
		return space.images
	url = getattr(space, "image_url", None) or getattr(space, "imageUrl", None)
	if url:
		return [url]
	return [DEFAULT_SPACE_IMAGE]


@router.post("/upload-image")
def upload_space_image_route(
	file: UploadFile = File(...),
	current_admin: User = Depends(get_current_admin),
):
	url = upload_space_image(file)
	return {"url": url}


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
				"status": _space_status(s),
				"is_available": bool(getattr(s, 'is_available', True)),
				"latitude": getattr(s, 'latitude', None),
				"longitude": getattr(s, 'longitude', None),
				"coordinates": {
					"latitude": getattr(s, 'latitude', None),
					"longitude": getattr(s, 'longitude', None),
				} if getattr(s, 'latitude', None) is not None and getattr(s, 'longitude', None) is not None else None,
				"images": _space_images(s),
				"image_url": getattr(s, 'image_url', None) or (_space_images(s)[0] if _space_images(s) else None),
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
			"status": _space_status(s),
			"is_available": bool(getattr(s, 'is_available', True)),
			"latitude": getattr(s, 'latitude', None),
			"longitude": getattr(s, 'longitude', None),
			"coordinates": {
				"latitude": getattr(s, 'latitude', None),
				"longitude": getattr(s, 'longitude', None),
			} if getattr(s, 'latitude', None) is not None and getattr(s, 'longitude', None) is not None else None,
			"images": _space_images(s),
			"image_url": getattr(s, 'image_url', None) or (_space_images(s)[0] if _space_images(s) else None),
			"created_at": getattr(s, 'created_at', None),
		}
	return to_resp(space)


@router.post("/", response_model=SpaceResponse, status_code=status.HTTP_201_CREATED)
def create_space(space_in: SpaceCreate, current_admin=Depends(get_current_admin), db: Session = Depends(get_db)):
	image_url = (space_in.images or [None])[0] if getattr(space_in, 'images', None) else None
	coords = getattr(space_in, 'coordinates', None)
	latitude = getattr(space_in, 'latitude', None)
	longitude = getattr(space_in, 'longitude', None)
	if coords is not None:
		latitude = coords.latitude
		longitude = coords.longitude
	space = Space(
		title=space_in.name,
		description=space_in.description or "",
		location=space_in.location,
		capacity=space_in.capacity,
		price_per_hour=space_in.price_per_hour,
		image_url=image_url or getattr(space_in, 'image_url', None),
		latitude=latitude,
		longitude=longitude,
		is_available=_is_available_from_status(space_in.status),
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
			"status": _space_status(s),
			"is_available": bool(getattr(s, 'is_available', True)),
			"latitude": getattr(s, 'latitude', None),
			"longitude": getattr(s, 'longitude', None),
			"coordinates": {
				"latitude": getattr(s, 'latitude', None),
				"longitude": getattr(s, 'longitude', None),
			} if getattr(s, 'latitude', None) is not None and getattr(s, 'longitude', None) is not None else None,
			"images": _space_images(s),
			"image_url": getattr(s, 'image_url', None) or (_space_images(s)[0] if _space_images(s) else None),
			"created_at": getattr(s, 'created_at', None),
		}
	return to_resp(space)


@router.put("/{space_id}", response_model=SpaceResponse)
def update_space(space_id: int, space_in: SpaceUpdate, current_admin=Depends(get_current_admin), db: Session = Depends(get_db)):
	space = db.query(Space).filter(Space.id == space_id).first()
	if not space:
		raise HTTPException(status_code=404, detail="Space not found")
	coords = getattr(space_in, 'coordinates', None)
	if coords is not None:
		space.latitude = coords.latitude
		space.longitude = coords.longitude
	elif getattr(space_in, 'latitude', None) is not None or getattr(space_in, 'longitude', None) is not None:
		space.latitude = getattr(space_in, 'latitude', space.latitude)
		space.longitude = getattr(space_in, 'longitude', space.longitude)
	for key, val in space_in.model_dump(exclude_unset=True, by_alias=True).items():
		if key in {"coordinates", "latitude", "longitude", "status"}:
			continue
		if hasattr(space, key):
			setattr(space, key, val)
	if space_in.status is not None:
		space.is_available = _is_available_from_status(space_in.status)
	if hasattr(space_in, 'images') and space_in.images:
		space.image_url = space_in.images[0]
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
		"status": _space_status(space),
		"is_available": bool(getattr(space, 'is_available', True)),
		"latitude": getattr(space, 'latitude', None),
		"longitude": getattr(space, 'longitude', None),
		"coordinates": {
			"latitude": getattr(space, 'latitude', None),
			"longitude": getattr(space, 'longitude', None),
		} if getattr(space, 'latitude', None) is not None and getattr(space, 'longitude', None) is not None else None,
		"images": _space_images(space),
		"image_url": getattr(space, 'image_url', None) or (_space_images(space)[0] if _space_images(space) else None),
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


@router.delete("/{space_id}")
def delete_space(space_id: int, current_admin=Depends(get_current_admin), db: Session = Depends(get_db)):
	space = db.query(Space).filter(Space.id == space_id).first()
	if not space:
		raise HTTPException(status_code=404, detail="Space not found")
	db.delete(space)
	db.commit()
	return {"status": "deleted"}
