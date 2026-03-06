from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from src.core.enums import DishType

class DishBase(BaseModel):
    name: str = Field(..., max_length=200, description="Name of the dish")
    description: Optional[str] = Field(None, description="Description of the dish")
    dish_type: DishType = Field(..., description="Type of the dish")
    price: float = Field(..., gt=0, description="Price of the dish, must be greater than 0")
    is_available: bool = Field(default=True, description="Availability of the dish")
    image_url: Optional[str] = Field(None, max_length=500, description="URL of the dish image")


class DishCreate(DishBase):
    pass


class DishUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200, description="Name of the dish")
    description: Optional[str] = Field(None, description="Description of the dish")
    dish_type: Optional[DishType] = Field(None, description="Type of the dish")
    price: Optional[float] = Field(None, gt=0, description="Price of the dish, must be greater than 0")
    is_available: Optional[bool] = Field(None, description="Availability of the dish")
    image_url: Optional[str] = Field(None, max_length=500, description="URL of the dish image")


class DishResponse(DishBase):
    id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = {"from_attributes": True}
