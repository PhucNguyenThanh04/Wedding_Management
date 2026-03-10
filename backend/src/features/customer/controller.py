from fastapi import APIRouter, status, Depends
from src.features.customer import service, schemas
from typing import List
from src.core.enums import StaffRole
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.security import get_current_user, require_roles
from src.features.order import schemas as order_schemas

router = APIRouter(
    prefix='/customer',
    tags=['customer']
)


@router.get("/", response_model=List[schemas.CustomerResponse])
async def get_customers(
        db: Session = Depends(get_db),
        _current_user=Depends(get_current_user)
):
    list_customers = await service.get_customers(db)
    return list_customers


@router.post("/", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
        customer: schemas.CustomerCreate,
        db: Session = Depends(get_db),
        _current_user=Depends(require_roles(StaffRole.staff, StaffRole.admin))
):
    new_customer = await service.create_customer(db, customer)
    return new_customer


@router.get("/phone/{phone}", response_model=schemas.CustomerResponse)
async def get_customer_by_phone(
        phone: str,
        db: Session = Depends(get_db)
):
    customer = await service.get_customer_by_phone(db, phone)
    return customer


@router.get("/{customer_id}", response_model=schemas.CustomerResponse)
async def get_customer(
        customer_id: int,
        db: Session = Depends(get_db),
        _current_user=Depends(get_current_user)
):
    customer = await service.get_customer(db, customer_id)
    return customer


@router.put("/{customer_id}", response_model=schemas.CustomerResponse)
async def update_customer(
        customer_id: int,
        payload: schemas.CustomerUpdate,
        db: Session = Depends(get_db),
        _current_user=Depends(require_roles(StaffRole.staff, StaffRole.admin))
):
    customer = await service.update_customer(db, customer_id, payload)
    return customer


@router.get("/{customer_id}/orders", response_model=list[order_schemas.OrderResponse])
async def get_customer_orders(
    customer_id: int,
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user)
):
    oder_by_id = await service.get_orders_by_customer(db, customer_id)
    return oder_by_id
