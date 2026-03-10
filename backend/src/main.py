from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.utils.seed_owner import seed_owner, seed_admin
from src.core.config import setting
from src.core.database import create_tables, SessionLocal
import src.core.models

from src.api import register_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Startup")
    create_tables()

    db = SessionLocal()
    try:
        seed_owner(db)
        seed_admin(db)
    finally:
        db.close()
        yield
    print("Shutdown")

app = FastAPI(
    title="Wedding Managements API",
    description="A simple API",
    version="1.0.0",
    lifespan=lifespan
)

# parse CORS_ORIGINS (env provides comma-separated string)
origins = []
if isinstance(setting.CORS_ORIGINS, str):
    origins = [o.strip() for o in setting.CORS_ORIGINS.split(",") if o.strip()]
else:
    origins = setting.CORS_ORIGINS or []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
register_routes(app=app)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Wedding Management API!"}
