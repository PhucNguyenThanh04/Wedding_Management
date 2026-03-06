from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.enums import OrderStatus, StaffRole
from src.core.security import require_roles
from src.features.oder import service, schemas
from typing import Optional
from datetime import date
from src.features.staff.model import Staff
from src.core.enums import EventType
from src.features.oder_menu import schemas as schemas_oder_menu
from src.features.oder_items import service as service_oder_items
from src.features.oder_items import schemas as schemas_oder_items



router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)
@router.get("/", response_model=list[schemas.OrderResponse])
async def list_orders(
    status: Optional[OrderStatus] = Query(None),
    date: Optional[date] = Query(None),
    event_type: Optional[EventType] = Query(None),
    db: Session = Depends(get_db),
    _current_staff: Staff = Depends(require_roles(
        StaffRole.owner,
    ))
):
    orders = await service.list_orders(db, status, date, event_type)
    return orders



@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.OrderResponse)
async def create_order(
        payload: schemas.OrderCreate,
        db: Session = Depends(get_db),
        _current_staff = Depends(require_roles(StaffRole.staff))
) -> schemas.OrderResponse:
    oder = await service.create_order(db, payload, _current_staff)
    return oder

@router.get("/{order_id}", response_model=schemas.OrderResponse)
async def get_oder(
        order_id: int,
        db: Session = Depends(get_db),
        _current_staff = Depends(require_roles(StaffRole.staff, StaffRole.owner))
) -> schemas.OrderResponse:
    oder = await service.get_order_by_id(db, order_id)
    if not oder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return oder


@router.put("/{order_id}", response_model=schemas.OrderResponse)
async def update_order(
        order_id: int,
        payload: schemas.OrderUpdate,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.staff))
) -> schemas.OrderResponse:
    oder = await service.update_order(db, order_id, payload, _current_staff)
    if not oder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return oder

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_order(
        order_id: int,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.owner))
):
    success = await service.cancel_order(db, order_id, _current_staff)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")


@router.post("/{order_id}/confirm", response_model=schemas.OrderResponse)
async def confirm_order(
        order_id: int,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.owner))
) -> schemas.OrderResponse:
    oder = await service.confirm_order(db, order_id, _current_staff)
    if not oder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return oder

@router.post("/{order_id}/complete", response_model=schemas.OrderResponse)
async def complete_order(
        order_id: int,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.owner))
) -> schemas.OrderResponse:
    oder = await service.complete_order(db, order_id, _current_staff)
    if not oder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return oder

@router.post(("/{order_id}/in_process"), response_model=schemas.OrderResponse)
async def in_process_order(
        order_id: int,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.owner))
) -> schemas.OrderResponse:
    oder = await service.in_process_order(db, order_id, _current_staff)
    if not oder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return oder


@router.post("/{order_id}/completed", response_model=schemas.OrderResponse)
async def completed_order(
        order_id: int,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.owner))
) -> schemas.OrderResponse:
    oder = await service.completed_order(db, order_id, _current_staff)
    if not oder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return oder


# order menu =======================================================================================

@router.post("/{order_id}/menus", response_model=schemas.OrderResponse)
async def add_menu_to_order(
        order_id: int,
        payload: schemas_oder_menu.OrderMenuCreate ,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.staff))
) -> schemas.OrderResponse:
    oder = await service.add_menu_to_order(db, order_id, payload, _current_staff)
    if not oder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return oder




@router.put("/{order_id}/menus/{ordermenu_id}", status_code=status.HTTP_200_OK, response_model=schemas.OrderResponse)
async def update_menu_in_order(
        order_id: int,
        ordermenu_id: int,
        payload: schemas_oder_menu.OrderMenuUpdate,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.staff))
) -> schemas.OrderResponse:
    oder = await service.update_menu_in_order(db, order_id, ordermenu_id, payload, _current_staff)
    if not oder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order or OrderMenu not found")
    return oder


@router.delete("/{order_id}/menus/{ordermenu_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_menu_from_order(
        order_id: int,
        ordermenu_id: int,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.staff))
):
    success = await service.remove_menu_from_order(db, order_id, ordermenu_id, _current_staff)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order or OrderMenu not found")


# order items (món tự chọn - tuchon) ================================================================

@router.post("/{order_id}/dishes", response_model=schemas.OrderResponse)
async def add_dish_to_order(
        order_id: int,
        payload: schemas_oder_items.OrderItemCreate,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.staff))
) -> schemas.OrderResponse:
    order = await service_oder_items.add_dish_to_order(db, order_id, payload, _current_staff)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.put("/{order_id}/dishes/{order_item_id}", status_code=status.HTTP_200_OK, response_model=schemas.OrderResponse)
async def update_dish_in_order(
        order_id: int,
        order_item_id: int,
        payload: schemas_oder_items.OrderItemUpdate,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.staff))
) -> schemas.OrderResponse:
    order = await service_oder_items.update_dish_in_order(db, order_id, order_item_id, payload, _current_staff)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order or OrderItem not found")
    return order


@router.delete("/{order_id}/dishes/{order_item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_dish_from_order(
        order_id: int,
        order_item_id: int,
        db: Session = Depends(get_db),
        _current_staff=Depends(require_roles(StaffRole.staff))
):
    success = await service_oder_items.remove_dish_from_order(db, order_id, order_item_id, _current_staff)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order or OrderItem not found")




