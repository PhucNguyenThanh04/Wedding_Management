from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.core.enums import StaffRole
from src.core.security import require_roles
from src.features.reports import service, schemas
from src.features.staff.model import Staff
from typing import Optional

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/revenue", response_model=schemas.RevenueResponse)
async def get_revenue_report(
    period: str = Query("month", regex="^(month|quarter|year)$",
                        description="Loại kỳ: month, quarter, year"),
    year: int = Query(2026, ge=2000, le=2100, description="Năm"),
    month: Optional[int] = Query(None, ge=1, le=12, description="Tháng (chỉ khi period=month)"),
    quarter: Optional[int] = Query(None, ge=1, le=4, description="Quý (chỉ khi period=quarter)"),
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.owner))
):
    """Báo cáo doanh thu theo tháng/quý/năm"""
    return await service.get_revenue(db, period, year, month, quarter)


@router.get("/orders/summary", response_model=schemas.OrdersSummary)
async def get_orders_summary(
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.owner))
):
    """Tổng đơn theo trạng thái"""
    return await service.get_orders_summary(db)


@router.get("/orders/by-event-type", response_model=schemas.EventTypeRevenueResponse)
async def get_revenue_by_event_type(
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.owner))
):
    """Doanh thu theo loại tiệc"""
    items = await service.get_revenue_by_event_type(db)
    return {"items": items}


@router.get("/halls/utilization", response_model=schemas.HallUtilizationResponse)
async def get_halls_utilization(
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.owner))
):
    """Tỷ lệ sử dụng sảnh"""
    items = await service.get_halls_utilization(db)
    return {"items": items}


@router.get("/top-menus", response_model=schemas.TopMenuResponse)
async def get_top_menus(
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.owner))
):
    """Menu/món được đặt nhiều nhất"""
    items = await service.get_top_menus(db)
    return {"items": items}


@router.get("/staff/performance", response_model=schemas.StaffPerformanceResponse)
async def get_staff_performance(
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.owner))
):
    """Đơn tạo / doanh thu theo nhân viên"""
    items = await service.get_staff_performance(db)
    return {"items": items}
