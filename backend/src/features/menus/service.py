from decimal import Decimal

from src.features.menus import schemas
from src.features.menus import model
from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.features.dishes import model as dish_model
from src.features.menu_dish import model as model_menudish


def _build_dishes_response(menu: model.Menu) -> list[dict]:
    result = []
    for md in menu.menu_dishes:
        dish = md.dish
        result.append({
            "id": dish.id,
            "name": dish.name,
            "description": dish.description,
            "dish_type": dish.dish_type,
            "price": float(dish.price),
            "is_available": dish.is_available,
            "image_url": dish.image_url,
            "quantity": md.quantity,
            "created_at": dish.created_at,
            "updated_at": dish.updated_at,
            "deleted_at": dish.deleted_at,
        })
    return result

async def create_menu(db: Session, payload) -> model.Menu:
    try:
        exists = db.query(model.Menu).filter(model.Menu.name == payload.name).first()
        if exists:
            raise HTTPException(status_code=400, detail="Menu name already exists")

        menu = model.Menu(
            name=payload.name,
            description=payload.description,
            min_guests=payload.min_guests,
            category=payload.category,
            is_active=payload.is_active,
            image_url=payload.image_url
        )

        try:
            db.add(menu)
            db.commit()
            db.refresh(menu)
            return menu
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to create menu: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create menu: {str(e)}")


async def get_menu(db: Session, menu_id: int) -> dict:
    try:
        menu = db.query(model.Menu).filter(model.Menu.id == menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")

        return {
            "id": menu.id,
            "name": menu.name,
            "description": menu.description,
            "price": float(menu.price or 0),
            "min_guests": menu.min_guests,
            "category": menu.category,
            "is_active": menu.is_active,
            "image_url": menu.image_url,
            "created_at": menu.created_at,
            "updated_at": menu.updated_at,
            "deleted_at": menu.deleted_at,
            "dishes": _build_dishes_response(menu),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve menu: {str(e)}")


async def get_menus(db: Session, category) -> list[model.Menu]:
    try:
        query = db.query(model.Menu)
        if category:
            query = query.filter(model.Menu.category == category)
        menus = query.all()
        if not menus:
            raise HTTPException(status_code=404, detail="No menus found")
        return menus
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list menus: {str(e)}")


async def update_menu(db: Session, menu_id: int, payload: schemas.MenuUpdate) -> model.Menu:
    try:
        menu = db.query(model.Menu).filter(model.Menu.id == menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")

        for field, value in payload.dict(exclude_unset=True).items():
            setattr(menu, field, value)

        try:
            db.commit()
            db.refresh(menu)
            return menu
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to update menu: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update menu: {str(e)}")


async def delete_menu(db: Session, menu_id: int):
    try :
        menu = db.query(model.Menu).filter(model.Menu.id == menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")

        try:
            db.delete(menu)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to delete menu: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete menu: {str(e)}")


async def toggle_menu_is_active(db: Session, menu_id: int) -> model.Menu:
    try:
        menu = db.query(model.Menu).filter(model.Menu.id == menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")

        menu.is_active = not menu.is_active

        try:
            db.commit()
            db.refresh(menu)
            return menu
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to toggle menu availability: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle menu availability: {str(e)}")

#menudish  =========================================================================================================\


async def add_dishes_to_menu(
    db: Session,
    menu_id: int,
    dish_ids: list[int]
):
    try:
        menu = db.query(model.Menu).filter(model.Menu.id == menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")

        unique_dish_ids = list(set(dish_ids))

        dishes = db.query(dish_model.Dish).filter(
            dish_model.Dish.id.in_(unique_dish_ids)
        ).all()

        if len(dishes) != len(unique_dish_ids):
            raise HTTPException(status_code=404, detail="One or more dishes not found")

        existing_map = {md.dish_id: md for md in menu.menu_dishes}

        added_price = Decimal("0")
        for dish in dishes:
            if dish.id in existing_map:
                existing_map[dish.id].quantity += 1
                added_price += dish.price
            else:
                db.add(
                    model_menudish.MenuDish(
                        menu_id=menu.id,
                        dish_id=dish.id
                    )
                )
                added_price += dish.price

        menu.price = (menu.price or Decimal("0")) + added_price

        try:
            db.commit()
            db.refresh(menu)
            return _build_dishes_response(menu)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to add dishes to menu: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add dishes to menu: {str(e)}")


async def get_dishes_in_menu(db: Session, menu_id: int):
    try:
        menu = db.query(model.Menu).filter(model.Menu.id == menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")

        return _build_dishes_response(menu)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dishes in menu: {str(e)}")

async def update_quantity_of_dish_in_menu(
        db: Session,
        menu_id: int,
        dish_id: int,
        quantity: int
):
    try:
        menu_dish = db.query(model_menudish.MenuDish).filter(
            model_menudish.MenuDish.menu_id == menu_id,
            model_menudish.MenuDish.dish_id == dish_id
        ).first()

        if not menu_dish:
            raise HTTPException(status_code=404, detail="Dish not found in menu")

        old_quantity = menu_dish.quantity
        menu_dish.quantity = quantity

        # Cập nhật menu.price theo chênh lệch quantity
        diff = quantity - old_quantity
        dish_price = menu_dish.dish.price
        menu = menu_dish.menu
        menu.price = (menu.price or Decimal("0")) + dish_price * diff

        try:
            db.commit()
            db.refresh(menu)
            return _build_dishes_response(menu)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to update dish quantity in menu: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update dish quantity in menu: {str(e)}")


async def remove_dish_from_menu(db: Session, menu_id: int, dish_id: int):
    try:
        menu_dish = db.query(model_menudish.MenuDish).filter(
            model_menudish.MenuDish.menu_id == menu_id,
            model_menudish.MenuDish.dish_id == dish_id
        ).first()

        if not menu_dish:
            raise HTTPException(status_code=404, detail="Dish not found in menu")

        # Trừ giá món * số lượng khỏi menu.price
        removed_price = menu_dish.dish.price * menu_dish.quantity
        menu = db.query(model.Menu).filter(model.Menu.id == menu_id).first()
        menu.price = max(Decimal("0"), (menu.price or Decimal("0")) - removed_price)

        try:
            db.delete(menu_dish)
            db.commit()
            db.refresh(menu)
            return _build_dishes_response(menu)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to remove dish from menu: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove dish from menu: {str(e)}")
