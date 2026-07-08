"""
Centralized configuration loaded from environment variables.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

# Load .env from the server directory
_env_path = Path(__file__).parent / ".env"
load_dotenv(_env_path)


class Settings:
    """Application settings — all sourced from environment variables."""

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_HOURS: int = int(os.getenv("JWT_EXPIRE_HOURS", "24"))

    # SMTP / Email
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@quadrantitservices.com")

    # App
    ALLOWED_EMAIL_DOMAIN: str = os.getenv("ALLOWED_EMAIL_DOMAIN", "quadrantitservices.com")
    DEV_MODE: bool = os.getenv("DEV_MODE", "true").lower() in ("true", "1", "yes")

    # OTP
    OTP_EXPIRE_MINUTES: int = 10
    OTP_LENGTH: int = 6


settings = Settings()
