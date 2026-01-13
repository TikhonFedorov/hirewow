from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime
import logging
from app.database import get_db
from app.models import User, UserHistory, SubscriptionType
from app.schemas import HistoryItem, HistoryCreate
from app.auth import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/history", response_model=HistoryItem, status_code=201)
def create_history(
    history_data: HistoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создать запись в истории пользователя"""
    # Проверка лимита истории для подписки
    subscription = db.query(SubscriptionType).filter(
        SubscriptionType.name == current_user.subscription_type
    ).first()
    
    # Если подписка не найдена, используем дефолтный лимит
    max_entries = subscription.max_history_entries if subscription else 20
    
    # Подсчет текущих записей для модуля
    module_count = db.query(UserHistory).filter(
        UserHistory.user_id == current_user.id,
        UserHistory.module_name == history_data.module_name
    ).count()
    
    # Если превышен лимит, удаляем старые записи
    if module_count >= max_entries:
        oldest_entries = db.query(UserHistory).filter(
            UserHistory.user_id == current_user.id,
            UserHistory.module_name == history_data.module_name
        ).order_by(UserHistory.timestamp.asc()).limit(module_count - max_entries + 1).all()
        
        for entry in oldest_entries:
            db.delete(entry)
    
    # Создаем новую запись
    try:
        history_entry = UserHistory(
            user_id=current_user.id,
            module_name=history_data.module_name,
            query=history_data.query,
            response=history_data.response
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        logger.info(f"History entry created for user {current_user.id}, module {history_data.module_name}")
        
        # Преобразуем timestamp в строку для ответа
        timestamp_str = history_entry.timestamp.isoformat() if hasattr(history_entry.timestamp, 'isoformat') else str(history_entry.timestamp)
        history_dict = {
            "id": history_entry.id,
            "module_name": history_entry.module_name,
            "query": history_entry.query,
            "response": history_entry.response,
            "timestamp": timestamp_str
        }
        return history_dict
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating history entry: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save history: {str(e)}"
        )

@router.get("/history", response_model=List[HistoryItem])
def get_history(
    module_name: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить историю запросов пользователя"""
    query = db.query(UserHistory).filter(UserHistory.user_id == current_user.id)
    
    if module_name:
        query = query.filter(UserHistory.module_name == module_name)
    
    history = query.order_by(desc(UserHistory.timestamp)).limit(limit).all()
    # Преобразуем timestamp в строки
    result = []
    for item in history:
        timestamp_str = item.timestamp.isoformat() if hasattr(item.timestamp, 'isoformat') else str(item.timestamp)
        result.append({
            "id": item.id,
            "module_name": item.module_name,
            "query": item.query,
            "response": item.response,
            "timestamp": timestamp_str
        })
    return result

@router.get("/history/{history_id}", response_model=HistoryItem)
def get_history_item(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить конкретную запись истории"""
    history_item = db.query(UserHistory).filter(
        UserHistory.id == history_id,
        UserHistory.user_id == current_user.id
    ).first()
    
    if not history_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="History item not found"
        )
    
    # Преобразуем timestamp в строку
    timestamp_str = history_item.timestamp.isoformat() if hasattr(history_item.timestamp, 'isoformat') else str(history_item.timestamp)
    return {
        "id": history_item.id,
        "module_name": history_item.module_name,
        "query": history_item.query,
        "response": history_item.response,
        "timestamp": timestamp_str
    }

@router.delete("/history/{history_id}", status_code=204)
def delete_history_item(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Удалить запись истории"""
    history_item = db.query(UserHistory).filter(
        UserHistory.id == history_id,
        UserHistory.user_id == current_user.id
    ).first()
    
    if not history_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="History item not found"
        )
    
    db.delete(history_item)
    db.commit()
    return None

@router.delete("/history", status_code=204)
def clear_history(
    module_name: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Очистить историю пользователя (все или для конкретного модуля)"""
    query = db.query(UserHistory).filter(UserHistory.user_id == current_user.id)
    
    if module_name:
        query = query.filter(UserHistory.module_name == module_name)
    
    query.delete()
    db.commit()
    return None

