from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from src.core.database import Base


class OrderTable(Base):
    __tablename__ = "order_tables"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True)
    quantity = Column(Integer, nullable=False)
    price_per_table_snapshot = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())

    # Relationships
    order = relationship("Order", back_populates="order_table")