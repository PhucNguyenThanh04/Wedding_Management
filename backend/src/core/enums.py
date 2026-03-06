import enum


class StaffRole(str, enum.Enum):
    admin = "admin"
    owner = "owner"
    staff = "staff"
    customer = "customer"


class EventShift(str, enum.Enum):
    MORNING = "MORNING"      # 07:00 – 11:00
    LUNCH = "LUNCH"          # 11:00 – 14:00
    AFTERNOON = "AFTERNOON"  # 14:00 – 17:00
    EVENING = "EVENING"      # 17:00 – 22:00


class EventType(str, enum.Enum):
    wedding = "wedding"
    birthday = "birthday"
    corporate = "corporate"
    anniversary = "anniversary"
    other = "other"


class DishType(str, enum.Enum):
    appetizer = "appetizer"
    soup = "soup"
    main_course = "main_course"
    side_dish = "side_dish"
    dessert = "dessert"
    beverage = "beverage"


class OrderStatus(str, enum.Enum):
    booking_pending = "booking_pending"
    confirmed = "confirmed"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"
    invoiced = "invoiced"


class PaymentMethod(str, enum.Enum):
    cash = "cash"
    card = "card"
    bank_transfer = "bank_transfer"
    e_wallet = "e_wallet"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    deposit_paid = "deposit_paid"
    partial_paid = "partial_paid"
    fully_paid = "fully_paid"
    refunded = "refunded"