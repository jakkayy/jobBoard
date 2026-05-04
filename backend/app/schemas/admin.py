from pydantic import BaseModel, Field

from app.schemas.application import ApplicationRead
from app.schemas.job import JobRead
from app.schemas.user import UserRead


class AdminUserList(BaseModel):
    items: list[UserRead]
    total: int = Field(ge=0)


class AdminJobList(BaseModel):
    items: list[JobRead]
    total: int = Field(ge=0)


class AdminApplicationList(BaseModel):
    items: list[ApplicationRead]
    total: int = Field(ge=0)
