from .auth import router as auth
from .client import router as spacer
from .admin import router as admin
from .bookings import router as bookings
from .spaces import router as spaces
from .payments import router as payments

__all__ = ["auth", "spacer", "admin", "bookings", "spaces", "payments"]
