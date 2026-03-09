from datetime import date
from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_

from src.features.order.model import Order
from src.features.order_items.model import OrderItem
from src.features.order_items.schemas import OrderItemCreate, OrderItemUpdate
from src.features.dishes.model import Dish
from src.features.hall.model import Hall


def _recalculate_order_totals(db: Session, order: Order) -> None:

    menu_total = Decimal("0")
    for om in order.order_menus:
        menu_total += Decimal(str(om.price_snapshot)) * om.quantity
    order.menu_total = menu_total

    extra_total = Decimal("0")
    for item in order.order_items:
        extra_total += Decimal(str(item.price_snapshot)) * item.quantity
    order.extra_dishes_total = extra_total

    hall = db.query(Hall).filter(Hall.id == order.hall_id).first()
    if hall:
        order.table_total = Decimal(str(hall.price_per_table)) * order.so_ban

    service = Decimal(str(order.service_fee or 0))
    discount = Decimal(str(order.discount_amount or 0))
    order.subtotal = order.menu_total + order.extra_dishes_total + order.table_total + service - discount

    tax_rate = Decimal(str(order.tax_rate or 10))
    order.tax_amount = (order.subtotal * tax_rate / Decimal("100")).quantize(Decimal("0.01"))
    order.total_amount = order.subtotal + order.tax_amount


async def add_dish_to_order(
        db: Session,
        order_id: int,
        payload: OrderItemCreate,
        _current_staff
) -> Order:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy đơn hàng."
            )

        dish = db.query(Dish).filter(Dish.id == payload.dish_id).first()
        if not dish:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy món ăn với ID {payload.dish_id}."
            )
        if not dish.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Món '{dish.name}' hiện không khả dụng."
            )

        existing_item = db.query(OrderItem).filter(
            and_(
                OrderItem.order_id == order_id,
                OrderItem.dish_id == payload.dish_id,
            )
        ).first()
        if existing_item:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Món '{dish.name}' đã có trong đơn hàng. Hãy cập nhật số lượng thay vì thêm mới."
            )

        price_snapshot = Decimal(str(dish.price))

        order_item = OrderItem(
            order_id=order_id,
            dish_id=payload.dish_id,
            quantity=payload.quantity,
            price_snapshot=price_snapshot,
            is_addition=True,
            note=payload.note,
        )

        db.add(order_item)
        db.flush()

        db.refresh(order)

        _recalculate_order_totals(db, order)

        order.last_modified_by_staff_id = _current_staff.id
        order.last_modified_at = date.today()

        db.commit()
        db.refresh(order)
        return order

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi thêm món vào đơn hàng: {str(e)}"
        )


async def update_dish_in_order(
        db: Session,
        order_id: int,
        order_item_id: int,
        payload: OrderItemUpdate,
        _current_staff
) -> Order:
    """
    Cập nhật số lượng / ghi chú món ăn trong order.
    """
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy đơn hàng."
            )


        order_item = db.query(OrderItem).filter(
            and_(
                OrderItem.id == order_item_id,
                OrderItem.order_id == order_id
            )
        ).first()
        if not order_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy món ăn trong đơn hàng."
            )

        if payload.quantity is not None:
            order_item.quantity = payload.quantity
        if payload.note is not None:
            order_item.note = payload.note

        _recalculate_order_totals(db, order)

        order.last_modified_by_staff_id = _current_staff.id
        order.last_modified_at = date.today()

        db.commit()
        db.refresh(order)
        return order

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi cập nhật món trong đơn hàng: {str(e)}"
        )


async def remove_dish_from_order(
        db: Session,
        order_id: int,
        order_item_id: int,
        _current_staff
) -> bool:
    """
    Xoá món ăn khỏi order.
    """
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy đơn hàng."
            )


        order_item = db.query(OrderItem).filter(
            and_(
                OrderItem.id == order_item_id,
                OrderItem.order_id == order_id
            )
        ).first()
        if not order_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy món ăn trong đơn hàng."
            )

        db.delete(order_item)
        db.flush()

        db.refresh(order)

        _recalculate_order_totals(db, order)

        order.last_modified_by_staff_id = _current_staff.id
        order.last_modified_at = date.today()

        db.commit()
        return True

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi xoá món khỏi đơn hàng: {str(e)}"
        )
