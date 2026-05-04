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


def test_authenticated_user_can_upload_cv() -> None:
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    client.post(
        "/api/v1/auth/register",
        json={"email": "upload-candidate@example.com", "password": "password123", "role": "candidate"},
    )
    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "upload-candidate@example.com", "password": "password123"},
    )
    headers = {"Authorization": f"Bearer {login_response.json()['access_token']}"}

    upload_response = client.post(
        "/api/v1/uploads/cv",
        files={"file": ("resume.pdf", b"%PDF-1.4 test", "application/pdf")},
        headers=headers,
    )

    assert upload_response.status_code == 201
    data = upload_response.json()
    assert data["url"].startswith("/uploads/cv/")
    assert data["content_type"] == "application/pdf"

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
