from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
  openai_api_key: str = Field(default="", env="OPENAI_API_KEY")
  openai_chat_api_key: str = Field(default="", env="OPENAI_CHAT_API_KEY")
  openai_embedding_api_key: str = Field(default="", env="OPENAI_EMBEDDING_API_KEY")
  openai_base_url: str = Field(default="https://api.openai.com/v1", env="OPENAI_BASE_URL")
  openai_chat_base_url: str = Field(default="", env="OPENAI_CHAT_BASE_URL")
  openai_embedding_base_url: str = Field(default="", env="OPENAI_EMBEDDING_BASE_URL")
  openai_model: str = Field(default="gpt-4o-mini", env="OPENAI_MODEL")
  openai_embedding_model: str = Field(
    default="text-embedding-3-small",
    env="OPENAI_EMBEDDING_MODEL",
  )
  cors_origins: str = Field(
    default="http://localhost:5173,http://127.0.0.1:5173",
    env="CORS_ORIGINS",
  )
  session_ttl_minutes: int = Field(default=120, env="SESSION_TTL_MINUTES")
  chroma_persist_dir: str = Field(default="", env="CHROMA_PERSIST_DIR")
  docs_dir: str = Field(default="", env="DOCS_DIR")
  smtp_host: str = Field(default="smtp.gmail.com", env="SMTP_HOST")
  smtp_port: int = Field(default=465, env="SMTP_PORT")
  smtp_user: str = Field(default="", env="SMTP_USER")
  smtp_password: str = Field(default="", env="SMTP_PASSWORD")
  contact_recipient: str = Field(default="", env="CONTACT_RECIPIENT")

  @field_validator("cors_origins")
  def _validate_cors_origins(cls, value: str) -> str:
    return value or ""

  @property
  def cors_origins_list(self) -> list[str]:
    return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

  @property
  def resolved_chroma_dir(self) -> str:
    if self.chroma_persist_dir:
      return self.chroma_persist_dir
    return str(Path(__file__).resolve().parents[1] / "data" / "chroma")

  @property
  def resolved_docs_dir(self) -> str:
    if self.docs_dir:
      return self.docs_dir
    return str(Path(__file__).resolve().parents[1] / "data" / "docs")

  @property
  def chat_api_key(self) -> str:
    return self.openai_chat_api_key or self.openai_api_key

  @property
  def embedding_api_key(self) -> str:
    return self.openai_embedding_api_key or self.openai_api_key

  @property
  def chat_base_url(self) -> str:
    return self.openai_chat_base_url or self.openai_base_url

  @property
  def embedding_base_url(self) -> str:
    return self.openai_embedding_base_url or self.openai_base_url

  @property
  def resolved_contact_recipient(self) -> str:
    return self.contact_recipient or self.smtp_user

  class Config:
    env_file = ".env"
    env_file_encoding = "utf-8"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
  return Settings()
