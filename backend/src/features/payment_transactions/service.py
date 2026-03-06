from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.features.payment.model import Payment
from src.features.payment_transactions.model import PaymentTransaction
from src.features.payment_transactions.schemas import TransactionCreate
from src.features.order.model import Order
from src.core.enums import PaymentStatus


async def record_transaction(
    db: Session,
    order_id: int,
    payload: TransactionCreate,
    current_staff
) -> PaymentTransaction:
    """Ghi nhận 1 lần thanh toán / đặt cọc"""
    try:
        # Tìm order
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy đơn hàng với ID {order_id}."
            )

        # Tìm payment
        payment = db.query(Payment).filter(Payment.order_id == order_id).first()
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Đơn hàng #{order_id} chưa có payment. Hãy khởi tạo payment trước."
            )

        if payment.status == PaymentStatus.fully_paid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Đơn hàng đã được thanh toán đầy đủ."
            )

        if payment.status == PaymentStatus.refunded:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Đơn hàng đã được hoàn tiền, không thể thanh toán thêm."
            )

        amount = Decimal(str(payload.amount))
        remaining = Decimal(str(payment.remaining_amount))

        if amount > remaining:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Số tiền thanh toán ({amount:,.0f}) vượt quá số còn lại ({remaining:,.0f})."
            )

        # Tạo transaction
        transaction = PaymentTransaction(
            payment_id=payment.id,
            amount=amount,
            payment_method=payload.payment_method,
            transaction_ref=payload.transaction_ref,
            bank_name=payload.bank_name,
            received_by_staff_id=current_staff.id,
            note=payload.note,
        )
        db.add(transaction)

        # Cập nhật payment
        payment.paid_amount = Decimal(str(payment.paid_amount)) + amount
        payment.remaining_amount = Decimal(str(payment.remaining_amount)) - amount

        # Cập nhật trạng thái payment
        if payment.remaining_amount <= 0:
            payment.status = PaymentStatus.fully_paid
        elif payment.paid_amount > 0 and payment.status == PaymentStatus.pending:
            # Lần thanh toán đầu tiên → deposit_paid
            payment.status = PaymentStatus.deposit_paid
        elif payment.paid_amount > 0 and payment.status == PaymentStatus.deposit_paid:
            # Đã có deposit, thanh toán thêm → partial_paid
            payment.status = PaymentStatus.partial_paid

        db.commit()
        db.refresh(transaction)
        return transaction

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi ghi nhận thanh toán: {str(e)}"
        )


async def list_transactions_by_order(
    db: Session,
    order_id: int
) -> list[PaymentTransaction]:
    """Lấy danh sách giao dịch của 1 đơn hàng"""
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
                detail=f"Đơn hàng #{order_id} chưa có payment."
            )

        transactions = db.query(PaymentTransaction).filter(
            PaymentTransaction.payment_id == payment.id
        ).order_by(PaymentTransaction.paid_at.desc()).all()

        return transactions

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi truy xuất danh sách giao dịch: {str(e)}"
        )
