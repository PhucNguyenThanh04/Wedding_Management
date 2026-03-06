from fastapi import APIRouter, Depends, Body, status
from src.core.security import require_roles
# from src.features.menus import service, schemas
from sqlalchemy.orm import Session
from src.features.menus import service, schemas
from src.core.database import get_db
from src.core.enums import EventType, StaffRole
from typing import List

router = APIRouter(
    prefix="/menus",
    tags=["menus"],
)

@router.post("/", response_model=schemas.MenuResponse, status_code=status.HTTP_201_CREATED)
async def create_menu(
        payload: schemas.MenuCreate = Body(...),
        db: Session = Depends(get_db),
        _current_user=Depends(require_roles(StaffRole.owner)),
):
    menu = await service.create_menu(db, payload)
    return menu

@router.get("/{menu_id}", response_model=schemas.MenuDetailResponse)
async def get_menu(
        menu_id: int,
        db: Session = Depends(get_db),
):
    menu = await service.get_menu(db, menu_id)
    return menu


@router.get("/", response_model=List[schemas.MenuResponse])
async def get_menus(
        category: EventType | None = None,
        db: Session = Depends(get_db)
):
    menus = await service.get_menus(db, category)
    return menus

@router.put("/{menu_id}", response_model=schemas.MenuResponse)
async def update_menu(
        menu_id: int,
        payload: schemas.MenuUpdate = Body(...),
        db: Session = Depends(get_db),
        _current_user=Depends(require_roles(StaffRole.owner)),
):
    menu = await service.update_menu(db, menu_id, payload)
    return menu

@router.delete("/{menu_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu(
        menu_id: int,
        db: Session = Depends(get_db),
        _current_user=Depends(require_roles(StaffRole.owner)),
):
    await service.delete_menu(db, menu_id)
    return None

@router.patch("/{menu_id}/is_active", response_model=schemas.MenuResponse)
async def toggle_menu_isactive(
        menu_id: int,
        db: Session = Depends(get_db),
        _current_user=Depends(require_roles(StaffRole.owner)),
):
    menu = await service.toggle_menu_is_active(db, menu_id)
    return menu


@router.post("/{menu_id}/dishes", response_model=List[schemas.DishInMenuResponse])
async def add_dishes_to_menu(
        menu_id: int,
        dish_ids: List[int] = Body(..., embed=True),
        db: Session = Depends(get_db),
        _current_user=Depends(require_roles(StaffRole.staff, StaffRole.owner)),
):
    menu = await service.add_dishes_to_menu(db, menu_id, dish_ids)
    return menu

@router.get("/menus/{menu_id}/dishes", response_model=List[schemas.DishInMenuResponse])
async def get_dishes_in_menu(
        menu_id: int,
        db: Session = Depends(get_db),
):
    dishes = await service.get_dishes_in_menu(db, menu_id)
    return dishes

@router.put("/menus/menu_id/dishes/dish_id", response_model=List[schemas.DishInMenuResponse])
async def update_quantity_of_dish_in_menu(
        menu_id: int,
        dish_id: int,
        quantity: int = Body(..., embed=True),
        db: Session = Depends(get_db),
        _current_user=Depends(require_roles(StaffRole.staff, StaffRole.owner)),
):
    menu = await service.update_quantity_of_dish_in_menu(db, menu_id, dish_id, quantity)
    return menu

@router.delete("/menus/menu_id/dishes/dish_id", response_model=List[schemas.DishInMenuResponse])
async def remove_dish_from_menu(
        menu_id: int,
        dish_id: int,
        db: Session = Depends(get_db),
        _current_user=Depends(require_roles(StaffRole.staff, StaffRole.owner)),
):
    menu = await service.remove_dish_from_menu(db, menu_id, dish_id)
    return menu


###-----------------------------------------------------------------------------------------------------------------





