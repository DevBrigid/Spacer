from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    space_id: int = Field(..., alias="spaceId")
    # user_id: Optional[int] = Field(None, alias="userId")
    start_time: str = Field(..., alias="startTime")
    end_time: Optional[str] = Field(None, alias="endTime")
    duration_hours: float = Field(..., alias="durationHours")
    total_amount: float = Field(..., alias="totalAmount")

class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    user_id: int = Field(..., alias="userId")
    client: Optional[str] = "Spacer Client"
    space_id: int = Field(..., alias="spaceId")
    space: str = Field("Workspace", alias="spaceName")
    date: str = Field(..., alias="startTime")
    duration: float = Field(..., alias="durationHours")
    amount: float = Field(..., alias="totalAmount")
    status: str
    payment_status: Optional[str] = Field(None, alias="paymentStatus")
    created_at: datetime
