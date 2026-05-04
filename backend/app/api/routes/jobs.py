from fastapi import APIRouter, HTTPException, Query, Response, status

from app.api.deps import CurrentUser, DbSession
from app.crud.job import create_job, delete_job, get_job_by_id, get_jobs, update_job
from app.models.user import UserRole
from app.schemas.job import JobCreate, JobRead, JobUpdate

router = APIRouter(prefix="/jobs", tags=["jobs"])


def require_employer(current_user: CurrentUser) -> None:
    if current_user.role != UserRole.employer:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Employer role required")


def require_job_owner(job_employer_id: int, current_user: CurrentUser) -> None:
    if job_employer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Job owner required")


@router.get("", response_model=list[JobRead])
def list_jobs(
    db: DbSession,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
) -> list[JobRead]:
    return get_jobs(db, skip=skip, limit=limit)


@router.get("/{job_id}", response_model=JobRead)
def read_job(job_id: int, db: DbSession) -> JobRead:
    job = get_job_by_id(db, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_my_job(job_in: JobCreate, current_user: CurrentUser, db: DbSession) -> JobRead:
    require_employer(current_user)
    return create_job(db, current_user.id, job_in)


@router.patch("/{job_id}", response_model=JobRead)
def update_my_job(
    job_id: int, job_in: JobUpdate, current_user: CurrentUser, db: DbSession
) -> JobRead:
    require_employer(current_user)
    job = get_job_by_id(db, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    require_job_owner(job.employer_id, current_user)
    return update_job(db, job, job_in)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_job(job_id: int, current_user: CurrentUser, db: DbSession) -> Response:
    require_employer(current_user)
    job = get_job_by_id(db, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    require_job_owner(job.employer_id, current_user)
    delete_job(db, job)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
