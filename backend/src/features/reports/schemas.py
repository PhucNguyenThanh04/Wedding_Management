from pydantic import BaseModel
from decimal import Decimal


class RevenueItem(BaseModel):
    period: str  # "2026-01", "2026-Q1", "2026"
    total_revenue: Decimal
    total_orders: int


class RevenueResponse(BaseModel):
    period_type: str  # "month", "quarter", "year"
    year: int
    items: list[RevenueItem]
    grand_total: Decimal


class OrdersSummary(BaseModel):
    total_orders: int
    booking_pending: int
    confirmed: int
    in_progress: int
    completed: int
    cancelled: int
    invoiced: int


class EventTypeRevenue(BaseModel):
    event_type: str
    total_orders: int
    total_revenue: Decimal


class EventTypeRevenueResponse(BaseModel):
    items: list[EventTypeRevenue]


class HallUtilization(BaseModel):
    hall_id: int
    hall_name: str
    total_bookings: int
    utilization_rate: Decimal  # phần trăm


class HallUtilizationResponse(BaseModel):
    items: list[HallUtilization]


class TopMenuItem(BaseModel):
    menu_id: int
    menu_name: str
    total_ordered: int
    total_revenue: Decimal


class TopMenuResponse(BaseModel):
    items: list[TopMenuItem]


class StaffPerformance(BaseModel):
    staff_id: str
    staff_name: str
    total_orders_created: int
    total_revenue: Decimal


class StaffPerformanceResponse(BaseModel):
    items: list[StaffPerformance]
