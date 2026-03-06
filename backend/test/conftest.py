"""
Shared test fixtures for Wedding Management API tests.
Uses SQLite in-memory database for fast isolated tests.
"""
import pytest
from unittest.mock import patch
from datetime import date, time
from decimal import Decimal
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, StaticPool, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.compiler import compiles

from src.core.database import Base, get_db
from src.core.enums import (
    StaffRole, EventShift, EventType, OrderStatus,
    PaymentMethod, PaymentStatus, DishType
)
from src.core.security import hash_password, create_access_token
from src.main import app

# ── In-memory SQLite for tests ─────────────────────────────────────────
TEST_DATABASE_URL = "sqlite://"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Enable foreign key support in SQLite
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# Make PostgreSQL UUID type work with SQLite (renders as CHAR(32))
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

@compiles(PG_UUID, "sqlite")
def compile_pg_uuid_for_sqlite(type_, compiler, **kw):
    return "CHAR(32)"

TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


# ── Fixtures ────────────────────────────────────────────────────────────

@pytest.fixture(autouse=True)
def setup_database():
    """Create all tables before each test, drop after."""
    import src.core.models  # noqa: F401 — register all models with Base
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db():
    """Provide a transactional DB session for tests."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db):
    """
    TestClient that:
    1. Overrides get_db so API uses the test SQLite session
    2. Patches lifespan helpers so startup doesn't touch the real DB
    """

    def _override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db

    # Patch create_tables and seed_owner so the lifespan is a no-op
    with patch("src.main.create_tables"), \
         patch("src.main.seed_owner"), \
         patch("src.main.SessionLocal", return_value=db):
        with TestClient(app) as c:
            yield c

    app.dependency_overrides.clear()


# ── Helper: create staff in DB and return auth header ───────────────────

def _create_staff(db, role: StaffRole, **overrides):
    from src.features.staff.model import Staff

    staff_id = overrides.pop("id", uuid4())
    defaults = dict(
        id=staff_id,
        username=f"user_{staff_id.hex[:8]}",
        email=f"{staff_id.hex[:8]}@test.com",
        full_name="Test User",
        password_hash=hash_password("Test1234"),
        role=role,
        is_active=True,
    )
    defaults.update(overrides)
    staff = Staff(**defaults)
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return staff


def _auth_header(staff) -> dict:
    token = create_access_token(str(staff.id), staff.role.value)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def owner(db):
    return _create_staff(db, StaffRole.owner, username="owner", email="owner@test.com", full_name="Owner")


@pytest.fixture()
def staff_user(db):
    return _create_staff(db, StaffRole.staff, username="staff1", email="staff1@test.com", full_name="Staff One")


@pytest.fixture()
def owner_headers(owner):
    return _auth_header(owner)


@pytest.fixture()
def staff_headers(staff_user):
    return _auth_header(staff_user)


# ── Seed helpers ────────────────────────────────────────────────────────

@pytest.fixture()
def sample_customer(db):
    from src.features.customer.model import Customer
    c = Customer(
        full_name="Nguyen Van A",
        phone="0912345678",
        email="nva@test.com",
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@pytest.fixture()
def sample_hall(db):
    from src.features.hall.model import Hall
    h = Hall(
        name="Grand Hall",
        location="Floor 1",
        capacity=200,
        min_tables=5,
        max_tables=50,
        price_per_table=Decimal("500000"),
        is_available=True,
    )
    db.add(h)
    db.commit()
    db.refresh(h)
    return h


@pytest.fixture()
def sample_dish(db):
    from src.features.dishes.model import Dish
    d = Dish(
        name="Grilled Lobster",
        description="Fresh lobster",
        dish_type=DishType.main_course,
        price=Decimal("350000"),
        is_available=True,
    )
    db.add(d)
    db.commit()
    db.refresh(d)
    return d


@pytest.fixture()
def sample_menu(db):
    from src.features.menus.model import Menu
    m = Menu(
        name="Wedding Premium",
        description="Premium wedding menu",
        price=Decimal("5000000"),
        min_guests=50,
        category=EventType.wedding,
        is_active=True,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


@pytest.fixture()
def sample_order(db, sample_customer, sample_hall, staff_user):
    from src.features.order.model import Order
    o = Order(
        customer_id=sample_customer.id,
        hall_id=sample_hall.id,
        created_by_staff_id=staff_user.id,
        event_date=date(2026, 6, 15),
        event_shift=EventShift.EVENING,
        event_time=time(18, 0),
        event_type=EventType.wedding,
        so_ban=20,
        menu_total=Decimal("0"),
        extra_dishes_total=Decimal("0"),
        table_total=Decimal("10000000"),
        subtotal=Decimal("10000000"),
        tax_amount=Decimal("1000000"),
        total_amount=Decimal("11000000"),
        status=OrderStatus.booking_pending,
    )
    db.add(o)
    db.commit()
    db.refresh(o)
    return o


@pytest.fixture()
def confirmed_order(db, sample_order):
    """An order in confirmed state."""
    sample_order.status = OrderStatus.confirmed
    db.commit()
    db.refresh(sample_order)
    return sample_order


@pytest.fixture()
def sample_payment(db, confirmed_order):
    from src.features.payment.model import Payment
    p = Payment(
        order_id=confirmed_order.id,
        order_total=confirmed_order.total_amount,
        paid_amount=Decimal("0"),
        remaining_amount=confirmed_order.total_amount,
        status=PaymentStatus.pending,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p
