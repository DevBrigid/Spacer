import uuid
import requests
from fastapi import UploadFile, HTTPException

from app.config import settings

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_MB = 5


def _ensure_storage_bucket(bucket_name: str) -> None:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise HTTPException(status_code=503, detail="Supabase storage is not configured")

    headers = {
        "Authorization": f"Bearer {settings.supabase_service_role_key}",
        "apikey": settings.supabase_service_role_key,
        "Content-Type": "application/json",
    }

    check_response = requests.get(
        f"{settings.supabase_url}/storage/v1/bucket/{bucket_name}",
        headers=headers,
        timeout=20,
    )

    if check_response.status_code == 200:
        return

    create_response = requests.post(
        f"{settings.supabase_url}/storage/v1/bucket",
        headers=headers,
        json={"name": bucket_name, "public": True},
        timeout=20,
    )

    if create_response.status_code not in (200, 201, 202):
        body = create_response.text
        if "already exists" in body.lower() or create_response.status_code == 409:
            return
        raise HTTPException(
            status_code=502,
            detail=f"Failed to create Supabase storage bucket '{bucket_name}': {body}",
        )


def upload_space_image(file: UploadFile) -> str:
    """
    Uploads an image file to Supabase Storage and returns its public URL.
    """
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WEBP images are allowed")

    file_bytes = file.file.read()
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"Image must be under {MAX_FILE_SIZE_MB}MB")

    _ensure_storage_bucket(settings.supabase_storage_bucket)

    extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    object_path = f"{uuid.uuid4()}.{extension}"

    upload_url = f"{settings.supabase_url}/storage/v1/object/{settings.supabase_storage_bucket}/{object_path}"

    response = requests.post(
        upload_url,
        headers={
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
            "Content-Type": file.content_type,
        },
        data=file_bytes,
        timeout=30,
    )

    if response.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail=f"Image upload failed: {response.text}")

    public_url = f"{settings.supabase_url}/storage/v1/object/public/{settings.supabase_storage_bucket}/{object_path}"
    return public_url