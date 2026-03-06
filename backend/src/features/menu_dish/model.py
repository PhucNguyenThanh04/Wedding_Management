from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from src.core.database import Base



class MenuDish(Base):
    __tablename__ = "menu_dishes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    menu_id = Column(Integer, ForeignKey("menus.id"), nullable=False)
    dish_id = Column(Integer, ForeignKey("dishes.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    display_order = Column(Integer)

    __table_args__ = (
        UniqueConstraint("menu_id", "dish_id", name="uq_menu_dish"),
    )

    # Relationships
    menu = relationship("Menu", back_populates="menu_dishes")
    dish = relationship("Dish", back_populates="menu_dishes")