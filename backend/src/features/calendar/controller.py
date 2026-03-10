from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.core.enums import StaffRole, EventShift
from src.core.security import require_roles, get_current_user
from src.features.calendar import service, schemas
from src.features.staff.model import Staff

router = APIRouter(
    tags=["Calendar"]
)


@router.get("/calendar", response_model=schemas.CalendarMonthResponse)
async def get_calendar_month(
    month: int = Query(..., ge=1, le=12, description="Tháng"),
    year: int = Query(..., ge=2000, le=2100, description="Năm"),
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.admin, StaffRole.owner))
):

    return await service.get_calendar_month(db, year, month)


@router.get("/calendar/day", response_model=schemas.CalendarDayResponse)
async def get_calendar_day(
    date: date = Query(..., description="Ngày cần xem (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.admin, StaffRole.owner))
):
    """Tất cả đơn trong ngày (theo ca)"""
    return await service.get_calendar_day(db, date)


@router.get("/halls/availability", response_model=schemas.HallAvailabilityResponse)
async def get_halls_availability(
    date: date = Query(..., description="Ngày kiểm tra (YYYY-MM-DD)"),
    shift: Optional[EventShift] = Query(None, description="Ca cụ thể: MORNING, LUNCH, AFTERNOON, EVENING"),
    min_tables: Optional[int] = Query(None, ge=1, description="Số bàn tối thiểu cần"),
    db: Session = Depends(get_db),
):
    return await service.get_halls_availability(db, date, shift, min_tables)
