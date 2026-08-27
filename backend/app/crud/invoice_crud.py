from sqlalchemy.orm import Session

from models.invoice import Invoice


def create_invoice(db: Session, invoice_data: dict):
    invoice = Invoice(**invoice_data)

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return invoice


def get_invoice(db: Session, invoice_id: int):
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()


def get_invoices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Invoice).offset(skip).limit(limit).all()


def update_invoice(db: Session, invoice_id: int, invoice_data: dict):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        return None

    for key, value in invoice_data.items():
        if hasattr(invoice, key):
            setattr(invoice, key, value)

    db.commit()
    db.refresh(invoice)

    return invoice


def delete_invoice(db: Session, invoice_id: int):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        return None

    db.delete(invoice)
    db.commit()

    return invoice