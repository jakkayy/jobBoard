from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.job import Job
from app.schemas.job import JobCreate, JobUpdate


def get_jobs(db: Session, skip: int = 0, limit: int = 20) -> list[Job]:
    statement = select(Job).order_by(Job.created_at.desc()).offset(skip).limit(limit)
    return list(db.scalars(statement).all())


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
