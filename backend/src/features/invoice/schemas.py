from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID


class InvoiceCreate(BaseModel):
    """Xuất hóa đơn cho đơn hàng"""
    notes: Optional[str] = Field(None, description="Ghi chú hóa đơn")


class InvoiceResponse(BaseModel):
    id: int
    order_id: int
    payment_id: int
    invoice_no: str
    issued_at: datetime
    tax_amount: Decimal
    notes: Optional[str] = None
    pdf_path: Optional[str] = None
    created_at: datetime
    created_by_staff_id: Optional[UUID] = None

    model_config = {"from_attributes": True}


class InvoiceListResponse(BaseModel):
    total: int
    items: list[InvoiceResponse]
