"""Compatibility shim: expose app.models.* as top-level `models.*` modules.

This allows older-style imports like `from models.user import User` to continue
working in tests and scripts without changing many import sites.
"""
import importlib
import sys

_submodules = [
    "admin",
    "booking",
    "invoice",
    "payment",
    "space",
    "user",
]

for name in _submodules:
    app_name = f"app.models.{name}"
    target = f"models.{name}"
    try:
        mod = importlib.import_module(app_name)
        sys.modules[target] = mod
    except Exception:
        # if import fails, skip; tests that rely on that model will surface errors
        pass
