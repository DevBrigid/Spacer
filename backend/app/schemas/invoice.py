from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

class InvoiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    booking_id: int = Field(..., alias="bookingId")
    receipt_number: str = Field(..., alias="receiptNumber")
    client_name: str = Field(..., alias="clientName")
    space_name: str = Field(..., alias="spaceName")
    amount_paid: float = Field(..., alias="amountPaid")
    phone_number: str = Field(..., alias="phoneNumber")
    paid_at: datetime = Field(..., alias="paidAt")
