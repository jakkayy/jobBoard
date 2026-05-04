from app.models.user import UserRole
from app.schemas.user import UserCreate


def test_user_create_schema_defaults_to_candidate_role() -> None:
    user = UserCreate(email="candidate@example.com", password="password123")

    assert user.email == "candidate@example.com"
    assert user.role == UserRole.candidate
