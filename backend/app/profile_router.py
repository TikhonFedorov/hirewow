from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserOut, UserUpdate
from app.auth import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserOut)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить профиль текущего пользователя"""
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновить профиль пользователя"""
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.email is not None:
        # Проверка на уникальность email
        existing_user = db.query(User).filter(
            User.email == user_update.email,
            User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )
        current_user.email = user_update.email
    
    db.commit()
    db.refresh(current_user)
    return current_user

