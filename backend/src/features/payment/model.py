from sqlalchemy import Column, Integer, Numeric, Enum, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from src.core.database import Base
from src.core.enums import PaymentStatus


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True)
    order_total = Column(Numeric(15, 2), nullable=False)
    paid_amount = Column(Numeric(15, 2), nullable=False, default=0)
    remaining_amount = Column(Numeric(15, 2), nullable=False)
    status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.pending)
    notes = Column(Text)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    order = relationship("Order", back_populates="payment")
    transactions = relationship("PaymentTransaction", back_populates="payment")
    invoices = relationship("Invoice", back_populates="payment")

