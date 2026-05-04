from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import AuthProvider, User
from app.schemas.user import UserCreate


def get_user_by_email(db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return db.scalar(statement)


def get_user_by_id(db: Session, user_id: int) -> User | None:
    statement = select(User).where(User.id == user_id)
    return db.scalar(statement)


def create_user(db: Session, user_in: UserCreate) -> User:
    user = User(
        email=str(user_in.email),
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        provider=AuthProvider.local,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
