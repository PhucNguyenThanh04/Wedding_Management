from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import date, time, datetime
from decimal import Decimal
from typing import Optional, List
from uuid import UUID

from src.core.enums import EventShift, EventType, OrderStatus


class OrderCreate(BaseModel):
    # FK
    customer_id: int = Field(..., gt=0, description="ID khách hàng")
    hall_id: int = Field(..., gt=0, description="ID sảnh tiệc")
    # created_by_staff_id: UUID = Field(..., description="ID nhân viên tạo đơn hàng")

    # Event Info
    event_date: date = Field(..., description="Ngày tổ chức sự kiện (YYYY-MM-DD)")
    event_shift: EventShift = Field(..., description="Ca tổ chức: MORNING, LUNCH, AFTERNOON, EVENING")
    event_time: time = Field(..., description="Giờ bắt đầu sự kiện (HH:MM)")
    event_type: EventType = Field(..., description="Loại sự kiện: wedding, birthday, corporate, ...")
    so_ban: int = Field(..., ge=1, description="Số bàn tiệc, tối thiểu 1")

    # Optional
    notes: Optional[str] = Field(None, max_length=1000, description="Ghi chú cho đơn hàng")

    @field_validator("event_date")
    @classmethod
    def event_date_must_be_future(cls, v: date) -> date:
        if v <= date.today():
            raise ValueError("Ngày tổ chức phải sau ngày hôm nay")
        return v

    @field_validator("event_time")
    @classmethod
    def event_time_format(cls, v: time) -> time:
        if v.hour < 6 or v.hour > 22:
            raise ValueError("Giờ tổ chức phải trong khoảng 06:00 - 22:00")
        return v

    @field_validator("so_ban")
    @classmethod
    def validate_so_ban(cls, v: int) -> int:
        if v > 500:
            raise ValueError("Số bàn không được vượt quá 500")
        return v


class OrderUpdate(BaseModel):
    hall_id: Optional[int] = Field(None, gt=0, description="ID sảnh tiệc")
    event_date: Optional[date] = Field(None, description="Ngày tổ chức sự kiện")
    event_shift: Optional[EventShift] = Field(None, description="Ca tổ chức")
    event_time: Optional[time] = Field(None, description="Giờ bắt đầu sự kiện")
    event_type: Optional[EventType] = Field(None, description="Loại sự kiện")
    so_ban: Optional[int] = Field(None, ge=1, description="Số bàn tiệc")
    notes: Optional[str] = Field(None, max_length=1000, description="Ghi chú")

    # Pricing (chỉ staff/owner được sửa)
    service_fee: Optional[Decimal] = Field(None, ge=0, decimal_places=2, description="Phí dịch vụ")
    discount_amount: Optional[Decimal] = Field(None, ge=0, decimal_places=2, description="Giảm giá")

    @field_validator("event_date")
    @classmethod
    def event_date_must_be_future(cls, v: Optional[date]) -> Optional[date]:
        if v is not None and v <= date.today():
            raise ValueError("Ngày tổ chức phải sau ngày hôm nay")
        return v

    @field_validator("event_time")
    @classmethod
    def event_time_format(cls, v: Optional[time]) -> Optional[time]:
        if v is not None and (v.hour < 6 or v.hour > 22):
            raise ValueError("Giờ tổ chức phải trong khoảng 06:00 - 22:00")
        return v

    @field_validator("so_ban")
    @classmethod
    def validate_so_ban(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v > 500:
            raise ValueError("Số bàn không được vượt quá 500")
        return v


class OrderStatusUpdate(BaseModel):
    status: OrderStatus = Field(..., description="Trạng thái mới của đơn hàng")
    cancellation_reason: Optional[str] = Field(None, max_length=1000, description="Lý do huỷ (bắt buộc khi huỷ)")

    @model_validator(mode="after")
    def validate_cancellation_reason(self):
        if self.status == OrderStatus.cancelled and not self.cancellation_reason:
            raise ValueError("Phải nhập lý do khi huỷ đơn hàng")
        if self.status != OrderStatus.cancelled and self.cancellation_reason:
            raise ValueError("Lý do huỷ chỉ áp dụng khi trạng thái là 'cancelled'")
        return self


class OrderAssignStaff(BaseModel):
    assigned_staff_id: UUID = Field(..., description="ID nhân viên được phân công")


class MenuInOrderResponse(BaseModel):
    id: int
    name: str
    price: Decimal
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


class OrderMenuInOrderResponse(BaseModel):
    id: int
    menu_id: int
    quantity: int
    price_snapshot: Decimal
    notes: Optional[str] = None
    menu: MenuInOrderResponse

    model_config = {"from_attributes": True}


class DishInOrderResponse(BaseModel):
    id: int
    name: str
    price: Decimal
    dish_type: str
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


class OrderItemInOrderResponse(BaseModel):
    id: int
    dish_id: int
    quantity: int
    price_snapshot: Decimal
    is_addition: bool
    note: Optional[str] = None
    dish: DishInOrderResponse

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    hall_id: int
    created_by_staff_id: UUID
    assigned_staff_id: Optional[UUID]

    # Event Info
    event_date: date
    event_shift: EventShift
    event_time: time
    event_type: EventType
    so_ban: int

    # Pricing
    menu_total: Decimal
    extra_dishes_total: Decimal
    table_total: Decimal
    service_fee: Optional[Decimal]
    discount_amount: Optional[Decimal]
    subtotal: Decimal
    tax_rate: Decimal
    tax_amount: Decimal
    total_amount: Decimal

    # Status & Notes
    status: OrderStatus
    notes: Optional[str]
    cancellation_reason: Optional[str]

    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime]
    confirmed_at: Optional[datetime]
    completed_at: Optional[datetime]

    # Audit
    last_modified_by_staff_id: Optional[UUID]
    last_modified_at: Optional[datetime]

    # Menus đã chọn (combo)
    order_menus: List[OrderMenuInOrderResponse] = []

    # Món ăn riêng lẻ (tự chọn / kêu thêm)
    order_items: List[OrderItemInOrderResponse] = []

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    id: int
    customer_id: int
    hall_id: int
    event_date: date
    event_shift: EventShift
    event_time: time
    event_type: EventType
    so_ban: int
    total_amount: Decimal
    status: OrderStatus
    created_at: datetime

    model_config = {"from_attributes": True}