from sqlalchemy.orm import Session

from models.booking import Booking


def create_booking(db: Session, booking_data: dict):
    booking = Booking(**booking_data)

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


def get_booking(db: Session, booking_id: int):
    return db.query(Booking).filter(Booking.id == booking_id).first()


def get_bookings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Booking).offset(skip).limit(limit).all()


def update_booking(db: Session, booking_id: int, booking_data: dict):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        return None

    for key, value in booking_data.items():
        if hasattr(booking, key):
            setattr(booking, key, value)

    db.commit()
    db.refresh(booking)

    return booking


def delete_booking(db: Session, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        return None

    db.delete(booking)
    db.commit()

    return booking