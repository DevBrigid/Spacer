from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., alias="full_name")
    phone_number: Optional[str] = Field(None, alias="phoneNumber")

    class Config:
        populate_by_name = True


class UserCreate(UserBase):
    password: str
   
class AdminUserCreate(UserBase):
    """Admin-only user creation — role is explicitly chosen."""
    password: str
    role: str  # 'client' or 'admin'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, alias="full_name")
    phone_number: Optional[str] = Field(None, alias="phoneNumber")

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., alias="currentPassword")
    new_password: str = Field(..., alias="newPassword")

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"