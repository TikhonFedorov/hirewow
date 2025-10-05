from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserHistory, SubscriptionType
from app.schemas import ModuleInterface, HistoryItem, HistoryCreate
from app.auth import get_current_user

router = APIRouter()

MODULES = [
    {"name": "calculator",    "path": "/calculator",    "description": "Калькулятор зарплаты"},
    {"name": "job_generator", "path": "/job_generator", "description": "Генератор вакансий"},
    {"name": "summary",       "path": "/summary",       "description": "Сводка и форматирование"},
]

@router.get("/modules", response_model=List[ModuleInterface])
def list_modules(current_user: User = Depends(get_current_user)):
    modules: List[ModuleInterface] = []
    for m in MODULES:
        enabled = not (current_user.subscription_type == "free" and m["name"] == "summary")
        modules.append(ModuleInterface(**m, enabled=enabled))
    return modules

@router.get("/history/{module_name}", response_model=List[HistoryItem])
def get_history(module_name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(UserHistory)\
        .filter(UserHistory.user_id == current_user.id, UserHistory.module_name == module_name)\
        .order_by(UserHistory.timestamp.desc())\
        .limit(50).all()
    return items

@router.post("/history", status_code=201)
def add_history(payload: HistoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    subs = db.query(SubscriptionType).filter(SubscriptionType.name == current_user.subscription_type).first()
    max_entries = subs.max_history_entries if subs else 20
    count = db.query(UserHistory).filter(UserHistory.user_id == current_user.id, UserHistory.module_name == payload.module_name).count()
    if count >= max_entries:
        oldest = db.query(UserHistory)\
            .filter(UserHistory.user_id == current_user.id, UserHistory.module_name == payload.module_name)\
            .order_by(UserHistory.timestamp.asc()).first()
        if oldest:
            db.delete(oldest)
            db.commit()
    item = UserHistory(user_id=current_user.id, module_name=payload.module_name, query=payload.query, response=payload.response)
    db.add(item)
    db.commit()
    return {"ok": True}