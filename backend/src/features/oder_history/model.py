from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from src.core.database import Base
from src.core.enums import OrderStatus



class OrderHistory(Base):
    __tablename__ = "order_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    staff_id = Column(
        UUID(as_uuid=True),
        ForeignKey("staff.id"),
        nullable=False
    )
    old_status = Column(Enum(OrderStatus))
    new_status = Column(Enum(OrderStatus), nullable=False)
    action = Column(String(100), nullable=False)
    changed_fields = Column(JSON)
    notes = Column(Text)
    created_at = Column(DateTime, nullable=False, default=func.now())

    # Relationships
    order = relationship("Order", back_populates="history")
    staff = relationship("Staff", back_populates="order_histories")
