from pydantic import BaseModel, Field
from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from uuid import UUID


# ── Request ──────────────────────────────────────────────
class InvoiceCreate(BaseModel):
    notes: Optional[str] = Field(None, max_length=1000, description="Ghi chú hóa đơn")


# ── Nested helpers (chỉ trả kèm, không tạo riêng) ──────
class InvoiceCustomerInfo(BaseModel):
    """Thông tin khách hàng rút gọn trên hóa đơn"""
    id: int
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None

    model_config = {"from_attributes": True}


class InvoiceOrderInfo(BaseModel):

    id: int
    event_date: date
    event_shift: str
    event_type: str
    so_ban: int
    hall_name: Optional[str] = None
    menu_total: Decimal = Decimal("0")
    extra_dishes_total: Decimal = Decimal("0")
    table_total: Decimal = Decimal("0")
    service_fee: Decimal = Decimal("0")
    discount_amount: Decimal = Decimal("0")
    subtotal: Decimal = Decimal("0")
    tax_rate: Decimal = Decimal("10.00")
    tax_amount: Decimal = Decimal("0")
    total_amount: Decimal = Decimal("0")
    status: str

    model_config = {"from_attributes": True}


class InvoicePaymentInfo(BaseModel):
    """Thông tin thanh toán rút gọn trên hóa đơn"""
    id: int
    order_total: Decimal
    paid_amount: Decimal
    remaining_amount: Decimal
    status: str

    model_config = {"from_attributes": True}


# ── Response ─────────────────────────────────────────────
class InvoiceResponse(BaseModel):
    """Schema cơ bản — dùng cho danh sách"""
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


class InvoiceDetailResponse(InvoiceResponse):
    """Schema chi tiết — kèm thông tin khách hàng, đơn hàng, thanh toán"""
    customer: Optional[InvoiceCustomerInfo] = None
    order: Optional[InvoiceOrderInfo] = None
    payment: Optional[InvoicePaymentInfo] = None


class InvoiceListResponse(BaseModel):
    total: int
    page: int = 1
    page_size: int = 20
    items: list[InvoiceResponse]
