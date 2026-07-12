from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application
    app_name: str = "SmartYatra API"
    app_version: str = "1.0.0"
    debug: bool = True

    # Server
    host: str = "127.0.0.1"
    port: int = 8000
    api_prefix: str = "/api/v1"

    # CORS
    allowed_origins: str = "http://localhost:3000"

    # Database
    database_host: str
    database_port: int
    database_name: str
    database_user: str
    database_password: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
    )

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://"
            f"{self.database_user}:{self.database_password}"
            f"@{self.database_host}:{self.database_port}"
            f"/{self.database_name}"
        )


settings = Settings()