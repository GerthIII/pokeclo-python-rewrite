from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration, read from environment variables and .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: SecretStr
    sql_echo: bool = False
    cors_origins: list[str] = ["http://localhost:5173"]

    @field_validator("database_url")
    @classmethod
    def normalize_driver(cls, value: str) -> str:
        """Hosted providers hand you `postgres://`; SQLAlchemy wants a driver."""
        if value.startswith("postgres://"):
            value = value.replace("postgres://", "postgresql://", 1)
        if value.startswith("postgresql://"):
            value = value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value


settings = Settings()  # type: ignore[call-arg]
