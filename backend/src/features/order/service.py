from datetime import date
from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_

from src.features.order.model import Order
from src.features.order.schemas import OrderCreate, OrderUpdate
from src.features.order_menu import schemas as schemas_oder_menu
from src.features.order_menu.model import OrderMenu
from src.features.hall.model import Hall
from src.features.customer.model import Customer
from src.features.menus.model import Menu
from src.core.enums import EventShift, OrderStatus


def _get_shift_label(shift: EventShift) -> str:

    labels = {
        EventShift.MORNING: "Sáng (07:00 – 11:00)",
        EventShift.LUNCH: "Trưa (11:00 – 14:00)",
        EventShift.AFTERNOON: "Chiều (14:00 – 17:00)",
        EventShift.EVENING: "Tối (17:00 – 22:00)",
    }
    return labels.get(shift, shift.value)


def _get_booked_shifts(db: Session, hall_id: int, event_date: date) -> list:
    """Lấy tất cả order đã đặt sảnh này vào ngày cụ thể (chưa bị huỷ)."""
    return db.query(Order).filter(
        and_(
            Order.hall_id == hall_id,
            Order.event_date == event_date,
            Order.status != OrderStatus.cancelled,
        )
    ).all()


def _get_available_shifts(db: Session, hall_id: int, event_date: date) -> list[str]:
    """Trả về danh sách các ca còn trống của sảnh vào ngày đó."""
    booked_orders = _get_booked_shifts(db, hall_id, event_date)
    booked_shift_set = {order.event_shift for order in booked_orders}

    available = []
    for shift in EventShift:
        if shift not in booked_shift_set:
            available.append(_get_shift_label(shift))
    return available


async def create_order(db: Session, payload: OrderCreate,
                       _current_staff) -> Order:
    """
    Tạo order mới với kiểm tra:
    1. Khách hàng có tồn tại không
    2. Sảnh có tồn tại và đang hoạt động không
    3. Số bàn có phù hợp với sảnh không
    4. Sảnh vào ngày + ca đó đã có ai đặt chưa → nếu rồi thì gợi ý ca trống
    """
    try:
        # 1. Kiểm tra khách hàng tồn tại
        customer = db.query(Customer).filter(Customer.id == payload.customer_id).first()
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy khách hàng với ID {payload.customer_id}."
            )

        # 2. Kiểm tra sảnh tồn tại và đang hoạt động
        hall = db.query(Hall).filter(Hall.id == payload.hall_id).first()
        if not hall:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy sảnh với ID {payload.hall_id}."
            )
        if not hall.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sảnh '{hall.name}' hiện không hoạt động. Vui lòng chọn sảnh khác."
            )

        # 3. Kiểm tra số bàn phù hợp với sảnh
        if payload.so_ban < hall.min_tables:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sảnh '{hall.name}' yêu cầu tối thiểu {hall.min_tables} bàn."
            )
        if payload.so_ban > hall.max_tables:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sảnh '{hall.name}' chỉ chứa tối đa {hall.max_tables} bàn. "
                       f"Bạn đã chọn {payload.so_ban} bàn."
            )

        # 4. Kiểm tra sảnh có trống vào ngày + ca đó không
        existing_order = db.query(Order).filter(
            and_(
                Order.hall_id == payload.hall_id,
                Order.event_date == payload.event_date,
                Order.event_shift == payload.event_shift,
                Order.status != OrderStatus.cancelled,
            )
        ).first()

        if existing_order:
            # Sảnh đã có người đặt ca này → gợi ý các ca còn trống
            available_shifts = _get_available_shifts(db, payload.hall_id, payload.event_date)

            if available_shifts:
                shifts_text = ", ".join(available_shifts)
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Sảnh '{hall.name}' đã được đặt vào ngày {payload.event_date} "
                        f"ca {_get_shift_label(payload.event_shift)}. "
                        f"Các ca còn trống trong ngày: {shifts_text}."
                    )
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Sảnh '{hall.name}' đã kín lịch cả ngày {payload.event_date}. "
                        f"Vui lòng chọn ngày khác hoặc sảnh khác."
                    )
                )

        # 5. Tính tiền bàn (table_total = số bàn × giá mỗi bàn)
        table_total = payload.so_ban * hall.price_per_table

        # 6. Tạo order mới
        new_order = Order(
            customer_id=payload.customer_id,
            hall_id=payload.hall_id,
            created_by_staff_id=_current_staff.id,
            event_date=payload.event_date,
            event_shift=payload.event_shift,
            event_time=payload.event_time,
            event_type=payload.event_type,
            so_ban=payload.so_ban,
            notes=payload.notes,
            status=OrderStatus.booking_pending,
        )

        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        return new_order

    except HTTPException:
        raise  # Re-raise HTTP exceptions to be handled by FastAPI

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi tạo đơn hàng: {str(e)}"
        )

async def get_order_by_id(
        db: Session, order_id: int
) -> Order | None:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        return order
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi truy xuất đơn hàng: {str(e)}"
        )

async def update_order(
        db: Session,
        oder_id: int,
        payload: OrderUpdate,
        _current_staff
) -> Order | None:
    try:
        order = db.query(Order).filter(Order.id == oder_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        hall = db.query(Hall).filter(Hall.id == payload.hall_id).first()
        if not hall:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy sảnh với ID {payload.hall_id}."
            )
        if not hall.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sảnh '{hall.name}' hiện không hoạt động. Vui lòng chọn sảnh khác."
            )

        # 3. Kiểm tra số bàn phù hợp với sảnh
        if payload.so_ban < hall.min_tables:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sảnh '{hall.name}' yêu cầu tối thiểu {hall.min_tables} bàn."
            )
        if payload.so_ban > hall.max_tables:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sảnh '{hall.name}' chỉ chứa tối đa {hall.max_tables} bàn. "
                       f"Bạn đã chọn {payload.so_ban} bàn."
            )

        # 4. Kiểm tra sảnh có trống vào ngày + ca đó không
        existing_order = db.query(Order).filter(
            and_(
                Order.hall_id == payload.hall_id,
                Order.event_date == payload.event_date,
                Order.event_shift == payload.event_shift,
                Order.status != OrderStatus.cancelled,
            )
        ).first()

        if existing_order:
            available_shifts = _get_available_shifts(db, payload.hall_id, payload.event_date)
            if available_shifts:
                shifts_text = ", ".join(available_shifts)
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Sảnh '{hall.name}' đã được đặt vào ngày {payload.event_date} "
                        f"ca {_get_shift_label(payload.event_shift)}. "
                        f"Các ca còn trống trong ngày: {shifts_text}."
                    )
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Sảnh '{hall.name}' đã kín lịch cả ngày {payload.event_date}. "
                        f"Vui lòng chọn ngày khác hoặc sảnh khác."
                    )
                )

        for field, value in payload.dict(exclude_unset=True).items():
            setattr(order, field, value)

        order.last_modified_by_staff_id = _current_staff.id
        order.last_modified_at = date.today()

        db.commit()
        db.refresh(order)
        return order

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi cập nhật đơn hàng: {str(e)}"
        )



async def cancel_order(
        db: Session,
        order_id: int,
        _current_staff
) -> bool:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        order.status = OrderStatus.cancelled
        order.cancellation_reason = "Cancelled by owner"
        order.last_modified_by_staff_id = _current_staff.id
        order.last_modified_at = date.today()

        db.commit()
        return True

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi huỷ đơn hàng: {str(e)}"
        )

async def list_orders(
        db: Session,
        status: OrderStatus | None,
        date: date | None,
        event_type: str | None
) -> list[Order]:
    try:
        query = db.query(Order)

        if status and date and event_type:
            query = query.filter(
                and_(
                    Order.status == status,
                    Order.event_date == date,
                    Order.event_type == event_type
                )
            )
        else:
            if status:
                query = query.filter(Order.status == status)
            if date:
                query = query.filter(Order.event_date == date)
            if event_type:
                query = query.filter(Order.event_type == event_type)

        return query.all()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi truy xuất danh sách đơn hàng: {str(e)}"
)


async def confirm_order(
        db: Session,
        order_id: int,
        _current_staff
) -> Order | None:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        order.status = OrderStatus.confirmed
        order.confirmed_at = date.today()
        order.last_modified_by_staff_id = _current_staff.id
        order.last_modified_at = date.today()

        db.commit()
        db.refresh(order)
        return order

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi xác nhận đơn hàng: {str(e)}"
        )

async def complete_order(
        db: Session,
        order_id: int,
        _current_staff
) -> Order | None:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        order.status = OrderStatus.completed
        order.completed_at = date.today()
        order.last_modified_by_staff_id = _current_staff.id
        order.last_modified_at = date.today()

        db.commit()
        db.refresh(order)
        return order

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi hoàn thành đơn hàng: {str(e)}")


async def in_process_order(
        db: Session,
        order_id: int,
        _current_staff
) -> Order | None:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        order.status = OrderStatus.in_progress
        order.last_modified_by_staff_id = _current_staff.id
        order.last_modified_at = date.today()

        db.commit()
        db.refresh(order)
        return order

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi chuyển đơn hàng sang trạng thái 'in_process': {str(e)}")

async def completed_order(
        db: Session,
        order_id: int,
        _current_staff
) -> Order | None:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        order.status = OrderStatus.completed
        order.completed_at = date.today()
        order.last_modified_by_staff_id = _current_staff.id
        order.last_modified_at = date.today()

        db.commit()
        db.refresh(order)
        return order

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã xảy ra lỗi khi chuyển đơn hàng sang trạng thái 'completed': {str(e)}")

# odẻ menu ==========================================================================================


def _recalculate_order_totals(db: Session, order: Order) -> None:

    # Tính menu_total từ tất cả order_menus
    menu_total = Decimal("0")
    for om in order.order_menus:
        menu_total += Decimal(str(om.price_snapshot)) * om.quantity
    order.menu_total = menu_total

    # Tính extra_dishes_total từ tất cả order_items (món tự chọn)
    extra_total = Decimal("0")
    for item in order.order_items:
        extra_total += Decimal(str(item.price_snapshot)) * item.quantity
    order.extra_dishes_total = extra_total

    # Tính table_total
    hall = db.query(Hall).filter(Hall.id == order.hall_id).first()
    if hall:
        order.table_total = Decimal(str(hall.price_per_table)) * order.so_ban

    # Tính subtotal
    service = Decimal(str(order.service_fee or 0))
    discount = Decimal(str(order.discount_amount or 0))
    order.subtotal = order.menu_total + order.extra_dishes_total + order.table_total + service - discount

    # Tính thuế và tổng
    tax_rate = Decimal(str(order.tax_rate or 10))
    order.tax_amount = (order.subtotal * tax_rate / Decimal("100")).quantize(Decimal("0.01"))
    order.total_amount = order.subtotal + order.tax_amount


async def add_menu_to_order(
        db: Session,
        order_id: int,
        payload: schemas_oder_menu.OrderMenuCreate,
        _current_staff ) -> Order | None:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")


        # Kiểm tra menu tồn tại và đang active
        menu = db.query(Menu).filter(Menu.id == payload.menu_id).first()
        if not menu:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy menu với ID {payload.menu_id}."
            )
        if not menu.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Menu '{menu.name}' hiện không khả dụng."
            )

        # Kiểm tra menu đã tồn tại trong order chưa
        existing_om = db.query(OrderMenu).filter(
            and_(
                OrderMenu.order_id == order_id,
                OrderMenu.menu_id == payload.menu_id,
            )
        ).first()
        if existing_om:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Menu '{menu.name}' đã có trong đơn hàng. Hãy cập nhật số lượng thay vì thêm mới."
            )

        # Lấy giá menu tại thời điểm đặt (price_snapshot)
        price_snapshot = Decimal(str(menu.price))

        oder_menu = OrderMenu(
            order_id=order_id,
            menu_id=payload.menu_id,
            quantity=payload.quantity,
            price_snapshot=price_snapshot,
            notes=payload.notes,
        )

        db.add(oder_menu)
        db.flush()  # flush để order_menus được cập nhật trước khi tính lại

        # Refresh order để lấy danh sách order_menus mới nhất
        db.refresh(order)

        # Tính lại tổng tiền cho order
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
            detail=f"Đã xảy ra lỗi khi thêm menu vào đơn hàng: {str(e)}"
        )


async def update_menu_in_order(
        db: Session,
        order_id: int,
        ordermenu_id: int,
        payload: schemas_oder_menu.OrderMenuUpdate,
        _current_staff
) -> Order | None:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")


        order_menu = db.query(OrderMenu).filter(
            and_(
                OrderMenu.id == ordermenu_id,
                OrderMenu.order_id == order_id
            )
        ).first()
        if not order_menu:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OrderMenu not found")

        if payload.quantity is not None:
            order_menu.quantity = payload.quantity
        if payload.notes is not None:
            order_menu.notes = payload.notes

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
            detail=f"Đã xảy ra lỗi khi cập nhật menu trong đơn hàng: {str(e)}")



async def remove_menu_from_order(
        db: Session,
        order_id: int,
        ordermenu_id: int,
        _current_staff
) -> bool:
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")


        order_menu = db.query(OrderMenu).filter(
            and_(
                OrderMenu.id == ordermenu_id,
                OrderMenu.order_id == order_id
            )
        ).first()
        if not order_menu:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OrderMenu not found")

        db.delete(order_menu)
        db.flush()  # flush để order_menus được cập nhật trước khi tính lại

        db.refresh(order)

        # Tính lại tổng tiền cho order
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
            detail=f"Đã xảy ra lỗi khi xoá menu khỏi đơn hàng: {str(e)}"
        )

