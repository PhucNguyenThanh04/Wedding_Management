from datetime import date
from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import extract

from src.features.order.model import Order
from src.features.customer.model import Customer
from src.features.hall.model import Hall
from src.core.enums import OrderStatus, EventShift


def _build_event(order, customer_name: str, hall_name: str) -> dict:
    return {
        "order_id": order.id,
        "customer_name": customer_name,
        "hall_name": hall_name,
        "event_date": order.event_date,
        "event_shift": order.event_shift.value if order.event_shift else "",
        "event_time": order.event_time,
        "event_type": order.event_type.value if order.event_type else "",
        "so_ban": order.so_ban,
        "status": order.status.value if order.status else "",
        "total_amount": Decimal(str(order.total_amount or 0)),
    }


async def get_calendar_month(db: Session, year: int, month: int) -> dict:
    """Tổng quan đơn theo tháng"""
    try:
        orders = (
            db.query(Order)
            .filter(
                extract("year", Order.event_date) == year,
                extract("month", Order.event_date) == month,
                Order.status != OrderStatus.cancelled,
            )
            .order_by(Order.event_date, Order.event_shift)
            .all()
        )

        events = []
        for order in orders:
            customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
            hall = db.query(Hall).filter(Hall.id == order.hall_id).first()
            events.append(_build_event(
                order,
                customer.full_name if customer else "N/A",
                hall.name if hall else "N/A"
            ))

        return {
            "year": year,
            "month": month,
            "total_events": len(events),
            "events": events
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy xuất lịch tháng: {str(e)}"
        )


async def get_calendar_day(db: Session, target_date: date) -> dict:
    """Tất cả đơn trong ngày (theo ca)"""
    try:
        orders = (
            db.query(Order)
            .filter(
                Order.event_date == target_date,
                Order.status != OrderStatus.cancelled,
            )
            .order_by(Order.event_shift)
            .all()
        )

        events = []
        for order in orders:
            customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
            hall = db.query(Hall).filter(Hall.id == order.hall_id).first()
            events.append(_build_event(
                order,
                customer.full_name if customer else "N/A",
                hall.name if hall else "N/A"
            ))

        return {
            "date": target_date,
            "total_events": len(events),
            "events": events
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy xuất lịch ngày: {str(e)}"
        )


async def get_halls_availability(
    db: Session,
    target_date: date,
    shift: EventShift = None,
    min_tables: int = None
) -> dict:
    """Kiểm tra sảnh còn trống theo ngày / ca / số bàn tối thiểu"""
    try:
        # Lấy tất cả sảnh đang hoạt động
        hall_query = db.query(Hall).filter(
            Hall.is_available == True,
            Hall.deleted_at.is_(None)
        )
        if min_tables:
            hall_query = hall_query.filter(Hall.max_tables >= min_tables)

        halls = hall_query.all()

        # Lấy tất cả đơn đã đặt trong ngày đó
        booked_orders = (
            db.query(Order)
            .filter(
                Order.event_date == target_date,
                Order.status != OrderStatus.cancelled,
            )
            .all()
        )

        # Tạo map: hall_id → set of booked shifts
        hall_booked_shifts = {}
        for order in booked_orders:
            if order.hall_id not in hall_booked_shifts:
                hall_booked_shifts[order.hall_id] = set()
            hall_booked_shifts[order.hall_id].add(order.event_shift.value)

        items = []
        all_shifts = [s.value for s in EventShift]

        for hall in halls:
            booked = hall_booked_shifts.get(hall.id, set())
            available = [s for s in all_shifts if s not in booked]

            # Nếu filter theo ca cụ thể, chỉ trả về nếu ca đó còn trống
            if shift and shift.value not in available:
                continue

            items.append({
                "hall_id": hall.id,
                "hall_name": hall.name,
                "available_shifts": available,
                "booked_shifts": list(booked),
            })

        return {
            "date": target_date,
            "items": items
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi kiểm tra sảnh trống: {str(e)}"
        )
