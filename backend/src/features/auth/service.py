from typing import Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_
from src.features.staff import model
from src.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from fastapi import HTTPException
from src.core.email import send_email  # Assuming you have an email utility
import uuid





def login(db: Session, identifier: str, password: str) -> Tuple[str, str]:
    try:
        user = db.query(model.Staff).filter(
            or_(model.Staff.username == identifier, model.Staff.email == identifier)
        ).first()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not user.is_active:
            raise HTTPException(status_code=403, detail="User inactive")

        if not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token = create_access_token(str(user.id), user.role)
        refresh_token = create_refresh_token(str(user.id))

        # store hashed refresh token
        user.refresh_token_hash = hash_password(refresh_token)
        db.add(user)
        db.commit()
        db.refresh(user)

        return access_token, refresh_token
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to login: {str(e)}")


def refresh_tokens(db: Session, refresh_token: str) -> Tuple[str, str]:
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid refresh token payload")

        user = db.query(model.Staff).filter(model.Staff.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        if not user.refresh_token_hash or not verify_password(refresh_token, user.refresh_token_hash):
            raise HTTPException(status_code=401, detail="Refresh token revoked or invalid")

        # issue new tokens
        new_access = create_access_token(str(user.id), user.role)
        new_refresh = create_refresh_token(str(user.id))

        # rotate refresh token
        user.refresh_token_hash = hash_password(new_refresh)
        db.add(user)
        db.commit()
        db.refresh(user)

        return new_access, new_refresh
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refresh tokens: {str(e)}")


def logout(db: Session, user: model.Staff):
    try:
        user.refresh_token_hash = None
        db.add(user)
        db.commit()
        return {"detail": "Logged out"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to logout: {str(e)}")


async def request_password_reset(db: Session, email: str):
    try:
        user = db.query(model.Staff).filter(model.Staff.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User with this email not found")

        reset_token = str(uuid.uuid4())  # Generate a unique token
        user.reset_token = reset_token
        db.add(user)
        db.commit()

        # Send email with the reset token
        send_email(
            to=email,
            subject="Password Reset Request",
            body=f"Use this token to reset your password: {reset_token}"
        )
        return {"detail": "Password reset email sent"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to request password reset: {str(e)}")


def reset_password(db: Session, reset_token: str, new_password: str):
    try:
        user = db.query(model.Staff).filter(model.Staff.reset_token == reset_token).first()
        if not user:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")

        user.password_hash = hash_password(new_password)
        user.reset_token = None  # Clear the reset token
        db.add(user)
        db.commit()
        return {"detail": "Password reset successful"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset password: {str(e)}")
