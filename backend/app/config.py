from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _BACKEND_DIR.parent


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    cors_origins: str = ""

    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    supabase_storage_bucket: str = "space-images"

    daraja_consumer_key: str
    daraja_consumer_secret: str
    daraja_shortcode: str
    daraja_passkey: str
    daraja_callback_url: str
    daraja_base_url: str = "https://sandbox.safaricom.co.ke"

    model_config = SettingsConfigDict(
        env_file=(_REPO_ROOT / ".env", _BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def supabase_is_configured(self) -> bool:
        """True only when real server-side Supabase credentials are available."""
        return bool(
            self.supabase_url.startswith("https://")
            and ".supabase.co" in self.supabase_url
            and self.supabase_service_role_key
            and "your_" not in self.supabase_service_role_key
            and "<your-" not in self.supabase_url
        )


settings = Settings()
