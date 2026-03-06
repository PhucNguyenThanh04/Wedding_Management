
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, field_validator, model_validator


class HallBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, examples=["Hall A"])
    location: str = Field(..., min_length=1, max_length=200, examples=["Floor 1"])
    capacity: int = Field(..., gt=0, examples=[100])
    min_tables: int = Field(default=1, ge=1, examples=[5])
    max_tables: int = Field(..., ge=1, examples=[20])
    price_per_table: Decimal = Field(..., gt=0, decimal_places=2, examples=[500000.00])
    is_available: bool = Field(default=True)
    description: Optional[str] = Field(default=None)
    image_url: Optional[str] = Field(default=None, max_length=500)

    @field_validator("max_tables")
    @classmethod
    def max_tables_must_gte_min(cls, v, info):
        min_tables = info.data.get("min_tables")
        if min_tables is not None and v < min_tables:
            raise ValueError("max_tables must be >= min_tables")
        return v


class HallCreate(HallBase):
    pass


class HallUpdate(HallBase):
    pass


class HallPartialUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    location: Optional[str] = Field(default=None, min_length=1, max_length=200)
    capacity: Optional[int] = Field(default=None, gt=0)
    min_tables: Optional[int] = Field(default=None, ge=1)
    max_tables: Optional[int] = Field(default=None, ge=1)
    price_per_table: Optional[Decimal] = Field(default=None, gt=0, decimal_places=2)
    is_available: Optional[bool] = Field(default=None)
    description: Optional[str] = Field(default=None)
    image_url: Optional[str] = Field(default=None, max_length=500)

    @model_validator(mode="after")
    def validate_tables(self):
        if (
                self.min_tables is not None
                and self.max_tables is not None
                and self.max_tables < self.min_tables
        ):
            raise ValueError("max_tables must be >= min_tables")
        return self


class HallResponse(HallBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class HallListResponse(BaseModel):
    total: int
    items: list[HallResponse]

    model_config = {"from_attributes": True}


class HallAvailabilityResponse(BaseModel):
    id: int
    name: str
    location: str
    capacity: int
    min_tables: int
    max_tables: int
    price_per_table: float

    class Config:
        from_attributes = True