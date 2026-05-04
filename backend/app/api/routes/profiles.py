from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DbSession
from app.crud.profile import (
    create_candidate_profile,
    create_employer_profile,
    get_candidate_profile_by_user_id,
    get_employer_profile_by_user_id,
    update_candidate_profile,
    update_employer_profile,
)
from app.models.user import UserRole
from app.schemas.profile import (
    CandidateProfileCreate,
    CandidateProfileRead,
    CandidateProfileUpdate,
    EmployerProfileCreate,
    EmployerProfileRead,
    EmployerProfileUpdate,
)

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.post(
    "/candidate/me", response_model=CandidateProfileRead, status_code=status.HTTP_201_CREATED
)
def create_my_candidate_profile(
    profile_in: CandidateProfileCreate, current_user: CurrentUser, db: DbSession
) -> CandidateProfileRead:
    if current_user.role != UserRole.candidate:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Candidate role required")
    existing_profile = get_candidate_profile_by_user_id(db, current_user.id)
    if existing_profile is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Candidate profile already exists")
    return create_candidate_profile(db, current_user.id, profile_in)


@router.get("/candidate/me", response_model=CandidateProfileRead)
def read_my_candidate_profile(current_user: CurrentUser, db: DbSession) -> CandidateProfileRead:
    profile = get_candidate_profile_by_user_id(db, current_user.id)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate profile not found")
    return profile


@router.patch("/candidate/me", response_model=CandidateProfileRead)
def update_my_candidate_profile(
    profile_in: CandidateProfileUpdate, current_user: CurrentUser, db: DbSession
) -> CandidateProfileRead:
    profile = get_candidate_profile_by_user_id(db, current_user.id)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate profile not found")
    return update_candidate_profile(db, profile, profile_in)


@router.post("/employer/me", response_model=EmployerProfileRead, status_code=status.HTTP_201_CREATED)
def create_my_employer_profile(
    profile_in: EmployerProfileCreate, current_user: CurrentUser, db: DbSession
) -> EmployerProfileRead:
    if current_user.role != UserRole.employer:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Employer role required")
    existing_profile = get_employer_profile_by_user_id(db, current_user.id)
    if existing_profile is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employer profile already exists")
    return create_employer_profile(db, current_user.id, profile_in)


@router.get("/employer/me", response_model=EmployerProfileRead)
def read_my_employer_profile(current_user: CurrentUser, db: DbSession) -> EmployerProfileRead:
    profile = get_employer_profile_by_user_id(db, current_user.id)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employer profile not found")
    return profile


@router.patch("/employer/me", response_model=EmployerProfileRead)
def update_my_employer_profile(
    profile_in: EmployerProfileUpdate, current_user: CurrentUser, db: DbSession
) -> EmployerProfileRead:
    profile = get_employer_profile_by_user_id(db, current_user.id)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employer profile not found")
    return update_employer_profile(db, profile, profile_in)
