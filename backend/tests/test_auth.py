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


def test_register_login_and_read_me() -> None:
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    register_response = client.post(
        "/api/v1/auth/register",
        json={"email": "candidate@example.com", "password": "password123", "role": "candidate"},
    )

    assert register_response.status_code == 201
    assert register_response.json()["email"] == "candidate@example.com"

    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "candidate@example.com", "password": "password123"},
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    me_response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert me_response.status_code == 200
    assert me_response.json()["email"] == "candidate@example.com"

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
