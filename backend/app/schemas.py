from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import Optional, List, Literal
import re

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username (3-50 characters)")
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    full_name: Optional[str] = None
    subscription_type: Optional[str] = "free"
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

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
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

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
        from_attributes = True

class HistoryCreate(BaseModel):
    module_name: str
    query: str
    response: str

class SalaryRequest(BaseModel):
    salary: float
    monthly_bonus: Optional[float] = None
    rk_rate: float
    sn_percentage: float
    kpi_enabled: bool
    kpi_percentage: Optional[float] = None
    kpi_period: Optional[Literal["quarter", "halfyear"]] = None

class MonthResult(BaseModel):
    month: str
    income: str
    kpi_bonus: str
    kpi_note: str
    tax: str
    net_income: str
    tax_info: str  # Progressive tax rate breakdown
    rate_details: str  # RK and SN info
    cumulative_income: str

class SalarySummary(BaseModel):
    annual_income: str
    annual_tax: str
    annual_net_income: str

class SalaryResponse(BaseModel):
    months: List[MonthResult]
    summary: SalarySummary