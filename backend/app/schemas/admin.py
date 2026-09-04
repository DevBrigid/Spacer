from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional

class AdminUserUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, alias="phoneNumber")
    role: Optional[str] = None

class AdminSpaceUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    status: Optional[str] = None
    owner_id: Optional[int] = Field(None, alias="ownerId")
