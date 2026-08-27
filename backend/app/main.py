from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, spacer, admin, bookings, spaces, payments
from app.database import init_db

app = FastAPI()


@app.on_event("startup")
def on_startup():
    # Ensure DB tables exist for development / smoke tests
    try:
        init_db()
    except Exception:
        pass
app.include_router(auth)
app.include_router(spacer)
app.include_router(admin)
app.include_router(bookings)
app.include_router(spaces)
app.include_router(payments)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Spacer backend running"}

