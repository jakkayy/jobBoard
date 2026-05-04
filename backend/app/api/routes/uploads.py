from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException, UploadFile, status

from app.api.deps import CurrentUser
from app.core.config import get_settings
from app.schemas.upload import UploadResponse

router = APIRouter(prefix="/uploads", tags=["uploads"])

allowed_uploads = {
    "cv": {"application/pdf"},
    "profile-picture": {"image/jpeg", "image/png", "image/webp"},
    "company-logo": {"image/jpeg", "image/png", "image/webp"},
}


@router.post("/{upload_type}", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(upload_type: str, file: UploadFile, current_user: CurrentUser) -> UploadResponse:
    settings = get_settings()
    allowed_content_types = allowed_uploads.get(upload_type)
    if allowed_content_types is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Upload type not found")
    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    content = await file.read()
    if len(content) > settings.upload_max_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large")

    original_filename = Path(file.filename or "upload").name
    suffix = Path(original_filename).suffix.lower()
    safe_filename = f"{current_user.id}-{uuid4().hex}{suffix}"
    target_dir = Path(settings.upload_dir) / upload_type
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / safe_filename
    target_path.write_bytes(content)

    return UploadResponse(
        filename=safe_filename,
        url=f"{settings.upload_url_prefix}/{upload_type}/{safe_filename}",
        content_type=file.content_type or "application/octet-stream",
        size=len(content),
    )
