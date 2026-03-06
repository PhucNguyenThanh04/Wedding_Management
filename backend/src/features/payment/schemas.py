from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from src.core.enums import PaymentStatus


class PaymentCreate(BaseModel):

    order_id: int = Field(..., gt=0)
    notes: Optional[str] = None


class TransactionInPaymentResponse(BaseModel):
    id: int
    amount: Decimal
    payment_method: str
    transaction_ref: Optional[str] = None
    bank_name: Optional[str] = None
    paid_at: datetime
    note: Optional[str] = None

    model_config = {"from_attributes": True}


class PaymentResponse(BaseModel):
    id: int
    order_id: int
    order_total: Decimal
    paid_amount: Decimal
    remaining_amount: Decimal
    status: PaymentStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    transactions: List[TransactionInPaymentResponse] = []

    model_config = {"from_attributes": True}


class PaymentSummaryResponse(BaseModel):

    id: int
    order_id: int
    order_total: Decimal
    paid_amount: Decimal
    remaining_amount: Decimal
    status: PaymentStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
