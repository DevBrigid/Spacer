from fastapi import FastAPI
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI()
app.include_router(auth.router)

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

