from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.user import User
from app.models.space import Space
from app.models.booking import Booking
from app.schemas.user_schema import UserOut
from app.schemas.space import SpaceResponse, SpaceCreate
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


@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db)):
	try:
		return db.query(User).all()
	except Exception:
		return []


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.id == user_id).first()
	if not user:
		raise HTTPException(status_code=404, detail="User not found")
	db.delete(user)
	db.commit()
	return {"status": "deleted"}


@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, payload: dict, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.id == user_id).first()
	if not user:
		raise HTTPException(status_code=404, detail="User not found")
	if "is_admin" in payload:
		user.is_admin = bool(payload["is_admin"])
	if "role" in payload:
		try:
			user.role = payload["role"]
		except Exception:
			pass
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

		# Build response dict matching SpaceResponse to avoid relying on optional model attributes
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
		# Surface the error for debugging
		raise HTTPException(status_code=500, detail=str(e))
