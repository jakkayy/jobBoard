from collections.abc import Generator

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def register_and_login(client: TestClient, email: str, role: str) -> dict[str, str]:
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "role": role},
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": email, "password": "password123"},
    )
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def test_admin_can_list_users_and_moderate_user_status() -> None:
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    admin_headers = register_and_login(client, "admin@example.com", "admin")
    candidate_headers = register_and_login(client, "admin-candidate@example.com", "candidate")

    users_response = client.get("/api/v1/admin/users", headers=admin_headers)
    forbidden_response = client.get("/api/v1/admin/users", headers=candidate_headers)
    user_id = next(user["id"] for user in users_response.json()["items"] if user["email"] == "admin-candidate@example.com")
    update_response = client.patch(
        f"/api/v1/admin/users/{user_id}",
        json={"is_active": False},
        headers=admin_headers,
    )

    assert users_response.status_code == 200
    assert users_response.json()["total"] == 2
    assert forbidden_response.status_code == 403
    assert update_response.status_code == 200
    assert update_response.json()["is_active"] is False

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
