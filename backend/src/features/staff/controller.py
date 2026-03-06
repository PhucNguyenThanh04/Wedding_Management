from fastapi import APIRouter, Depends, Body, status
from sqlalchemy.orm import Session

from src.features.staff import schemas, service
from src.core.database import get_db
from src.core.enums import StaffRole
from src.core.security import require_roles

router = APIRouter(
    prefix='/staff',
    tags=['staff']
)


@router.post("/", response_model=schemas.StaffResponse, status_code=status.HTTP_201_CREATED)
async def create_staff(
    payload: schemas.CreateStaffRequest = Body(...),
    db: Session = Depends(get_db),
    _current_owner=Depends(require_roles(StaffRole.owner))
):
    staff = await service.create_staff(db, payload)
    return staff


@router.get("/{id_staff}", response_model=schemas.StaffResponse)
async def get_staff(
    id_staff: str,
    db: Session = Depends(get_db),
    _current_owner=Depends(require_roles(StaffRole.owner))
):
    try:
        staff = await service.get_staff(db, id_staff)
        return staff
    except Exception as e:
        raise
@router.get("/", response_model=list[schemas.StaffResponse])
async def list_staff(
    db: Session = Depends(get_db),
    _current_owner=Depends(require_roles(StaffRole.owner))
):
    staff_list = await service.list_staff(db)
    return staff_list

# @router.delete(f"/{id_staff}", status_code=status.HTTP_204_NO_CONTENT)

