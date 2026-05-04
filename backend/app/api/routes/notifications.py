from fastapi import APIRouter, Query, status

from app.api.deps import CurrentUser, DbSession
from app.crud.notification import (
    count_unread_user_notifications,
    count_user_notifications,
    get_user_notifications,
    mark_user_notifications_read,
)
from app.schemas.notification import NotificationList

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=NotificationList)
def list_notifications(
    current_user: CurrentUser,
    db: DbSession,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
) -> NotificationList:
    return NotificationList(
        items=get_user_notifications(db, current_user.id, skip=skip, limit=limit),
        total=count_user_notifications(db, current_user.id),
        unread_count=count_unread_user_notifications(db, current_user.id),
    )


@router.post("/mark-read", status_code=status.HTTP_204_NO_CONTENT)
def mark_notifications_read(current_user: CurrentUser, db: DbSession) -> None:
    mark_user_notifications_read(db, current_user.id)
