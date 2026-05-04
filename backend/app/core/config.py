from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    project_name: str = "Job Board API"
    api_v1_prefix: str = "/api/v1"

    backend_cors_origins: str = "http://localhost:3000"

    database_url: str = "postgresql+psycopg://jobboard:jobboard@localhost:5432/jobboard"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30

    upload_dir: str = "backend/uploads"
    upload_url_prefix: str = "/uploads"
    upload_max_bytes: int = 5 * 1024 * 1024

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
