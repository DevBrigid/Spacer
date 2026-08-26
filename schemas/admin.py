from pydantic import BaseModel, EmailStr
from typing import Optional

class AdminUserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None

class AdminSpaceUpdate(BaseModel):
    status: Optional[str] = None
    owner_id: Optional[int] = None