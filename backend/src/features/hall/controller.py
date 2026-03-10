from fastapi import APIRouter, status, Depends
from src.features.hall import service, schemas
from typing import List
from src.core.security import require_roles
from src.core.database import get_db
from sqlalchemy.orm import Session
from src.core.enums import StaffRole
from datetime import date
from src.core.enums import EventShift

router = APIRouter(
    prefix='/hall',
    tags=['hall']
)


@router.get("/", response_model=schemas.HallListResponse)
async def get_halls(db: Session = Depends(get_db)):
    halls = await service.get_halls(db)

    return {
        "total": len(halls),
        "items": halls
    }


@router.get("/{hall_id}", response_model=schemas.HallResponse)
async def get_hall(
        hall_id: int,
        db: Session = Depends(get_db)
):
    hall = await service.get_hall(db, hall_id)
    return hall


@router.post("/", response_model=schemas.HallResponse, status_code=status.HTTP_201_CREATED)
async def create_hall(
        payload: schemas.HallCreate,
        db: Session = Depends(get_db),
        _current_owner=Depends(require_roles(StaffRole.owner, StaffRole.admin))
):
    hall = await service.create_hall(db, payload)
    return hall


@router.patch("/{hall_id}/availability", response_model=schemas.HallResponse)
async def toggle_hall_availability (
        hall_id: int,
        db: Session = Depends(get_db),
        _current_owner=Depends(require_roles(StaffRole.owner, StaffRole.admin))
):
    hall = await service.toggle_hall_availability(db, hall_id)
    return hall

@router.put("/{hall_id}", response_model=schemas.HallResponse)
async def update_hall(
        hall_id: int,
        payload: schemas.HallUpdate,
        db: Session = Depends(get_db),
        _current_owner=Depends(require_roles(StaffRole.owner, StaffRole.admin))
):
    hall = await service.update_hall(db, hall_id, payload)
    return hall

@router.delete("/{hall_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hall(
        hall_id: int,
        db: Session = Depends(get_db),
        _current_owner=Depends(require_roles(StaffRole.owner, StaffRole.admin))
):
    await service.delete_hall(db, hall_id)
    return None

@router.get("availability", response_model=List[schemas.HallResponse])
async def get_available_halls(
    event_date: date,
    shift: EventShift,
    min_tables: int,
    db: Session = Depends(get_db)
):
    halls = await service.get_available_halls(db, event_date, shift, min_tables)
    return halls
