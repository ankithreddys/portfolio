from __future__ import annotations

from functools import lru_cache

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

from app.config import get_settings


@lru_cache(maxsize=1)
def get_vectorstore() -> Chroma:
  settings = get_settings()
  embeddings = OpenAIEmbeddings(
    model=settings.openai_embedding_model,
    openai_api_key=settings.embedding_api_key,
    openai_api_base=settings.embedding_base_url,
  )
  return Chroma(
    collection_name="portfolio_docs",
    persist_directory=settings.resolved_chroma_dir,
    embedding_function=embeddings,
  )
