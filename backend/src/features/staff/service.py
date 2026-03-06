import uuid
from typing import List
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import or_

from src.features.staff import schemas
from src.features.staff import model
from src.core.enums import StaffRole
from src.core.security import hash_password


# def create_staff(db: Session, payload: schemas.CreateStaffRequest) -> model.Staff:
#     # uniqueness checks
#     exists = db.query(model.Staff).filter(
#         or_(
#             model.Staff.username == payload.username,
#             model.Staff.email == payload.email,
#             model.Staff.phone == payload.phone if payload.phone else False
#         )
#     ).first()
#     if exists:
#         raise HTTPException(status_code=400, detail="username/email/phone already exists")
#
#     try:
#         role = StaffRole(payload.role) if payload.role else StaffRole.staff
#     except ValueError:
#         raise HTTPException(status_code=400, detail=f"Invalid role. Allowed: {[r.value for r in StaffRole]}")
#
#     hashed = hash_password(payload.password)
#
#     staff = model.Staff(
#         username=payload.username,
#         email=payload.email,
#         full_name=payload.full_name,
#         phone=payload.phone,
#         password_hash=hashed,
#         role=role,
#     )
#     db.add(staff)
#     db.commit()
#     db.refresh(staff)
#     return staff
async def create_staff(db: Session, payload: schemas.CreateStaffRequest) -> model.Staff:
    try:
        # uniqueness checks
        exists = db.query(model.Staff).filter(
            or_(
                model.Staff.username == payload.username,
                model.Staff.email == payload.email,
                model.Staff.phone == payload.phone if payload.phone else False
            )
        ).first()
        if exists:
            raise HTTPException(status_code=400, detail="username/email/phone already exists")

        try:
            role = StaffRole(payload.role) if payload.role else StaffRole.staff
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid role. Allowed: {[r.value for r in StaffRole]}")

        hashed = hash_password(payload.password)

        staff = model.Staff(
            username=payload.username,
            email=payload.email,
            full_name=payload.full_name,
            phone=payload.phone,
            password_hash=hashed,
            role=role,
        )
        db.add(staff)
        db.commit()
        db.refresh(staff)
        return staff

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error: duplicate entry or constraint violation")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create staff: {str(e)}")


async def get_staff(db: Session, id_staff: uuid.uuid4()) -> model.Staff:
    try:
        staff = db.query(model.Staff).filter(model.Staff.id == id_staff and model.Staff.role == "staff").first()
        if not staff:
            raise HTTPException(status_code=404, detail="Staff not found")
        return staff
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve staff: {str(e)}")


async def list_staff(db: Session) -> List[model.Staff]:
    try:
        staff = db.query(model.Staff).filter(model.Staff.role == "staff").all()
        if not staff:
            raise HTTPException(status_code=404, detail="Staff not found")
        return staff
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list staff: {str(e)}")
