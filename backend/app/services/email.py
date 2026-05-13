import logging
import smtplib
from email.message import EmailMessage

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def send_email(to_email: str, subject: str, body: str) -> None:
    settings = get_settings()
    if not settings.smtp_host or not settings.smtp_from_email:
        logger.info("Email skipped (SMTP not configured): to=%s subject=%s", to_email, subject)
        return

    message = EmailMessage()
    message["From"] = settings.smtp_from_email
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            if settings.smtp_use_tls:
                server.starttls()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(message)
    except Exception:
        logger.exception("Failed to send email to %s (subject: %s)", to_email, subject)


def send_application_received_email(to_email: str, job_title: str, candidate_email: str) -> None:
    send_email(
        to_email=to_email,
        subject=f"New application for {job_title}",
        body=f"A candidate has applied to your job post.\n\nJob: {job_title}\nCandidate: {candidate_email}",
    )


def send_application_status_email(to_email: str, job_title: str, status: str) -> None:
    send_email(
        to_email=to_email,
        subject=f"Application status updated: {job_title}",
        body=f"Your application status has been updated.\n\nJob: {job_title}\nStatus: {status}",
    )
