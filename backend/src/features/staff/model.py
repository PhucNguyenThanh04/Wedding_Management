from sqlalchemy import Column, String, Enum, Boolean, DateTime, func
from sqlalchemy.orm import relationship
import uuid
from sqlalchemy.dialects.postgresql import UUID

from src.core.database import Base
from src.core.enums import StaffRole


class Staff(Base):
    __tablename__ = "staff"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4  # ✔ UUID tự generate
    )
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    full_name = Column(String(200), nullable=False)
    phone = Column(String(20), unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(StaffRole), nullable=False, default=StaffRole.staff)
    refresh_token_hash = Column(String(255))
    reset_token = Column(String(255), nullable=True)
    reset_token_expires_at = Column(DateTime, nullable=True)

    is_active = Column(Boolean, nullable=False, default=True)
    last_login_at = Column(DateTime)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime)

    # Relationships
    assigned_orders = relationship("Order", foreign_keys="Order.assigned_staff_id", back_populates="assigned_staff")
    created_orders = relationship("Order", foreign_keys="Order.created_by_staff_id", back_populates="created_by_staff")
    modified_orders = relationship("Order", foreign_keys="Order.last_modified_by_staff_id", back_populates="last_modified_by_staff")
    created_invoices = relationship("Invoice", back_populates="created_by_staff")
    order_histories = relationship("OrderHistory", back_populates="staff")
    received_transactions = relationship("PaymentTransaction", back_populates="received_by_staff")
