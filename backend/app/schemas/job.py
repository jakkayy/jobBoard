from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.job import EmploymentType, JobStatus


class JobBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=10000)
    location: str | None = Field(default=None, max_length=255)
    employment_type: EmploymentType
    salary_min: int | None = Field(default=None, ge=0)
    salary_max: int | None = Field(default=None, ge=0)
    skills_required: str | None = Field(default=None, max_length=2000)
    status: JobStatus = JobStatus.draft

    @model_validator(mode="after")
    def validate_salary_range(self) -> "JobBase":
        if self.salary_min is not None and self.salary_max is not None:
            if self.salary_min > self.salary_max:
                raise ValueError("salary_min must be less than or equal to salary_max")
        return self


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, min_length=1, max_length=10000)
    location: str | None = Field(default=None, max_length=255)
    employment_type: EmploymentType | None = None
    salary_min: int | None = Field(default=None, ge=0)
    salary_max: int | None = Field(default=None, ge=0)
    skills_required: str | None = Field(default=None, max_length=2000)
    status: JobStatus | None = None

    @model_validator(mode="after")
    def validate_salary_range(self) -> "JobUpdate":
        if self.salary_min is not None and self.salary_max is not None:
            if self.salary_min > self.salary_max:
                raise ValueError("salary_min must be less than or equal to salary_max")
        return self


class JobRead(JobBase):
    id: int
    employer_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JobList(BaseModel):
    items: list[JobRead]
    total: int
    page: int
    limit: int
