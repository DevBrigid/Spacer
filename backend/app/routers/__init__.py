from .auth import router as auth
from .client import router as spacer
from .admin import router as admin
from .spaces import router as spaces
from .payments import router as payments
from .invoices import router as invoices

__all__ = ["auth", "spacer", "admin", "spaces", "payments", "invoices"]
