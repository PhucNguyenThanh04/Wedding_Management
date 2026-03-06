from src.features.staff.model import Staff
from sqlalchemy.orm import Session
from src.core.enums import StaffRole
from src.core.security import hash_password


def seed_owner(db: Session):
    existing_owner = db.query(Staff).filter(
        Staff.role == StaffRole.owner
    ).first()

    if existing_owner:
        print("Owner already exists")
        return

    owner = Staff(
        username="owner",
        email="owner@gmail.com",
        full_name="System Owner",
        phone="0123456789",
        password_hash=hash_password("Owner@123"),
        role=StaffRole.owner,
        is_active=True
    )

    db.add(owner)
    db.commit()
    print("Owner account created successfully")