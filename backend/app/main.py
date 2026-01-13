from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.users.routers import router as users_router
from app.modules.routers import router as modules_router
from app.auth_router import router as auth_router, limiter
from app.salary_router import router as salary_router
from app.job_generator_router import router as job_generator_router
from app.history_router import router as history_router
from app.profile_router import router as profile_router
from app.database import Base, engine  # импортируй Base и engine
from app.models import User, UserHistory, SubscriptionType  # Импортируем модели для создания таблиц
from app.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(title="HR Platform")

# Initialize rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration - restricted for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # к этому моменту модели (включая User) уже импортированы через роутеры
    Base.metadata.create_all(bind=engine)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Auth endpoints at root level
app.include_router(auth_router, tags=["auth"])

# API endpoints with /api prefix
app.include_router(users_router, prefix="/api", tags=["users"])
app.include_router(modules_router, prefix="/api", tags=["modules"])
app.include_router(salary_router, prefix="/api", tags=["salary"])
app.include_router(job_generator_router, prefix="/api", tags=["job_generator"])
app.include_router(history_router, prefix="/api", tags=["history"])
app.include_router(profile_router, prefix="/api", tags=["profile"])
