from functools import lru_cache
from pathlib import Path

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Always load .env from the project root regardless of working directory
_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"
_PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    app_env: str = "development"
    project_name: str = "Job Board API"
    api_v1_prefix: str = "/api/v1"

    backend_cors_origins: str = "http://localhost:3000"

    database_url: str = "postgresql+psycopg://jobboard:jobboard@localhost:5433/jobboard"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30

    upload_dir: str = "backend/uploads"
    upload_url_prefix: str = "/uploads"
    upload_max_bytes: int = 5 * 1024 * 1024

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from_email: str = ""
    smtp_use_tls: bool = True

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @model_validator(mode="after")
    def validate_production(self) -> "Settings":
        if self.app_env == "production":
            if self.jwt_secret == "change-me":
                raise ValueError("JWT_SECRET must be changed from the default value in production")
            if len(self.jwt_secret) < 32:
                raise ValueError("JWT_SECRET must be at least 32 characters in production")
        return self

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]

    @property
    def upload_dir_absolute(self) -> Path:
        path = Path(self.upload_dir)
        return path if path.is_absolute() else _PROJECT_ROOT / path


@lru_cache
def get_settings() -> Settings:
    return Settings()
