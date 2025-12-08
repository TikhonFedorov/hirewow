from fastapi import FastAPI
from app.users.routers import router as users_router
from app.modules.routers import router as modules_router
from app.database import Base, engine  # импортируй Base и engine

app = FastAPI(title="HR Platform")

@app.on_event("startup")
def on_startup():
    # к этому моменту модели (включая User) уже импортированы через роутеры
    Base.metadata.create_all(bind=engine)

app.include_router(users_router, prefix="/api", tags=["users"])
app.include_router(modules_router, prefix="/api", tags=["modules"])
