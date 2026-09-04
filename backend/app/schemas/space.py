from pydantic import AliasChoices, BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime


class CoordinatesSchema(BaseModel):
    latitude: float
    longitude: float


class SpaceBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    name: str = Field(
        default="",
        validation_alias=AliasChoices("title", "name"),
        serialization_alias="title",
    )
    description: Optional[str] = None
    location: str
    capacity: int
    price_per_hour: float = Field(
        ...,
        validation_alias=AliasChoices("price_per_hour", "pricePerHour"),
        serialization_alias="pricePerHour",
    )
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    coordinates: Optional[CoordinatesSchema] = None
    image_url: Optional[str] = None


class SpaceCreate(SpaceBase):
    images: Optional[List[str]] = []
    status: Optional[str] = "available"


class SpaceUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    name: Optional[str] = Field(
        None,
        validation_alias=AliasChoices("title", "name"),
        serialization_alias="title",
    )
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    price_per_hour: Optional[float] = Field(
        None,
        validation_alias=AliasChoices("price_per_hour", "pricePerHour"),
        serialization_alias="pricePerHour",
    )
    status: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    coordinates: Optional[CoordinatesSchema] = None
    # The image is stored as a URL after the admin upload completes.  Accept it
    # on edits as well as on creates so a replacement is persisted.
    images: Optional[List[str]] = None
    image_url: Optional[str] = None


class SpaceResponse(SpaceBase):
    id: int
    owner_id: Optional[int] = Field(None, alias="ownerId")
    status: Optional[str] = "active"
    images: List[str] = Field(default_factory=list)
    created_at: Optional[datetime] = None
