from typing import List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from src.features.customer import model, schemas


async def get_customers(db: Session) -> List[model.Customer]:
    try:
        customers = db.query(model.Customer).all()
        if not customers:
            raise HTTPException(status_code=404, detail="Customers not found")
        return customers
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve customers: {str(e)}")


async def create_customer(db: Session, payload: schemas.CustomerCreate) -> model.Customer:
    try:
        # uniqueness checks
        exists = db.query(model.Customer).filter(
            or_(
                model.Customer.email == payload.email,
                model.Customer.phone == payload.phone if payload.phone else False
            )
        ).first()
        if exists:
            raise HTTPException(status_code=400, detail="email/phone already exists")

        customer = model.Customer(
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone,
            address=payload.address

        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create customer: {str(e)}")


async def get_customer(db: Session, customer_id: int) -> model.Customer:
    try:
        customer = db.query(model.Customer).filter(model.Customer.id == customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve customer: {str(e)}")


async def get_customer_by_phone(db: Session, phone: str) -> model.Customer:
    try:
        customer = db.query(model.Customer).filter(model.Customer.phone == phone).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve customer by phone: {str(e)}")


async def update_customer(db: Session, customer_id: int, payload: schemas.CustomerUpdate) -> model.Customer:
    try:
        customer = db.query(model.Customer).filter(model.Customer.id == customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        exists = db.query(model.Customer).filter(
            or_(
                model.Customer.email == payload.email,
                model.Customer.phone == payload.phone if payload.phone else False
            )
        ).first()
        if exists and exists.id != customer_id:
            raise HTTPException(status_code=400, detail="email/phone already exists")

        customer.full_name = payload.full_name or customer.full_name
        customer.email = payload.email or customer.email
        customer.phone = payload.phone or customer.phone
        customer.address = payload.address or customer.address
        customer.note = payload.note or customer.note

        db.commit()
        db.refresh(customer)
        return customer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update customer: {str(e)}")


async def get_orders_by_customer(db, customer_id: int):
    try:
        customer = db.query(model.Customer).filter(
            model.Customer.id == customer_id
        ).first()

        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        return customer.orders
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve orders by customer: {str(e)}")
