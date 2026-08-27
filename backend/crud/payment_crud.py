from sqlalchemy.orm import Session

from models.payment import Payment


def create_payment(db: Session, payment_data: dict):
    payment = Payment(**payment_data)

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


def get_payment(db: Session, payment_id: int):
    return db.query(Payment).filter(Payment.id == payment_id).first()


def get_payments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Payment).offset(skip).limit(limit).all()


def update_payment(db: Session, payment_id: int, payment_data: dict):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        return None

    for key, value in payment_data.items():
        if hasattr(payment, key):
            setattr(payment, key, value)

    db.commit()
    db.refresh(payment)

    return payment


def delete_payment(db: Session, payment_id: int):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        return None

    db.delete(payment)
    db.commit()

    return payment