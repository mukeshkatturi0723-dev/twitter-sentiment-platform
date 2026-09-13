from typing import Optional, Literal
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: str
    role: Optional[Literal["admin", "analyst", "viewer"]] = "analyst"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: Optional[str]

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse
