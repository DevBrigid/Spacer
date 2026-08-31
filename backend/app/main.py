from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.config import settings
from app.routers import auth, spacer, admin, spaces, payments, invoices
from app.database import init_db, get_db

app = FastAPI()


@app.on_event("startup")
def on_startup():
    # Ensure DB tables exist for development
    try:
        init_db()
    except Exception:
        pass

app.include_router(auth)
app.include_router(spacer)
app.include_router(admin)
app.include_router(spaces)
app.include_router(payments)
app.include_router(invoices)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["health"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "detail": str(e)}