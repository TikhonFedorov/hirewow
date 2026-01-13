from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import bcrypt
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
ALGORITHM = "HS256"

def get_password_hash(password: str) -> str:
    # Bcrypt has a 72-byte limit, truncate if necessary
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        # Truncate to 72 bytes (not characters)
        password_bytes = password_bytes[:72]
    # Generate salt and hash password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    # Return as string (bcrypt hash is always $2b$... format)
    return hashed.decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    # Apply same truncation logic for verification
    password_bytes = plain.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    # Verify password
    try:
        return bcrypt.checkpw(password_bytes, hashed.encode('utf-8'))
    except Exception:
        return False

def create_access_token(sub: str, expires_minutes: int) -> str:
    to_encode = {"sub": sub, "exp": datetime.utcnow() + timedelta(minutes=expires_minutes)}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    cred_exc = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise cred_exc
    except JWTError:
        raise cred_exc
    user = get_user_by_username(db, username)
    if user is None:
        raise cred_exc
    return user