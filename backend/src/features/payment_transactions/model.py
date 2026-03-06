from sqlalchemy import Column, Integer, String, Numeric, DateTime, Enum, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from src.core.database import Base
from src.core.enums import PaymentMethod




class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    transaction_ref = Column(String(100))
    bank_name = Column(String(100))
    paid_at = Column(DateTime, nullable=False, default=func.now())
    received_by_staff_id = Column(UUID(as_uuid=True), ForeignKey("staff.id"))
    note = Column(Text)

    # Relationships
    payment = relationship("Payment", back_populates="transactions")
    received_by_staff = relationship("Staff", back_populates="received_transactions")