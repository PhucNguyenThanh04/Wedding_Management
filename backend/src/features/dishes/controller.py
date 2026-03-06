from fastapi import APIRouter, Depends, Body, status
from sqlalchemy.orm import Session
from src.features.dishes import service
from src.features.dishes import schemas
from src.core.database import get_db
from src.core.enums import StaffRole
from typing import List
from src.core.security import require_roles, get_current_user
from src.core.enums import DishType

router = APIRouter(
    prefix='/dishes',
    tags=['dishes']
)


@router.post("/", response_model=schemas.DishResponse, status_code=status.HTTP_201_CREATED)
async def create_dish(
    payload: schemas.DishCreate = Body(...),
    db: Session = Depends(get_db),
    _current_owner=Depends(require_roles(StaffRole.owner))
):
    dish = await service.create_dish(db, payload)
    return dish


@router.get("/{dish_id}", response_model=schemas.DishResponse)
async def get_dish(
    dish_id: int,
    db: Session = Depends(get_db)
):
    dish = await service.get_dish(db, dish_id)
    return dish


@router.get("/", response_model=List[schemas.DishResponse])
async def list_dishes(
    dish_type: DishType | None = None,
    db: Session = Depends(get_db)
):
    dishes = await service.list_dishes(db, dish_type)
    return list(dishes)

@router.delete("/{dish_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dish(
    dish_id: int,
    db: Session = Depends(get_db),
    _current_owner=Depends(require_roles(StaffRole.owner))
):
    await service.delete_dish(db, dish_id)
    return None

@router.put("/{dish_id}", response_model=schemas.DishResponse)
async def update_dish(
    dish_id: int,
    payload: schemas.DishUpdate = Body(...),
    db: Session = Depends(get_db),
    _current_owner=Depends(require_roles(StaffRole.owner))
):
    dish = await service.update_dish(db, dish_id, payload)
    return dish


@router.patch("/{dish_id}/availability", response_model=schemas.DishResponse)
async def toggle_dish_availability(
    dish_id: int,
    db: Session = Depends(get_db),
    _current_owner=Depends(get_current_user)
):
    dish = await service.toggle_dish_availability(db, dish_id)
    return dish

