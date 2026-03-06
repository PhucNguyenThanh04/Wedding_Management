from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from src.features.order.model import Order
from src.features.order_menu.model import OrderMenu
from src.features.menus.model import Menu
from src.features.hall.model import Hall
from src.features.staff.model import Staff
from src.core.enums import OrderStatus, EventShift


async def get_revenue(
    db: Session,
    period: str,
    year: int,
    month: int = None,
    quarter: int = None
) -> dict:
    """Báo cáo doanh thu theo tháng/quý/năm"""
    try:
        base_query = db.query(Order).filter(
            Order.status.notin_([OrderStatus.cancelled, OrderStatus.booking_pending]),
            extract("year", Order.event_date) == year
        )

        items = []
        grand_total = Decimal("0")

        if period == "month":
            if month:
                # Doanh thu 1 tháng cụ thể
                orders = base_query.filter(
                    extract("month", Order.event_date) == month
                ).all()
                total = sum(Decimal(str(o.total_amount or 0)) for o in orders)
                grand_total = total
                items.append({
                    "period": f"{year}-{month:02d}",
                    "total_revenue": total,
                    "total_orders": len(orders)
                })
            else:
                # Doanh thu tất cả 12 tháng
                for m in range(1, 13):
                    orders = base_query.filter(
                        extract("month", Order.event_date) == m
                    ).all()
                    total = sum(Decimal(str(o.total_amount or 0)) for o in orders)
                    grand_total += total
                    items.append({
                        "period": f"{year}-{m:02d}",
                        "total_revenue": total,
                        "total_orders": len(orders)
                    })

        elif period == "quarter":
            if quarter:
                start_month = (quarter - 1) * 3 + 1
                end_month = start_month + 2
                orders = base_query.filter(
                    extract("month", Order.event_date) >= start_month,
                    extract("month", Order.event_date) <= end_month
                ).all()
                total = sum(Decimal(str(o.total_amount or 0)) for o in orders)
                grand_total = total
                items.append({
                    "period": f"{year}-Q{quarter}",
                    "total_revenue": total,
                    "total_orders": len(orders)
                })
            else:
                for q in range(1, 5):
                    start_month = (q - 1) * 3 + 1
                    end_month = start_month + 2
                    orders = base_query.filter(
                        extract("month", Order.event_date) >= start_month,
                        extract("month", Order.event_date) <= end_month
                    ).all()
                    total = sum(Decimal(str(o.total_amount or 0)) for o in orders)
                    grand_total += total
                    items.append({
                        "period": f"{year}-Q{q}",
                        "total_revenue": total,
                        "total_orders": len(orders)
                    })

        elif period == "year":
            orders = base_query.all()
            total = sum(Decimal(str(o.total_amount or 0)) for o in orders)
            grand_total = total
            items.append({
                "period": str(year),
                "total_revenue": total,
                "total_orders": len(orders)
            })

        return {
            "period_type": period,
            "year": year,
            "items": items,
            "grand_total": grand_total
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo báo cáo doanh thu: {str(e)}"
        )


async def get_orders_summary(db: Session) -> dict:
    """Tổng đơn theo trạng thái"""
    try:
        all_orders = db.query(Order).all()
        summary = {
            "total_orders": len(all_orders),
            "booking_pending": 0,
            "confirmed": 0,
            "in_progress": 0,
            "completed": 0,
            "cancelled": 0,
            "invoiced": 0,
        }
        for order in all_orders:
            if order.status.value in summary:
                summary[order.status.value] += 1

        return summary

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo báo cáo tổng đơn: {str(e)}"
        )


async def get_revenue_by_event_type(db: Session) -> list[dict]:
    """Doanh thu theo loại tiệc"""
    try:
        results = (
            db.query(
                Order.event_type,
                func.count(Order.id).label("total_orders"),
                func.coalesce(func.sum(Order.total_amount), 0).label("total_revenue")
            )
            .filter(Order.status.notin_([OrderStatus.cancelled]))
            .group_by(Order.event_type)
            .all()
        )

        return [
            {
                "event_type": r.event_type.value if r.event_type else "unknown",
                "total_orders": r.total_orders,
                "total_revenue": Decimal(str(r.total_revenue))
            }
            for r in results
        ]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo báo cáo theo loại tiệc: {str(e)}"
        )


async def get_halls_utilization(db: Session) -> list[dict]:
    """Tỷ lệ sử dụng sảnh"""
    try:
        halls = db.query(Hall).filter(Hall.deleted_at.is_(None)).all()

        # Tổng số slot khả dụng = số sảnh × số ca/ngày × 365
        # Đơn giản: tính tỷ lệ booking / tổng slot trong năm hiện tại
        from datetime import datetime
        current_year = datetime.now().year

        total_shifts_per_year = len(EventShift) * 365  # 4 ca × 365 ngày

        items = []
        for hall in halls:
            booking_count = (
                db.query(func.count(Order.id))
                .filter(
                    Order.hall_id == hall.id,
                    Order.status != OrderStatus.cancelled,
                    extract("year", Order.event_date) == current_year
                )
                .scalar()
            )

            rate = Decimal(str(booking_count)) / Decimal(str(total_shifts_per_year)) * 100
            rate = rate.quantize(Decimal("0.01"))

            items.append({
                "hall_id": hall.id,
                "hall_name": hall.name,
                "total_bookings": booking_count,
                "utilization_rate": rate
            })

        return items

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo báo cáo sử dụng sảnh: {str(e)}"
        )


async def get_top_menus(db: Session) -> list[dict]:
    """Menu/món được đặt nhiều nhất"""
    try:
        results = (
            db.query(
                Menu.id.label("menu_id"),
                Menu.name.label("menu_name"),
                func.coalesce(func.sum(OrderMenu.quantity), 0).label("total_ordered"),
                func.coalesce(
                    func.sum(OrderMenu.price_snapshot * OrderMenu.quantity), 0
                ).label("total_revenue")
            )
            .join(OrderMenu, OrderMenu.menu_id == Menu.id)
            .join(Order, Order.id == OrderMenu.order_id)
            .filter(Order.status != OrderStatus.cancelled)
            .group_by(Menu.id, Menu.name)
            .order_by(func.sum(OrderMenu.quantity).desc())
            .limit(10)
            .all()
        )

        return [
            {
                "menu_id": r.menu_id,
                "menu_name": r.menu_name,
                "total_ordered": int(r.total_ordered),
                "total_revenue": Decimal(str(r.total_revenue))
            }
            for r in results
        ]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo báo cáo top menu: {str(e)}"
        )


async def get_staff_performance(db: Session) -> list[dict]:
    """Đơn tạo / doanh thu theo nhân viên"""
    try:
        results = (
            db.query(
                Staff.id.label("staff_id"),
                Staff.full_name.label("staff_name"),
                func.count(Order.id).label("total_orders_created"),
                func.coalesce(func.sum(Order.total_amount), 0).label("total_revenue")
            )
            .join(Order, Order.created_by_staff_id == Staff.id)
            .filter(Order.status != OrderStatus.cancelled)
            .group_by(Staff.id, Staff.full_name)
            .order_by(func.sum(Order.total_amount).desc())
            .all()
        )

        return [
            {
                "staff_id": str(r.staff_id),
                "staff_name": r.staff_name,
                "total_orders_created": r.total_orders_created,
                "total_revenue": Decimal(str(r.total_revenue))
            }
            for r in results
        ]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo báo cáo nhân viên: {str(e)}"
        )
