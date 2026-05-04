from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

from app.models.application import ApplicationStatus


class ApplicationCreate(BaseModel):
    cover_letter: str | None = None
    cv_url: HttpUrl | None = None


class ApplicationUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationRead(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    cover_letter: str | None
    cv_url: str | None
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ApplicationList(BaseModel):
    items: list[ApplicationRead]
    total: int = Field(ge=0)
