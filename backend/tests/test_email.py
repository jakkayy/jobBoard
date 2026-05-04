from app.services.email import send_application_received_email, send_application_status_email


def test_email_notifications_are_safe_without_smtp_config() -> None:
    send_application_received_email(
        "employer@example.com",
        "Backend Developer",
        "candidate@example.com",
    )
    send_application_status_email(
        "candidate@example.com",
        "Backend Developer",
        "reviewing",
    )
