from datetime import datetime, timedelta
from typing import Any
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud import booking_crud
from app.models.booking import Booking


def _parse_iso_to_dt(value: Any) -> datetime:
	if isinstance(value, datetime):
		return value
	if isinstance(value, str):
		s = value.replace("Z", "+00:00")
		return datetime.fromisoformat(s)
	raise HTTPException(status_code=400, detail="Unsupported start_time format")


def create_booking(db: Session, booking_data: dict) -> Booking:
	data = booking_data.copy()
	if "start_time" not in data:
		raise HTTPException(status_code=400, detail="start_time is required")

	# compute end_time if missing using durationHours
	start_dt = _parse_iso_to_dt(data["start_time"])
	if "end_time" not in data:
		try:
			duration = float(data.get("durationHours", data.get("duration", 1)))
		except (TypeError, ValueError):
			raise HTTPException(status_code=400, detail="Invalid duration value")
		if duration <= 0:
			raise HTTPException(status_code=400, detail="duration must be > 0")
		end_dt = start_dt + timedelta(hours=duration)
	else:
		end_dt = _parse_iso_to_dt(data["end_time"])

	if end_dt <= start_dt:
		raise HTTPException(status_code=400, detail="end_time must be after start_time")

	space_id = data.get("space_id")
	if space_id is not None:
		overlap = (
			db.query(Booking)
			.filter(
				Booking.space_id == space_id,
				Booking.status.in_(["pending", "confirmed"]),
				Booking.start_time < end_dt,
				Booking.end_time > start_dt,
			)
			.first()
		)
		if overlap:
			raise HTTPException(status_code=409, detail="This time is already booked for this space. Please choose another time.")

	# Use datetime objects so SQLAlchemy receives proper types
	data["start_time"] = start_dt
	data["end_time"] = end_dt

	# Remove transient client fields not present on the Booking model
	data.pop("durationHours", None)
	data.pop("duration", None)

	return booking_crud.create_booking(db, data)


def get_booking(db: Session, booking_id: int) -> Booking | None:
	return booking_crud.get_booking(db, booking_id)


def list_bookings(db: Session, skip: int = 0, limit: int = 100):
	return booking_crud.get_bookings(db, skip=skip, limit=limit)

