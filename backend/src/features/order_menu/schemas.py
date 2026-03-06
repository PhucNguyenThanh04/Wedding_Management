from pydantic import BaseModel, Field, field_validator
from decimal import Decimal
from typing import Optional
from datetime import datetime


class OrderMenuCreate(BaseModel):
    menu_id: int = Field(..., gt=0, description="ID menu")
    quantity: int = Field(..., ge=1, description="Số lượng, tối thiểu 1")
    # price_snapshot: Decimal = Field(..., ge=0, max_digits=12, decimal_places=2, description="Giá tại thời điểm đặt")
    notes: Optional[str] = Field(None, max_length=1000, description="Ghi chú")

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: int) -> int:
        if v > 500:
            raise ValueError("Số lượng không được vượt quá 500")
        return v


class OrderMenuUpdate(BaseModel):
    quantity: Optional[int] = Field(None, ge=1, description="Số lượng")
    notes: Optional[str] = Field(None, max_length=1000, description="Ghi chú")

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v > 500:
            raise ValueError("Số lượng không được vượt quá 100")
        return v


class OrderMenuResponse(BaseModel):
    id: int
    order_id: int
    menu_id: int
    quantity: int
    price_snapshot: Decimal
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderMenuListResponse(BaseModel):
    id: int
    order_id: int
    menu_id: int
    quantity: int
    price_snapshot: Decimal
    created_at: datetime

    model_config = {"from_attributes": True}
