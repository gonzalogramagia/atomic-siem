from fastapi import FastAPI
from app.api.endpoints import logs, auth
from app.core.db import init_db

app = FastAPI(title="Atomic SIEM API", version="0.1.0")

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(logs.router, prefix="/api/v1/logs", tags=["logs"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Atomic SIEM API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
