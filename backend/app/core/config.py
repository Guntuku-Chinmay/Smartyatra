from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SmartYatra API"
    app_version: str = "1.0.0"

    debug: bool = True

    host: str = "127.0.0.1"
    port: int = 8000

    api_prefix: str = "/api/v1"

    allowed_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
    )


settings = Settings()