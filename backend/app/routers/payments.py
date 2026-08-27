from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_current_admin
from app.database import get_db
from app.models.payment import Payment

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("/", summary="List payments (admin only)")
def list_payments(current_admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    try:
        return db.query(Payment).all()
    except Exception:
        return []


@router.post("/", summary="Create a payment for a booking")
def create_payment(payload: dict, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        payment = Payment(**payload)
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment
    except Exception:
        raise HTTPException(status_code=500, detail="Could not record payment")
