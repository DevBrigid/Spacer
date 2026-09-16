from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.config import settings
from app.routers import auth, spacer, admin, spaces, payments, invoices
from app.database import init_db, get_db

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


@app.get("/", response_class=HTMLResponse, tags=["landing"])
def landing_page():
    return """
    <html>
        <head>
            <title>Spacer API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 3rem; background: #f5f7fb; color: #1f2937; }
                .card { max-width: 720px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
                a { color: #2563eb; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Welcome to Spacer</h1>
                <p>Your booking and spaces API is up and running.</p>
                <p><a href="/docs">Open API docs</a> or <a href="/health">check health</a>.</p>
            </div>
        </body>
    </html>
    """

@app.get("/health", tags=["health"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "detail": str(e)}