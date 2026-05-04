from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.notification import NotificationType


class NotificationCreate(BaseModel):
    user_id: int
    type: NotificationType
    title: str = Field(min_length=1, max_length=255)
    message: str = Field(min_length=1)


class NotificationRead(BaseModel):
    id: int
    user_id: int
    type: NotificationType
    title: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationList(BaseModel):
    items: list[NotificationRead]
    total: int = Field(ge=0)
    unread_count: int = Field(ge=0)
