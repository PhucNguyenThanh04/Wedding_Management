from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from src.core.enums import PaymentMethod


class TransactionCreate(BaseModel):
    """Ghi nhận 1 lần thanh toán / đặt cọc"""
    amount: Decimal = Field(..., gt=0, decimal_places=2, description="Số tiền thanh toán")
    payment_method: PaymentMethod = Field(..., description="Phương thức thanh toán")
    transaction_ref: Optional[str] = Field(None, max_length=100, description="Mã giao dịch")
    bank_name: Optional[str] = Field(None, max_length=100, description="Tên ngân hàng")
    note: Optional[str] = Field(None, description="Ghi chú")


class TransactionResponse(BaseModel):
    id: int
    payment_id: int
    amount: Decimal
    payment_method: PaymentMethod
    transaction_ref: Optional[str] = None
    bank_name: Optional[str] = None
    paid_at: datetime
    received_by_staff_id: Optional[UUID] = None
    note: Optional[str] = None

    model_config = {"from_attributes": True}


class TransactionListResponse(BaseModel):
    total: int
    items: list[TransactionResponse]
