from __future__ import annotations

from functools import lru_cache

from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_openai import OpenAIEmbeddings

from app.config import get_settings


@lru_cache(maxsize=1)
def get_vectorstore() -> QdrantVectorStore:
  settings = get_settings()
  embeddings = OpenAIEmbeddings(
    model=settings.openai_embedding_model,
    openai_api_key=settings.embedding_api_key,
    openai_api_base=settings.embedding_base_url,
    check_embedding_ctx_length=False,
  )

  if not settings.qdrant_url:
    client = QdrantClient(":memory:")
  else:
    client = QdrantClient(
      url=settings.qdrant_url,
      api_key=settings.qdrant_api_key,
    )

  collection_name = settings.vectorstore_collection_name
  from qdrant_client.http import models as qmodels
  try:
    if not client.collection_exists(collection_name):
      sample_vector = embeddings.embed_query("test")
      client.create_collection(
        collection_name=collection_name,
        vectors_config=qmodels.VectorParams(
          size=len(sample_vector),
          distance=qmodels.Distance.COSINE
        )
      )
  except Exception:
    pass

  return QdrantVectorStore(
    client=client,
    collection_name=collection_name,
    embedding=embeddings,
  )
