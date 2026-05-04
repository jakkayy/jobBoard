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


def test_candidate_can_apply_and_employer_can_manage_application() -> None:
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    employer_headers = register_and_login(client, "application-employer@example.com", "employer")
    candidate_headers = register_and_login(client, "application-candidate@example.com", "candidate")

    job_response = client.post(
        "/api/v1/jobs",
        json={
            "title": "API Developer",
            "description": "Build backend APIs",
            "location": "Bangkok",
            "employment_type": "full_time",
            "status": "published",
        },
        headers=employer_headers,
    )
    job_id = job_response.json()["id"]

    apply_response = client.post(
        f"/api/v1/jobs/{job_id}/apply",
        json={"cover_letter": "I am interested in this role."},
        headers=candidate_headers,
    )

    assert apply_response.status_code == 201
    application_id = apply_response.json()["id"]

    my_applications_response = client.get("/api/v1/me/applications", headers=candidate_headers)

    assert my_applications_response.status_code == 200
    assert len(my_applications_response.json()) == 1

    job_applications_response = client.get(
        f"/api/v1/employer/jobs/{job_id}/applications", headers=employer_headers
    )

    assert job_applications_response.status_code == 200
    assert job_applications_response.json()["total"] == 1

    update_response = client.patch(
        f"/api/v1/applications/{application_id}",
        json={"status": "reviewing"},
        headers=employer_headers,
    )

    assert update_response.status_code == 200
    assert update_response.json()["status"] == "reviewing"

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
