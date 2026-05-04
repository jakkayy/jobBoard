from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import AuthProvider, User
from app.schemas.user import UserCreate, UserUpdate


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


def get_users(db: Session, skip: int = 0, limit: int = 50) -> list[User]:
    statement = select(User).order_by(User.created_at.desc()).offset(skip).limit(limit)
    return list(db.scalars(statement).all())


def count_users(db: Session) -> int:
    return db.scalar(select(func.count()).select_from(User)) or 0


def update_user(db: Session, user: User, user_in: UserUpdate) -> User:
    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
