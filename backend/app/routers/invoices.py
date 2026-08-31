from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.booking import Booking
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.schemas.invoice import InvoiceResponse
from app.services.invoice_service import build_invoice_data, generate_invoice_pdf

router = APIRouter(tags=["invoices"])


@router.get("/bookings/{booking_id}/invoice", summary="Download invoice PDF for a booking")
def download_invoice(booking_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this invoice")

    payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
    if not payment or payment.status != "COMPLETED":
        raise HTTPException(status_code=400, detail="Invoice not available — payment not completed")

    try:
        pdf_bytes = generate_invoice_pdf(db, booking_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=invoice-{booking_id}.pdf"},
    )


@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse, summary="Get invoice details (admin)")
def get_invoice(invoice_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    booking = db.query(Booking).filter(Booking.id == invoice.booking_id).first()
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this invoice")

    data = build_invoice_data(db, invoice.booking_id)
    return {
        "id": invoice.id,
        "booking_id": invoice.booking_id,
        "receipt_number": data["receipt_number"],
        "client_name": data["client_name"],
        "space_name": data["space_name"],
        "amount_paid": data["amount_paid"],
        "phone_number": data["phone_number"],
        "paid_at": data["paid_at"],
    }