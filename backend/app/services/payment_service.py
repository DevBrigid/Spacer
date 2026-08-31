from sqlalchemy.orm import Session

from app.crud import payment_crud
from app.models.payment import Payment


def create_payment(db: Session, payment_data: dict) -> Payment:
	return payment_crud.create_payment(db, payment_data)


def get_payment(db: Session, payment_id: int) -> Payment | None:
	return payment_crud.get_payment(db, payment_id)


def list_payments(db: Session, skip: int = 0, limit: int = 100):
	return payment_crud.get_payments(db, skip=skip, limit=limit)

