from sqlalchemy import Column, String, Integer, Numeric, DateTime, Text, Boolean, func
from sqlalchemy.orm import relationship

from src.core.database import Base


class Hall(Base):
    __tablename__ = "halls"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False, unique=True)
    location = Column(String(200), nullable=False)
    capacity = Column(Integer, nullable=False)
    min_tables = Column(Integer, nullable=False, default=1)
    max_tables = Column(Integer, nullable=False)
    price_per_table = Column(Numeric(12, 2), nullable=False)
    is_available = Column(Boolean, nullable=False, default=True)
    description = Column(Text)
    image_url = Column(String(500))
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime)

    # Relationships
    orders = relationship("Order", back_populates="hall")