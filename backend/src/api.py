from fastapi import FastAPI
from src.features.auth.controller import router as auth_router
from src.features.staff.controller import router as staff_router
from src.features.customer.controller import router as customer_router
from src.features.hall.controller import router as hall_router
from src.features.upload.router import router as upload_router
from src.features.menus.controller import router as menus_router
from src.features.dishes.controller import router as dishes_router
from src.features.order.controller import router as order_router


def register_routes(app: FastAPI):
    app.include_router(auth_router)
    app.include_router(staff_router)
    app.include_router(customer_router)
    app.include_router(hall_router)
    app.include_router(dishes_router)
    app.include_router(menus_router)
    app.include_router(order_router)


    app.include_router(upload_router)








