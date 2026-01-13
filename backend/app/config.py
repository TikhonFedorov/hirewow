from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore',
    )
    # Required settings - no defaults for security
    DATABASE_URL: str = Field(..., description="PostgreSQL database URL")
    JWT_SECRET: str = Field(..., min_length=32, description="JWT secret key (minimum 32 characters)")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    EMAIL_ENABLED: bool = False
    # CORS origins - comma-separated string from env, or default list
    CORS_ORIGINS: str = "https://hirewow.tech,https://www.hirewow.tech,http://localhost:80,http://localhost"
    
    @field_validator('JWT_SECRET')
    @classmethod
    def validate_jwt_secret(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError('JWT_SECRET must be at least 32 characters long')
        return v
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse comma-separated CORS origins string into list"""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return self.CORS_ORIGINS if isinstance(self.CORS_ORIGINS, list) else []

settings = Settings()