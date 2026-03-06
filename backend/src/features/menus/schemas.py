from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from src.core.enums import EventType, DishType

class MenuBase(BaseModel):
    name: str = Field(..., max_length=200, description="Name of the menu")
    description: Optional[str] = Field(None, description="Description of the menu")
    min_guests: int = Field(..., ge=1, description="Minimum number of guests, must be at least 1")
    category: EventType = Field(..., description="Category of the menu")
    is_active: bool = Field(default=True, description="Whether the menu is active")
    image_url: Optional[str] = Field(None, max_length=500, description="URL of the menu image")

class MenuCreate(MenuBase):
    pass

class MenuUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200, description="Name of the menu")
    description: Optional[str] = Field(None, description="Description of the menu")
    min_guests: Optional[int] = Field(None, ge=1, description="Minimum number of guests, must be at least 1")
    category: Optional[EventType] = Field(None, description="Category of the menu")
    is_active: Optional[bool] = Field(None, description="Whether the menu is active")
    image_url: Optional[str] = Field(None, max_length=500, description="URL of the menu image")

class MenuResponse(MenuBase):
    id: int
    price: float
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = {"from_attributes": True}


class DishInMenuResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    dish_type: DishType
    price: float
    is_available: bool
    image_url: Optional[str]
    quantity: int
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = {"from_attributes": True}


class MenuDetailResponse(MenuBase):
    id: int
    price: float
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]
    dishes: list[DishInMenuResponse] = []

    model_config = {"from_attributes": True}

