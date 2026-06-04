from functools import lru_cache
import re
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
  navigator_base_url: str = Field(default="", env="NAVIGATOR_BASE_URL")
  navigator_api_key: str = Field(default="", env="NAVIGATOR_API_KEY")
  navigator_stt_model: str = Field(default="whisper-large-v3", env="NAVIGATOR_STT_MODEL")
  navigator_llm_model: str = Field(default="gpt-oss-120b", env="NAVIGATOR_LLM_MODEL")
  navigator_tts_model: str = Field(default="kokoro", env="NAVIGATOR_TTS_MODEL")
  navigator_tts_voice: str = Field(default="af_heart", env="NAVIGATOR_TTS_VOICE")
  navigator_tts_sample_rate: int = Field(default=24000, env="NAVIGATOR_TTS_SAMPLE_RATE")
  livekit_url: str = Field(default="", env="LIVEKIT_URL")
  livekit_api_key: str = Field(default="", env="LIVEKIT_API_KEY")
  livekit_api_secret: str = Field(default="", env="LIVEKIT_API_SECRET")
  livekit_agent_name: str = Field(default="portfolio-agent", env="LIVEKIT_AGENT_NAME")
  livekit_enable_agent: bool = Field(default=True, env="LIVEKIT_ENABLE_AGENT")
  cors_origins: str = Field(
    default="http://localhost:5173,http://127.0.0.1:5173",
    env="CORS_ORIGINS",
  )
  session_ttl_minutes: int = Field(default=120, env="SESSION_TTL_MINUTES")
  session_max_entries: int = Field(default=1000, env="SESSION_MAX_ENTRIES")
  chroma_persist_dir: str = Field(default="", env="CHROMA_PERSIST_DIR")
  docs_dir: str = Field(default="", env="DOCS_DIR")
  rag_enable_llm_reranker: bool = Field(default=False, env="RAG_ENABLE_LLM_RERANKER")
  rag_llm_reranker_model: str = Field(default="", env="RAG_LLM_RERANKER_MODEL")
  rag_llm_reranker_top_k: int = Field(default=6, env="RAG_LLM_RERANKER_TOP_K")
  rag_final_top_k: int = Field(default=4, env="RAG_FINAL_TOP_K")
  chat_rate_limit_max: int = Field(default=12, env="CHAT_RATE_LIMIT_MAX")
  chat_rate_limit_window_seconds: int = Field(default=60, env="CHAT_RATE_LIMIT_WINDOW_SECONDS")
  contact_rate_limit_max: int = Field(default=3, env="CONTACT_RATE_LIMIT_MAX")
  contact_rate_limit_window_seconds: int = Field(
    default=3600,
    env="CONTACT_RATE_LIMIT_WINDOW_SECONDS",
  )
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
    return self.openai_chat_api_key or self.navigator_api_key or self.openai_api_key

  @property
  def embedding_api_key(self) -> str:
    return self.openai_embedding_api_key or self.navigator_api_key or self.openai_api_key

  @property
  def chat_base_url(self) -> str:
    return self.openai_chat_base_url or self.navigator_base_url or self.openai_base_url

  @property
  def embedding_base_url(self) -> str:
    return self.openai_embedding_base_url or self.navigator_base_url or self.openai_base_url

  @property
  def resolved_contact_recipient(self) -> str:
    return self.contact_recipient or self.smtp_user

  @property
  def vectorstore_collection_name(self) -> str:
    model = self.openai_embedding_model or "default"
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", model).strip("_").lower()
    return f"portfolio_docs_{slug or 'default'}"

  class Config:
    env_file = ".env"
    env_file_encoding = "utf-8"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
  return Settings()
