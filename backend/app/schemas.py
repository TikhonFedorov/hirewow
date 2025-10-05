from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    subscription_type: Optional[str] = "free"

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str]
    subscription_type: str
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ModuleInterface(BaseModel):
    name: str
    path: str
    description: Optional[str]
    enabled: bool

class HistoryItem(BaseModel):
    id: int
    module_name: str
    query: str
    response: str
    timestamp: str
    class Config:
        orm_mode = True

class HistoryCreate(BaseModel):
    module_name: str
    query: str
    response: str