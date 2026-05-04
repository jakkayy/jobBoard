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


def test_candidate_can_create_and_update_profile() -> None:
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    client.post(
        "/api/v1/auth/register",
        json={"email": "candidate-profile@example.com", "password": "password123"},
    )
    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "candidate-profile@example.com", "password": "password123"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    create_response = client.post(
        "/api/v1/profiles/candidate/me",
        json={"full_name": "Candidate One", "skills": "Python, FastAPI"},
        headers=headers,
    )

    assert create_response.status_code == 201
    assert create_response.json()["full_name"] == "Candidate One"

    update_response = client.patch(
        "/api/v1/profiles/candidate/me",
        json={"bio": "Backend developer"},
        headers=headers,
    )

    assert update_response.status_code == 200
    assert update_response.json()["bio"] == "Backend developer"

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
