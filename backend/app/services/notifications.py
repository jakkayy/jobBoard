from sqlalchemy.orm import Session

from app.crud.notification import create_notification
from app.models.notification import NotificationType
from app.schemas.notification import NotificationCreate


def notify_application_received(db: Session, employer_id: int, job_title: str, candidate_email: str) -> None:
    create_notification(
        db,
        NotificationCreate(
            user_id=employer_id,
            type=NotificationType.application_received,
            title=f"New application for {job_title}",
            message=f"{candidate_email} applied to your job post.",
        ),
    )


def notify_application_status_updated(db: Session, candidate_id: int, job_title: str, status: str) -> None:
    create_notification(
        db,
        NotificationCreate(
            user_id=candidate_id,
            type=NotificationType.application_status_updated,
            title=f"Application status updated: {job_title}",
            message=f"Your application status is now {status}.",
        ),
    )
