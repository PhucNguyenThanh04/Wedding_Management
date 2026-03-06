from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, DateTime, func
from sqlalchemy.orm import relationship

from src.core.database import Base

class OrderMenu(Base):
    __tablename__ = "order_menus"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_id = Column(Integer, ForeignKey("menus.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price_snapshot = Column(Numeric(12, 2), nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime, nullable=False, default=func.now())

    # Relationships
    order = relationship("Order", back_populates="order_menus")
    menu = relationship("Menu", back_populates="order_menus")

