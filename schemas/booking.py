from pydantic import BaseModel
from datetime import datetime

class BookingCreate(BaseModel):
    space_id: int
    start_time: datetime
    end_time: datetime
    agreed_to_terms: bool

class BookingResponse(BaseModel):
    id: int
    client_id: int
    space_id: int
    start_time: datetime
    end_time: datetime
    duration_hours: float
    subtotal: float
    total_due: float
    status: str
    agreed_to_terms: bool
    created_at: datetime

    class Config:
        from_attributes = True