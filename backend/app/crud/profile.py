from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.profile import CandidateProfile, EmployerProfile
from app.schemas.profile import (
    CandidateProfileCreate,
    CandidateProfileUpdate,
    EmployerProfileCreate,
    EmployerProfileUpdate,
)


def get_candidate_profile_by_user_id(db: Session, user_id: int) -> CandidateProfile | None:
    statement = select(CandidateProfile).where(CandidateProfile.user_id == user_id)
    return db.scalar(statement)


def create_candidate_profile(
    db: Session, user_id: int, profile_in: CandidateProfileCreate
) -> CandidateProfile:
    profile = CandidateProfile(user_id=user_id, **profile_in.model_dump(mode="json"))
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_candidate_profile(
    db: Session, profile: CandidateProfile, profile_in: CandidateProfileUpdate
) -> CandidateProfile:
    update_data = profile_in.model_dump(exclude_unset=True, mode="json")
    for field, value in update_data.items():
        setattr(profile, field, value)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def get_employer_profile_by_user_id(db: Session, user_id: int) -> EmployerProfile | None:
    statement = select(EmployerProfile).where(EmployerProfile.user_id == user_id)
    return db.scalar(statement)


def create_employer_profile(db: Session, user_id: int, profile_in: EmployerProfileCreate) -> EmployerProfile:
    profile = EmployerProfile(user_id=user_id, **profile_in.model_dump(mode="json"))
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_employer_profile(
    db: Session, profile: EmployerProfile, profile_in: EmployerProfileUpdate
) -> EmployerProfile:
    update_data = profile_in.model_dump(exclude_unset=True, mode="json")
    for field, value in update_data.items():
        setattr(profile, field, value)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
