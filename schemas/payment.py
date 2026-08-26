from pydantic import BaseModel
from typing import Any, Dict
from datetime import datetime

class STKPushRequest(BaseModel):
    booking_id: int
    phone_number: str  # Format: 2547XXXXXXXX
    amount: float

class STKPushCallbackSchema(BaseModel):
    Body: Dict[str, Any]

class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: float
    payment_status: str
    transaction_ref: str
    created_at: datetime

    class Config:
        from_attributes = True