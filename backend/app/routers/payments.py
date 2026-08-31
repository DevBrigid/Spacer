from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_current_admin
from app.database import get_db
from app.models.payment import Payment
from app.models.booking import Booking
from app.schemas.payment import STKPushRequest, PaymentResponse
from app.services.mpesa.daraja_client import initiate_stk_push
from app.utils.validators import normalize_phone_number

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("/", response_model=list[PaymentResponse], summary="List payments (admin only)")
def list_payments(current_admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(Payment).all()


@router.post("/stkpush", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED,
             summary="Create a pending payment and trigger an STK push")
def stk_push(request: STKPushRequest, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    normalized_phone = normalize_phone_number(request.phone_number)

    booking = db.query(Booking).filter(Booking.id == request.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to pay for this booking")

    existing = db.query(Payment).filter(Payment.booking_id == request.booking_id).first()

    if existing and existing.status in ("PENDING", "COMPLETED"):
        raise HTTPException(status_code=409, detail="A payment already exists for this booking")

    if existing and existing.status == "FAILED":
        # Retry: reuse the same row instead of violating the unique constraint
        payment = existing
        payment.amount = request.amount
        payment.phone_number = normalized_phone
        payment.status = "PENDING"
        payment.checkout_request_id = None
        payment.merchant_request_id = None
        payment.mpesa_receipt_number = None
    else:
        payment = Payment(
            booking_id=request.booking_id,
            amount=request.amount,
            phone_number=normalized_phone,
            status="PENDING",
        )
        db.add(payment)

    db.commit()
    db.refresh(payment)

    try:
        stk_response = initiate_stk_push(
            phone_number=normalized_phone,
            amount=float(request.amount),
            account_reference=str(payment.id),
        )
        payment.checkout_request_id = stk_response.get("CheckoutRequestID")
        payment.merchant_request_id = stk_response.get("MerchantRequestID")
        db.commit()
        db.refresh(payment)
    except Exception as e:
        payment.status = "FAILED"
        db.commit()
        raise HTTPException(status_code=502, detail=f"Daraja request failed: {str(e)}")

    return payment


@router.post("/callback", summary="Daraja STK push callback (webhook)")
async def daraja_callback(payload: dict, db: Session = Depends(get_db)):
    print("=== DARAJA CALLBACK RECEIVED ===")
    print(payload)

    stk_callback = payload.get("Body", {}).get("stkCallback", {})
    checkout_request_id = stk_callback.get("CheckoutRequestID")
    result_code = stk_callback.get("ResultCode")

    if checkout_request_id is None:
        return {"ResultCode": 0, "ResultDesc": "Accepted"}

    payment = db.query(Payment).filter(Payment.checkout_request_id == checkout_request_id).first()
    if payment is None:
        return {"ResultCode": 0, "ResultDesc": "Accepted"}

    if result_code == 0:
        payment.status = "COMPLETED"
        items = stk_callback.get("CallbackMetadata", {}).get("Item", [])
        for item in items:
            if item.get("Name") == "MpesaReceiptNumber":
                payment.mpesa_receipt_number = item.get("Value")

        booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
        if booking:
            booking.status = "confirmed"
    else:
        payment.status = "FAILED"

    db.commit()
    return {"ResultCode": 0, "ResultDesc": "Accepted"}