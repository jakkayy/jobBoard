from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, DbSession
from app.crud.application import count_applications, get_applications
from app.crud.job import count_jobs, get_job_by_id, get_jobs, update_job
from app.crud.user import count_users, get_user_by_id, get_users, update_user
from app.models.user import UserRole
from app.schemas.admin import AdminApplicationList, AdminJobList, AdminUserList
from app.schemas.job import JobRead, JobUpdate
from app.schemas.user import AdminUserUpdate, UserRead

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(current_user: CurrentUser) -> None:
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")


@router.get("/users", response_model=AdminUserList)
def list_users(
    current_user: CurrentUser,
    db: DbSession,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
) -> AdminUserList:
    require_admin(current_user)
    return AdminUserList(items=get_users(db, skip=skip, limit=limit), total=count_users(db))


@router.patch("/users/{user_id}", response_model=UserRead)
def update_user_status(
    user_id: int,
    user_in: AdminUserUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> UserRead:
    require_admin(current_user)
    user = get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return update_user(db, user, user_in)


@router.get("/jobs", response_model=AdminJobList)
def list_admin_jobs(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=100),
) -> AdminJobList:
    require_admin(current_user)
    return AdminJobList(items=get_jobs(db, page=page, limit=limit), total=count_jobs(db))


@router.patch("/jobs/{job_id}", response_model=JobRead)
def moderate_job(
    job_id: int,
    job_in: JobUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> JobRead:
    require_admin(current_user)
    job = get_job_by_id(db, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return update_job(db, job, job_in)


@router.get("/applications", response_model=AdminApplicationList)
def list_admin_applications(
    current_user: CurrentUser,
    db: DbSession,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
) -> AdminApplicationList:
    require_admin(current_user)
    return AdminApplicationList(items=get_applications(db, skip=skip, limit=limit), total=count_applications(db))
