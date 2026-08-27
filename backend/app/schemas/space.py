from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CoordinatesSchema(BaseModel):
    latitude: float
    longitude: float

class SpaceBase(BaseModel):
    name: str = Field(..., alias="title")
    description: Optional[str] = None
    location: str
    capacity: int
    price_per_hour: float = Field(..., alias="pricePerHour")
    coordinates: Optional[CoordinatesSchema] = None

class SpaceCreate(SpaceBase):
    images: Optional[List[str]] = []

class SpaceUpdate(BaseModel):
    name: Optional[str] = Field(None, alias="title")
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    price_per_hour: Optional[float] = Field(None, alias="pricePerHour")
    status: Optional[str] = None
    coordinates: Optional[CoordinatesSchema] = None

class SpaceResponse(SpaceBase):
    id: int
    owner_id: Optional[int] = Field(None, alias="ownerId")
    status: Optional[str] = "active"
    images: List[str] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        populate_by_name = True