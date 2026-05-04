from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.schemas.notification import NotificationCreate


def create_notification(db: Session, notification_in: NotificationCreate) -> Notification:
    notification = Notification(**notification_in.model_dump(mode="json"))
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def build_user_notifications_query(user_id: int) -> Select[tuple[Notification]]:
    return select(Notification).where(Notification.user_id == user_id)


def get_user_notifications(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> list[Notification]:
    statement = (
        build_user_notifications_query(user_id)
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(statement).all())


def count_user_notifications(db: Session, user_id: int) -> int:
    statement = build_user_notifications_query(user_id).subquery()
    return db.scalar(select(func.count()).select_from(statement)) or 0


def count_unread_user_notifications(db: Session, user_id: int) -> int:
    statement = build_user_notifications_query(user_id).where(Notification.is_read.is_(False)).subquery()
    return db.scalar(select(func.count()).select_from(statement)) or 0


def mark_user_notifications_read(db: Session, user_id: int) -> None:
    notifications = db.scalars(
        select(Notification).where(Notification.user_id == user_id, Notification.is_read.is_(False))
    ).all()
    for notification in notifications:
        notification.is_read = True
        db.add(notification)
    db.commit()
