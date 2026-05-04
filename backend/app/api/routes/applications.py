from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DbSession
from app.crud.application import (
    count_job_applications,
    create_application,
    get_application_by_id,
    get_application_by_job_and_candidate,
    get_candidate_applications,
    get_job_applications,
    update_application,
)
from app.crud.job import get_job_by_id
from app.models.job import JobStatus
from app.models.user import UserRole
from app.schemas.application import ApplicationCreate, ApplicationList, ApplicationRead, ApplicationUpdate
from app.services.email import send_application_received_email, send_application_status_email

router = APIRouter(tags=["applications"])


def require_candidate(current_user: CurrentUser) -> None:
    if current_user.role != UserRole.candidate:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Candidate role required")


def require_employer(current_user: CurrentUser) -> None:
    if current_user.role != UserRole.employer:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Employer role required")


@router.post(
    "/jobs/{job_id}/apply", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED
)
def apply_to_job(
    job_id: int,
    application_in: ApplicationCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> ApplicationRead:
    require_candidate(current_user)
    job = get_job_by_id(db, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.status != JobStatus.published:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job is not open")
    existing_application = get_application_by_job_and_candidate(db, job_id, current_user.id)
    if existing_application is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already applied to this job")
    application = create_application(db, job_id, current_user.id, application_in)
    send_application_received_email(job.employer.email, job.title, current_user.email)
    return application


@router.get("/me/applications", response_model=list[ApplicationRead])
def list_my_applications(current_user: CurrentUser, db: DbSession) -> list[ApplicationRead]:
    require_candidate(current_user)
    return get_candidate_applications(db, current_user.id)


@router.get("/employer/jobs/{job_id}/applications", response_model=ApplicationList)
def list_job_applications(job_id: int, current_user: CurrentUser, db: DbSession) -> ApplicationList:
    require_employer(current_user)
    job = get_job_by_id(db, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.employer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Job owner required")
    items = get_job_applications(db, job_id)
    total = count_job_applications(db, job_id)
    return ApplicationList(items=items, total=total)


@router.patch("/applications/{application_id}", response_model=ApplicationRead)
def update_application_status(
    application_id: int,
    application_in: ApplicationUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> ApplicationRead:
    require_employer(current_user)
    application = get_application_by_id(db, application_id)
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    job = get_job_by_id(db, application.job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.employer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Job owner required")
    updated_application = update_application(db, application, application_in)
    send_application_status_email(application.candidate.email, job.title, updated_application.status.value)
    return updated_application
