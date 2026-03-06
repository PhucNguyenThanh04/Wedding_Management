from pydantic import BaseModel, Field, field_validator
from decimal import Decimal
from typing import Optional
from datetime import datetime


class OrderItemCreate(BaseModel):
    dish_id: int = Field(..., gt=0, description="ID món ăn")
    quantity: int = Field(..., ge=1, description="Số lượng, tối thiểu 1")
    note: Optional[str] = Field(None, max_length=1000, description="Ghi chú")

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: int) -> int:
        if v > 500:
            raise ValueError("Số lượng không được vượt quá 500")
        return v


class OrderItemUpdate(BaseModel):
    quantity: Optional[int] = Field(None, ge=1, description="Số lượng")
    note: Optional[str] = Field(None, max_length=1000, description="Ghi chú")

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v > 500:
            raise ValueError("Số lượng không được vượt quá 500")
        return v


class DishInOrderResponse(BaseModel):
    id: int
    name: str
    price: Decimal
    dish_type: str
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    dish_id: int
    quantity: int
    price_snapshot: Decimal
    is_addition: bool
    note: Optional[str] = None
    created_at: datetime
    dish: DishInOrderResponse

    model_config = {"from_attributes": True}
