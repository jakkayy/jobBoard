from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class CandidateProfileBase(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)
    phone: str | None = Field(default=None, max_length=50)
    bio: str | None = None
    skills: str | None = None
    cv_url: HttpUrl | None = None
    profile_picture_url: HttpUrl | None = None


class CandidateProfileCreate(CandidateProfileBase):
    pass


class CandidateProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=255)
    phone: str | None = Field(default=None, max_length=50)
    bio: str | None = None
    skills: str | None = None
    cv_url: HttpUrl | None = None
    profile_picture_url: HttpUrl | None = None


class CandidateProfileRead(CandidateProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EmployerProfileBase(BaseModel):
    company_name: str = Field(min_length=1, max_length=255)
    company_website: HttpUrl | None = None
    company_description: str | None = None
    logo_url: HttpUrl | None = None


class EmployerProfileCreate(EmployerProfileBase):
    pass


class EmployerProfileUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=1, max_length=255)
    company_website: HttpUrl | None = None
    company_description: str | None = None
    logo_url: HttpUrl | None = None


class EmployerProfileRead(EmployerProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
