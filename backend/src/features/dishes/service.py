from src.features.dishes import model
from src.features.dishes import schemas
from sqlalchemy.orm import Session
from fastapi import HTTPException


async def create_dish(db: Session, payload: schemas.DishCreate) -> model.Dish:
    try:
        exists = db.query(model.Dish).filter(
            model.Dish.name == payload.name
        ).first()

        if exists:
            raise HTTPException(status_code=400, detail="Dish with this name already exists")

        dish = model.Dish(
            name=payload.name,
            description=payload.description,
            dish_type=payload.dish_type,
            price=payload.price,
            is_available=payload.is_available,
            image_url=payload.image_url
        )
        db.add(dish)
        db.commit()
        db.refresh(dish)
        return dish
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create dish: {str(e)}")


async def get_dish(db: Session, dish_id: int) -> model.Dish:
    try:
        dish = db.query(model.Dish).filter(model.Dish.id == dish_id).first()
        if not dish:
            raise HTTPException(status_code=404, detail="Dish not found")
        return dish
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve dish: {str(e)}")


async def list_dishes(db: Session, dish_type=None) -> list[model.Dish]:
    try:
        query = db.query(model.Dish)

        if dish_type:
            query = query.filter(model.Dish.dish_type == dish_type)

        dishes = query.all()

        if not dishes:
            raise HTTPException(status_code=404, detail="No dishes found")

        return dishes
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list dishes: {str(e)}")


async def delete_dish(db: Session, dish_id: int):
    try:
        dish = db.query(model.Dish).filter(model.Dish.id == dish_id).first()
        if not dish:
            raise HTTPException(status_code=404, detail="Dish not found")
        db.delete(dish)
        db.commit()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete dish: {str(e)}")


async def update_dish(db: Session, dish_id: int, payload: schemas.DishUpdate) -> model.Dish:
    try:
        dish = db.query(model.Dish).filter(model.Dish.id == dish_id).first()
        if not dish:
            raise HTTPException(status_code=404, detail="Dish not found")

        if payload.name and payload.name != dish.name:
            exists = db.query(model.Dish).filter(
                model.Dish.name == payload.name,
                model.Dish.id != dish_id
            ).first()
            if exists:
                raise HTTPException(status_code=400, detail="Dish with this name already exists")

        for field, value in payload.dict(exclude_unset=True).items():
            setattr(dish, field, value)

        db.commit()
        db.refresh(dish)
        return dish
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update dish: {str(e)}")


async def toggle_dish_availability(db: Session, dish_id: int) -> model.Dish:
    try:
        dish = db.query(model.Dish).filter(model.Dish.id == dish_id).first()
        if not dish:
            raise HTTPException(status_code=404, detail="Dish not found")

        dish.is_available = not dish.is_available
        db.commit()
        db.refresh(dish)
        return dish
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle dish availability: {str(e)}")
