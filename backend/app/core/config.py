import os
import secrets

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    """Application settings."""

    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Articles API"

    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30

    # Database
    DATABASE_URL: str = "sqlite:///./articles.db"

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]  # Frontend URL

    # Email Settings (for future use)
    # SMTP_TLS: bool = True
    # SMTP_PORT: int | None = None
    # SMTP_HOST: str | None = None
    # SMTP_USER: str | None = None
    # SMTP_PASSWORD: str | None = None
    # EMAILS_FROM_EMAIL: str | None = None
    # EMAILS_FROM_NAME: str | None = None

    # First Superuser (get from env)
    FIRST_SUPERUSER_USERNAME: str = os.getenv("FIRST_SUPERUSER_USERNAME")
    FIRST_SUPERUSER_EMAIL: str = os.getenv("FIRST_SUPERUSER_EMAIL")
    FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD")

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
