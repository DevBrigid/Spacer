from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class STKPushRequest(BaseModel):
    booking_id: int
    amount: Decimal
    phone_number: str  # format: 2547XXXXXXXX


class STKPushCallbackSchema(BaseModel):
    MerchantRequestID: str
    CheckoutRequestID: str
    ResultCode: int
    ResultDesc: str
    CallbackMetadata: dict | None = None


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: Decimal
    phone_number: str
    status: str
    checkout_request_id: str | None = None
    merchant_request_id: str | None = None
    mpesa_receipt_number: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)