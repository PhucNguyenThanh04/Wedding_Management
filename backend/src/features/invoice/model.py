from sqlalchemy import Column, Integer, String, DateTime, Numeric, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from src.core.database import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=False)
    invoice_no = Column(String(50), nullable=False, unique=True)
    issued_at = Column(DateTime, nullable=False, default=func.now())
    tax_amount = Column(Numeric(15, 2), nullable=False)
    notes = Column(Text)
    pdf_path = Column(String(500))
    created_at = Column(DateTime, nullable=False, default=func.now())
    created_by_staff_id = Column(
        UUID(as_uuid=True),
        ForeignKey("staff.id")
    )

    # Relationships
    order = relationship("Order", back_populates="invoices")
    payment = relationship("Payment", back_populates="invoices")
    created_by_staff = relationship("Staff", back_populates="created_invoices")