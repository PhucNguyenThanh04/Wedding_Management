from fastapi import APIRouter, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from src.core.database import get_db
from src.core.security import get_current_user
from src.features.staff.schemas import PasswordResetRequest, StaffResponse
from src.features.auth import service

router = APIRouter(prefix="/auth", tags=["Auth"])



class PasswordResetPayload(BaseModel):
    reset_token: str
    new_password: str


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    access_token, refresh_token = await service.login(
        db,
        form_data.username,
        form_data.password
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh")
async def refresh_token(refresh_token: str = Body(...), db: Session = Depends(get_db)):
    new_access, new_refresh = service.refresh_tokens(db, refresh_token)
    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer"
    }


@router.post("/logout")
async def logout(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return service.logout(db, current_user)


@router.post("/forgot-password")
async def forgot_password(
    payload: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    return await service.request_password_reset(db, payload.email)


@router.post("/reset-password")
async def reset_password(
    payload: PasswordResetPayload,
    db: Session = Depends(get_db)
):
    return service.reset_password(db, payload.reset_token, payload.new_password)


@router.get("/me", response_model=StaffResponse)
async def get_me(current_user=Depends(get_current_user)):
    return current_user

