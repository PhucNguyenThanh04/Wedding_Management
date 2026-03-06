from sqlalchemy import Column, Integer, ForeignKey, Numeric, Boolean, Text, DateTime, func
from sqlalchemy.orm import relationship

from src.core.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    dish_id = Column(Integer, ForeignKey("dishes.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price_snapshot = Column(Numeric(12, 2), nullable=False)
    is_addition = Column(Boolean, nullable=False, default=True)
    note = Column(Text)
    created_at = Column(DateTime, nullable=False, default=func.now())

    # Relationships
    order = relationship("Order", back_populates="order_items")
    dish = relationship("Dish", back_populates="order_items")