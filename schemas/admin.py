from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class AdminUserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None

class AdminSpaceUpdate(BaseModel):
    status: Optional[str] = None
    owner_id: Optional[int] = Field(None, alias="ownerId")

    class Config:
        populate_by_name = True