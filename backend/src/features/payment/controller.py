from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.core.enums import StaffRole
from src.core.security import require_roles
from src.features.payment import service, schemas
from src.features.staff.model import Staff

router = APIRouter(
    prefix="/orders",
    tags=["Payments"]
)


@router.get("/{order_id}/payment", response_model=schemas.PaymentResponse)
async def get_order_payment(
    order_id: int,
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.staff, StaffRole.owner, StaffRole.admin))
):
    return await service.get_payment_by_order_id(db, order_id)


@router.post("/{order_id}/payment", status_code=status.HTTP_201_CREATED, response_model=schemas.PaymentResponse)
async def init_order_payment(
    order_id: int,
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(StaffRole.staff, StaffRole.owner, StaffRole.admin))
):

    return await service.init_payment_for_order(db, order_id)
