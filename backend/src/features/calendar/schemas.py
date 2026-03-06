from pydantic import BaseModel
from datetime import date, time
from decimal import Decimal


class CalendarEvent(BaseModel):
    order_id: int
    customer_name: str
    hall_name: str
    event_date: date
    event_shift: str
    event_time: time
    event_type: str
    so_ban: int
    status: str
    total_amount: Decimal

    model_config = {"from_attributes": True}


class CalendarMonthResponse(BaseModel):
    year: int
    month: int
    total_events: int
    events: list[CalendarEvent]


class CalendarDayResponse(BaseModel):
    date: date
    total_events: int
    events: list[CalendarEvent]


class HallAvailabilitySlot(BaseModel):
    hall_id: int
    hall_name: str
    available_shifts: list[str]
    booked_shifts: list[str]


class HallAvailabilityResponse(BaseModel):
    date: date
    items: list[HallAvailabilitySlot]
