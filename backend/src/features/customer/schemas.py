from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class CustomerBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=200, description="Họ và tên khách hàng")
    phone: str = Field(..., min_length=8, max_length=20, description="Số điện thoại")
    email: Optional[EmailStr] = Field(None, description="Email khách hàng")
    address: Optional[str] = Field(None, max_length=500, description="Địa chỉ")
    note: Optional[str] = Field(None, description="Ghi chú")

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        phone_pattern = re.compile(r"^(\+84|0)[3|5|7|8|9][0-9]{8}$")
        if not phone_pattern.match(v):
            raise ValueError("Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Họ và tên không được để trống")
        return v.strip()


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=200)
    phone: Optional[str] = Field(None, min_length=8, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(None, max_length=500)
    note: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        phone_pattern = re.compile(r"^(\+84|0)[3|5|7|8|9][0-9]{8}$")
        if not phone_pattern.match(v):
            raise ValueError("Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        if not v.strip():
            raise ValueError("Họ và tên không được để trống")
        return v.strip()


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

