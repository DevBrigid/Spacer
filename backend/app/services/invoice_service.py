from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.invoice import Invoice
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.space import Space
from app.models.user import User
from app.utils.pdf_generator import generate_invoice_pdf_bytes


def get_or_create_invoice(db: Session, booking_id: int) -> Invoice:
    invoice = db.query(Invoice).filter(Invoice.booking_id == booking_id).first()
    if invoice:
        return invoice

    invoice_number = f"INV-{booking_id}-{int(datetime.now(timezone.utc).timestamp())}"
    invoice = Invoice(booking_id=booking_id, invoice_number=invoice_number)
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice


def build_invoice_data(db: Session, booking_id: int) -> dict:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise ValueError("Booking not found")

    payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
    space = db.query(Space).filter(Space.id == booking.space_id).first()
    client = db.query(User).filter(User.id == booking.user_id).first()
    invoice = db.query(Invoice).filter(Invoice.booking_id == booking_id).first()

    if not (payment and space and client and invoice):
        raise ValueError("Missing related data for invoice generation")

    return {
        "invoice_number": invoice.invoice_number,
        "client_name": client.full_name,
        "space_name": space.title,
        "amount_paid": float(payment.amount),
        "phone_number": payment.phone_number,
        "receipt_number": payment.mpesa_receipt_number or "N/A",
        "paid_at": payment.created_at.strftime("%Y-%m-%d %H:%M"),
    }


def generate_invoice_pdf(db: Session, booking_id: int) -> bytes:
    """Single source of truth for invoice PDF generation — used by both
    the post-payment email flow and the on-demand download route."""
    get_or_create_invoice(db, booking_id)
    invoice_data = build_invoice_data(db, booking_id)
    return generate_invoice_pdf_bytes(invoice_data)