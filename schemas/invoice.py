from pydantic import BaseModel
from datetime import datetime

class InvoiceResponse(BaseModel):
    id: int
    booking_id: int
    client_name: str
    space_title: str
    amount_paid: float
    transaction_ref: str
    generated_at: datetime
    download_url: str

    class Config:
        from_attributes = True