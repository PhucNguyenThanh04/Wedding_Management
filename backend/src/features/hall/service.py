from src.features.hall import model
from src.features.hall import schemas
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date
from src.core.enums import EventShift
from src.features.order.model import Order


async def get_halls(db: Session) -> model.Hall:
    try:
        halls = db.query(model.Hall).all()
        if not halls:
            raise HTTPException(status_code=404, detail="Hall not found")
        return halls
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve halls: {str(e)}")


async def get_hall(db: Session, hall_id: int) -> model.Hall:
    try:
        hall = db.query(model.Hall).filter(model.Hall.id == hall_id).first()
        if not hall:
            raise HTTPException(status_code=404, detail="Hall not found")
        return hall
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve hall: {str(e)}")


async def create_hall(db: Session, payload: schemas.HallCreate) -> model.Hall:
    try:
        hall = model.Hall(
            name=payload.name,
            location=payload.location,
            capacity=payload.capacity,
            min_tables=payload.min_tables,
            max_tables=payload.max_tables,
            price_per_table=payload.price_per_table,
            is_available=payload.is_available,
            description=payload.description,
            image_url=payload.image_url
        )
        db.add(hall)
        db.commit()
        db.refresh(hall)
        return hall
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create hall: {str(e)}")


async def toggle_hall_availability(db: Session, hall_id: int) -> model.Hall:
    try:
        hall = db.query(model.Hall).filter(model.Hall.id == hall_id).first()
        if not hall:
            raise HTTPException(status_code=404, detail="Hall not found")

        hall.is_available = not hall.is_available
        db.commit()
        db.refresh(hall)
        return hall
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle hall availability: {str(e)}")


async def update_hall(db: Session, hall_id: int, payload: schemas.HallUpdate) -> model.Hall:
    try:
        hall = db.query(model.Hall).filter(model.Hall.id == hall_id).first()
        if not hall:
            raise HTTPException(status_code=404, detail="Hall not found")

        for field, value in payload.model_dump().items():
            setattr(hall, field, value)

        db.commit()
        db.refresh(hall)
        return hall
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update hall: {str(e)}")


async def delete_hall(db: Session, hall_id: int) -> None:
    try:
        hall = db.query(model.Hall).filter(model.Hall.id == hall_id).first()
        if not hall:
            raise HTTPException(status_code=404, detail="Hall not found")

        db.delete(hall)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete hall: {str(e)}")


async def get_available_halls(
        db: Session,
        event_date: date,
        event_shift: EventShift,
        min_tables: int
) -> list[model.Hall]:
    try:
        booked_hall_ids = db.query(Order.hall_id).filter(
            Order.event_date == event_date,
            Order.event_shift == event_shift
        ).subquery()

        # Lấy các sảnh available, đủ số bàn, và chưa được đặt
        available_halls = db.query(model.Hall).filter(
            model.Hall.is_available == True,
            model.Hall.min_tables <= min_tables,
            model.Hall.max_tables >= min_tables,
            model.Hall.id.notin_(booked_hall_ids)
        ).all()

        if not available_halls:
            raise HTTPException(status_code=404, detail="No available halls found")

        return available_halls
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve available halls: {str(e)}")

