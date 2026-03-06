from sqlalchemy import Column, Integer, String, Text, Enum, Numeric, Boolean, DateTime, func
from sqlalchemy.orm import relationship

from src.core.database import Base
from src.core.enums import DishType


class Dish(Base):
    __tablename__ = "dishes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False, unique=True)
    description = Column(Text)
    dish_type = Column(Enum(DishType), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    is_available = Column(Boolean, nullable=False, default=True)
    image_url = Column(String(500))
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime)

    # Relationships
    menu_dishes = relationship("MenuDish", back_populates="dish")
    order_items = relationship("OrderItem", back_populates="dish")