from fastapi import FastAPI
from app.users.routers import router as users_router
from app.modules.routers import router as modules_router

app = FastAPI(title="HR Platform")

app.include_router(users_router, prefix="/api", tags=["users"])
app.include_router(modules_router, prefix="/api", tags=["modules"])