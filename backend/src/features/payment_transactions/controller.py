from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.core.enums import StaffRole
from src.core.security import require_roles
from src.features.payment_transactions import service, schemas
from src.features.staff.model import Staff

router = APIRouter(
    prefix="/orders",
    tags=["Payment Transactions"]
)


@router.get("/{order_id}/payment/transactions", response_model=schemas.TransactionListResponse)
async def list_order_transactions(
    order_id: int,
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.staff, StaffRole.owner))
):
    """Lấy danh sách giao dịch thanh toán của đơn hàng"""
    transactions = await service.list_transactions_by_order(db, order_id)
    return {
        "total": len(transactions),
        "items": transactions
    }


@router.post(
    "/{order_id}/payment/transactions",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.TransactionResponse
)
async def record_order_transaction(
    order_id: int,
    payload: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.staff, StaffRole.owner))
):
    """Ghi nhận 1 lần thanh toán / đặt cọc cho đơn hàng"""
    return await service.record_transaction(db, order_id, payload, _current_staff)
