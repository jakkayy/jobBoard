from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session

from app.models.job import EmploymentType, Job, JobStatus
from app.schemas.job import JobCreate, JobUpdate


def build_jobs_query(
    keyword: str | None = None,
    location: str | None = None,
    employment_type: EmploymentType | None = None,
    salary_min: int | None = None,
    salary_max: int | None = None,
    status: JobStatus | None = None,
) -> Select[tuple[Job]]:
    statement = select(Job)
    if keyword:
        keyword_filter = f"%{keyword}%"
        statement = statement.where(
            or_(
                Job.title.ilike(keyword_filter),
                Job.description.ilike(keyword_filter),
                Job.skills_required.ilike(keyword_filter),
            )
        )
    if location:
        statement = statement.where(Job.location.ilike(f"%{location}%"))
    if employment_type:
        statement = statement.where(Job.employment_type == employment_type)
    if salary_min is not None:
        statement = statement.where(or_(Job.salary_max.is_(None), Job.salary_max >= salary_min))
    if salary_max is not None:
        statement = statement.where(or_(Job.salary_min.is_(None), Job.salary_min <= salary_max))
    if status:
        statement = statement.where(Job.status == status)
    return statement


def get_jobs(
    db: Session,
    page: int = 1,
    limit: int = 20,
    keyword: str | None = None,
    location: str | None = None,
    employment_type: EmploymentType | None = None,
    salary_min: int | None = None,
    salary_max: int | None = None,
    status: JobStatus | None = None,
    sort: str = "newest",
) -> list[Job]:
    offset = (page - 1) * limit
    statement = build_jobs_query(
        keyword=keyword,
        location=location,
        employment_type=employment_type,
        salary_min=salary_min,
        salary_max=salary_max,
        status=status,
    )
    if sort == "oldest":
        statement = statement.order_by(Job.created_at.asc())
    else:
        statement = statement.order_by(Job.created_at.desc())
    statement = statement.offset(offset).limit(limit)
    return list(db.scalars(statement).all())


def count_jobs(
    db: Session,
    keyword: str | None = None,
    location: str | None = None,
    employment_type: EmploymentType | None = None,
    salary_min: int | None = None,
    salary_max: int | None = None,
    status: JobStatus | None = None,
) -> int:
    statement = build_jobs_query(
        keyword=keyword,
        location=location,
        employment_type=employment_type,
        salary_min=salary_min,
        salary_max=salary_max,
        status=status,
    ).subquery()
    return db.scalar(select(func.count()).select_from(statement)) or 0


def get_job_by_id(db: Session, job_id: int) -> Job | None:
    statement = select(Job).where(Job.id == job_id)
    return db.scalar(statement)


def create_job(db: Session, employer_id: int, job_in: JobCreate) -> Job:
    job = Job(employer_id=employer_id, **job_in.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def update_job(db: Session, job: Job, job_in: JobUpdate) -> Job:
    update_data = job_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def delete_job(db: Session, job: Job) -> None:
    db.delete(job)
    db.commit()
