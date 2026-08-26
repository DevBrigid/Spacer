from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CoordinatesSchema(BaseModel):
    latitude: float
    longitude: float

class SpaceBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    capacity: int
    price_per_hour: float
    coordinates: Optional[CoordinatesSchema] = None

class SpaceCreate(SpaceBase):
    images: Optional[List[str]] = []

class SpaceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    price_per_hour: Optional[float] = None
    status: Optional[str] = None
    coordinates: Optional[CoordinatesSchema] = None

class SpaceResponse(SpaceBase):
    id: int
    owner_id: int
    status: str
    images: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True