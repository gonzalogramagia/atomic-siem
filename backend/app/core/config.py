from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Atomic SIEM"
    # Using SQLite for easier local dev without Docker for now
    DATABASE_URL: str = "sqlite+aiosqlite:///./atomic_siem.db"

    class Config:
        env_file = ".env"

settings = Settings()
