from pydantic import BaseModel, Field
from typing import Any, Dict, Optional
from datetime import datetime

class STKPushRequest(BaseModel):
    booking_id: int = Field(..., alias="bookingId")
    phone_number: str = Field(..., alias="phoneNumber")
    amount: float

class STKPushCallbackSchema(BaseModel):
    Body: Dict[str, Any]

class PaymentResponse(BaseModel):
    id: int
    booking_id: int = Field(..., alias="bookingId")
    amount: float
    status: str = Field("success", alias="payment_status")
    receipt_number: Optional[str] = Field(None, alias="receiptNumber")
    phone_number: Optional[str] = Field(None, alias="phoneNumber")
    paid_at: Optional[datetime] = Field(default_factory=datetime.utcnow, alias="paidAt")

    class Config:
        from_attributes = True
        populate_by_name = True