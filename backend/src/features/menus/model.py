from sqlalchemy import Column, Integer, String, Text, Numeric, Enum, Boolean, DateTime, func
from sqlalchemy.orm import relationship

from src.core.database import Base
from src.core.enums import EventType


class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False, unique=True)
    description = Column(Text)
    price = Column(Numeric(12, 2), nullable=False, default=0)
    min_guests = Column(Integer, nullable=False)
    category = Column(Enum(EventType), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    image_url = Column(String(500))
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime)

    # Relationships
    menu_dishes = relationship("MenuDish", back_populates="menu")
    order_menus = relationship("OrderMenu", back_populates="menu")