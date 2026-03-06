from decimal import Decimal
from sqlalchemy import (Column,
                        Integer,
                        String,
                        Date,
                        Time,
                        Enum,
                        Numeric,
                        Text,
                        DateTime,
                        ForeignKey,
                        UniqueConstraint,
                        func
                        )
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from src.core.database import Base
from src.core.enums import EventShift, EventType, OrderStatus


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # Relationships FK
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    hall_id = Column(Integer, ForeignKey("halls.id"), nullable=False)
    created_by_staff_id = Column(
        UUID(as_uuid=True),
        ForeignKey("staff.id"),
        nullable=False
    )
    assigned_staff_id = Column(
        UUID(as_uuid=True),
        ForeignKey("staff.id")
    )

    # Event Info
    event_date = Column(Date, nullable=False)
    event_shift = Column(Enum(EventShift), nullable=False)
    event_time = Column(Time, nullable=False)
    event_type = Column(Enum(EventType), nullable=False)
    so_ban = Column(Integer, nullable=False)

    # Pricing Breakdown
    menu_total = Column(Numeric(15, 2), nullable=False, default=0)
    extra_dishes_total = Column(Numeric(15, 2), nullable=False, default=0)
    table_total = Column(Numeric(15, 2), nullable=False, default=0)
    service_fee = Column(Numeric(15, 2), default=0)
    discount_amount = Column(Numeric(15, 2), default=0)
    subtotal = Column(Numeric(15, 2), nullable=False, default=0)
    tax_rate = Column(Numeric(5, 2), default=Decimal("10.00"))
    tax_amount = Column(Numeric(15, 2), nullable=False, default=0)
    total_amount = Column(Numeric(15, 2), nullable=False, default=0)

    # Status & Notes
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.booking_pending)

    notes = Column(String(1000))
    cancellation_reason = Column(Text)

    # Timestamps
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    confirmed_at = Column(DateTime)
    completed_at = Column(DateTime)

    # Audit
    last_modified_by_staff_id = Column(
        UUID(as_uuid=True),
        ForeignKey("staff.id")
    )
    last_modified_at = Column(DateTime)

    __table_args__ = (
        UniqueConstraint("hall_id", "event_date", "event_shift", name="uq_hall_date_shift"),
    )

    # Relationships
    customer = relationship("Customer", back_populates="orders")
    hall = relationship("Hall", back_populates="orders")
    assigned_staff = relationship("Staff", foreign_keys=[assigned_staff_id], back_populates="assigned_orders")
    created_by_staff = relationship("Staff", foreign_keys=[created_by_staff_id], back_populates="created_orders")
    last_modified_by_staff = relationship("Staff", foreign_keys=[last_modified_by_staff_id],
                                          back_populates="modified_orders")

    order_menus = relationship("OrderMenu", back_populates="order")
    order_items = relationship("OrderItem", back_populates="order")
    order_table = relationship("OrderTable", back_populates="order", uselist=False)
    payment = relationship("Payment", back_populates="order", uselist=False)
    invoices = relationship("Invoice", back_populates="order")
    history = relationship("OrderHistory", back_populates="order")

