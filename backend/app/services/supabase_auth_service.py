"""Small, dependency-free client for the Supabase Auth REST API.

The service-role key is deliberately used only on the server.  Browser clients
authenticate with the public anon key and hand their short-lived access token
to ``verify_access_token`` for verification.
"""

import json
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from fastapi import HTTPException, status

from app.config import settings


def _require_configuration() -> None:
    if not settings.supabase_is_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase Auth is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.",
        )


def _request(path: str, *, method: str = "GET", token: str | None = None, payload: dict | None = None) -> dict:
    _require_configuration()
    headers = {
        "apikey": settings.supabase_service_role_key,
        "Content-Type": "application/json",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    else:
        headers["Authorization"] = f"Bearer {settings.supabase_service_role_key}"

    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = Request(f"{settings.supabase_url.rstrip('/')}{path}", data=body, headers=headers, method=method)
    try:
        with urlopen(request, timeout=10) as response:
            content = response.read().decode("utf-8")
            return json.loads(content) if content else {}
    except HTTPError as exc:
        try:
            error = json.loads(exc.read().decode("utf-8"))
            message = error.get("msg") or error.get("message") or error.get("error_description")
        except (ValueError, UnicodeDecodeError):
            message = None
        raise HTTPException(status_code=exc.code, detail=message or "Supabase Auth request failed") from exc
    except URLError as exc:
        raise HTTPException(status_code=502, detail="Could not reach Supabase Auth") from exc


def verify_access_token(access_token: str) -> dict:
    """Validate a browser-issued JWT with Supabase and return its user payload."""
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Supabase access token is required")
    return _request("/auth/v1/user", token=access_token)


def create_user(*, email: str, password: str, full_name: str, phone_number: str | None = None) -> dict:
    """Create a confirmed Supabase Auth user for the administrator workflow."""
    return _request(
        "/auth/v1/admin/users",
        method="POST",
        payload={
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {"full_name": full_name, "phone_number": phone_number or ""},
        },
    )


def update_user_password_by_email(email: str, password: str) -> dict:
    """Update a Supabase Auth user password by email using the service-role key."""
    normalized_email = (email or "").strip().lower()
    if not normalized_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is required")
    if not password or len(password.strip()) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 8 characters long")

    users_response = _request(f"/auth/v1/admin/users?email={quote(normalized_email)}", method="GET")
    users = users_response.get("users") if isinstance(users_response, dict) else []
    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supabase user not found")

    user_id = users[0].get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supabase user id not found")

    return _request(
        f"/auth/v1/admin/users/{user_id}",
        method="PUT",
        payload={"password": password},
    )
