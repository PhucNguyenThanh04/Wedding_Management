from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.features.payment.model import Payment
from src.features.order.model import Order
from src.core.enums import PaymentStatus, OrderStatus


async def create_payment_for_order(db: Session, order_id: int, notes: str = None) -> Payment:
    """Tạo payment record cho order (gọi khi xác nhận đơn)"""
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy đơn hàng với ID {order_id}."
            )

        # Kiểm tra đã có payment chưa
        existing = db.query(Payment).filter(Payment.order_id == order_id).first()
        if existing:
            return existing

        payment = Payment(
            order_id=order_id,
            order_total=order.total_amount,
            paid_amount=Decimal("0"),
            remaining_amount=order.total_amount,
            status=PaymentStatus.pending,
            notes=notes,
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo payment: {str(e)}"
        )


async def get_payment_by_order_id(db: Session, order_id: int) -> Payment:
    """Lấy payment theo order_id"""
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy đơn hàng với ID {order_id}."
            )

        payment = db.query(Payment).filter(Payment.order_id == order_id).first()
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Đơn hàng #{order_id} chưa có thông tin thanh toán. Hãy xác nhận đơn trước."
            )
        return payment

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy xuất payment: {str(e)}"
        )


async def init_payment_for_order(db: Session, order_id: int, notes: str = None) -> Payment:
    """POST /orders/{id}/payment — khởi tạo payment nếu chưa có"""
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy đơn hàng với ID {order_id}."
            )

        if order.status == OrderStatus.cancelled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể tạo thanh toán cho đơn hàng đã huỷ."
            )

        existing = db.query(Payment).filter(Payment.order_id == order_id).first()
        if existing:
            # Cập nhật order_total nếu đơn đã thay đổi
            if existing.order_total != order.total_amount:
                diff = order.total_amount - existing.order_total
                existing.order_total = order.total_amount
                existing.remaining_amount = existing.remaining_amount + diff
                db.commit()
                db.refresh(existing)
            return existing

        payment = Payment(
            order_id=order_id,
            order_total=order.total_amount,
            paid_amount=Decimal("0"),
            remaining_amount=order.total_amount,
            status=PaymentStatus.pending,
            notes=notes,
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi khởi tạo payment: {str(e)}"
        )
