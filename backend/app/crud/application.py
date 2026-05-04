from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate


def get_application_by_id(db: Session, application_id: int) -> Application | None:
    statement = select(Application).where(Application.id == application_id)
    return db.scalar(statement)


def get_application_by_job_and_candidate(
    db: Session, job_id: int, candidate_id: int
) -> Application | None:
    statement = select(Application).where(
        Application.job_id == job_id,
        Application.candidate_id == candidate_id,
    )
    return db.scalar(statement)


def get_candidate_applications(db: Session, candidate_id: int) -> list[Application]:
    statement = (
        select(Application)
        .where(Application.candidate_id == candidate_id)
        .order_by(Application.created_at.desc())
    )
    return list(db.scalars(statement).all())


def build_job_applications_query(job_id: int) -> Select[tuple[Application]]:
    return select(Application).where(Application.job_id == job_id)


def get_job_applications(db: Session, job_id: int) -> list[Application]:
    statement = build_job_applications_query(job_id).order_by(Application.created_at.desc())
    return list(db.scalars(statement).all())


def count_job_applications(db: Session, job_id: int) -> int:
    statement = build_job_applications_query(job_id).subquery()
    return db.scalar(select(func.count()).select_from(statement)) or 0


def create_application(
    db: Session, job_id: int, candidate_id: int, application_in: ApplicationCreate
) -> Application:
    application = Application(
        job_id=job_id,
        candidate_id=candidate_id,
        **application_in.model_dump(mode="json"),
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def update_application(
    db: Session, application: Application, application_in: ApplicationUpdate
) -> Application:
    application.status = application_in.status
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
