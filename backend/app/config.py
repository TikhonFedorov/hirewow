import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore',
    )
    DATABASE_URL: str = "postgresql://user:password@db:5432/appdb"
    JWT_SECRET: str = "+4l7uI|Qv*x={y6H`}CXs#`i}"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    EMAIL_ENABLED: bool = False

settings = Settings()