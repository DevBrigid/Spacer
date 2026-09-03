from datetime import datetime, timedelta, timezone

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
PENDING_PAYMENT_RETRY_AFTER = timedelta(minutes=3)


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

    if existing and existing.status == "COMPLETED":
        raise HTTPException(status_code=409, detail="This booking has already been paid for")

    if existing and existing.status == "PENDING":
        created_at = existing.created_at
        if created_at and created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
        if created_at and datetime.now(timezone.utc) - created_at < PENDING_PAYMENT_RETRY_AFTER:
            raise HTTPException(
                status_code=409,
                detail="Your M-Pesa prompt is still pending. Complete it on your phone, or try again in a few minutes.",
            )

    if existing and existing.status in ("FAILED", "PENDING"):
        # Retry an expired/failed prompt using the same unique payment record.
        payment = existing
        payment.amount = request.amount
        payment.phone_number = normalized_phone
        payment.status = "PENDING"
        payment.checkout_request_id = None
        payment.merchant_request_id = None
        payment.mpesa_receipt_number = None
        payment.created_at = datetime.now(timezone.utc)
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


@router.get("/booking/{booking_id}", response_model=PaymentResponse, summary="Get a booking payment")
def get_booking_payment(booking_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this payment")
    payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


@router.post("/callback", summary="Daraja STK push callback (webhook)")
async def daraja_callback(payload: dict, db: Session = Depends(get_db)):
    print("=== DARAJA CALLBACK RECEIVED ===")
    print(payload)

    stk_callback = payload.get("Body", {}).get("stkCallback", {})
    checkout_request_id = stk_callback.get("CheckoutRequestID")
    result_code_raw = stk_callback.get("ResultCode")
    result_code = int(str(result_code_raw).strip()) if str(result_code_raw).strip() else None

    if checkout_request_id is None:
        checkout_request_id = payload.get("CheckoutRequestID") or payload.get("checkoutRequestId")

    if checkout_request_id is None:
        return {"ResultCode": 0, "ResultDesc": "Accepted"}

    payment = db.query(Payment).filter(Payment.checkout_request_id == checkout_request_id).first()
    if payment is None:
        merchant_request_id = stk_callback.get("MerchantRequestID") or payload.get("MerchantRequestID")
        if merchant_request_id:
            payment = db.query(Payment).filter(Payment.merchant_request_id == merchant_request_id).first()
        if payment is None:
            return {"ResultCode": 0, "ResultDesc": "Accepted"}

    if result_code == 0:
        payment.status = "COMPLETED"

        callback_metadata = stk_callback.get("CallbackMetadata") or {}
        items = callback_metadata.get("Item", []) if isinstance(callback_metadata, dict) else callback_metadata
        if not isinstance(items, list):
            items = [items]

        for item in items:
            if isinstance(item, dict) and item.get("Name") == "MpesaReceiptNumber":
                payment.mpesa_receipt_number = item.get("Value")
                break

        booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
        if booking:
            booking.status = "confirmed"
    else:
        payment.status = "FAILED"

    db.commit()
    return {"ResultCode": 0, "ResultDesc": "Accepted"}


@router.post("/debug/callback", include_in_schema=False, summary="Debug Daraja callback payloads")
async def debug_daraja_callback(payload: dict, db: Session = Depends(get_db)):
    result = await daraja_callback(payload, db)

    checkout_request_id = payload.get("Body", {}).get("stkCallback", {}).get("CheckoutRequestID")
    if checkout_request_id is None:
        checkout_request_id = payload.get("CheckoutRequestID") or payload.get("checkoutRequestId")

    payment = None
    if checkout_request_id:
        payment = db.query(Payment).filter(Payment.checkout_request_id == checkout_request_id).first()

    booking = payment.booking if payment else None
    return {
        "result": result,
        "checkout_request_id": checkout_request_id,
        "payment_status": payment.status if payment else None,
        "booking_status": booking.status if booking else None,
        "booking_id": payment.booking_id if payment else None,
    }
