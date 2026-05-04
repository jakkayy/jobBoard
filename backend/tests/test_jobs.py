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


def test_employer_can_create_update_and_delete_job() -> None:
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    client.post(
        "/api/v1/auth/register",
        json={"email": "employer@example.com", "password": "password123", "role": "employer"},
    )
    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "employer@example.com", "password": "password123"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    create_response = client.post(
        "/api/v1/jobs",
        json={
            "title": "Backend Developer",
            "description": "Build APIs with FastAPI",
            "location": "Bangkok",
            "employment_type": "full_time",
            "salary_min": 50000,
            "salary_max": 90000,
            "skills_required": "Python, FastAPI, PostgreSQL",
            "status": "published",
        },
        headers=headers,
    )

    assert create_response.status_code == 201
    job_id = create_response.json()["id"]

    update_response = client.patch(
        f"/api/v1/jobs/{job_id}",
        json={"status": "closed"},
        headers=headers,
    )

    assert update_response.status_code == 200
    assert update_response.json()["status"] == "closed"

    delete_response = client.delete(f"/api/v1/jobs/{job_id}", headers=headers)

    assert delete_response.status_code == 204

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
