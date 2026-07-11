from __future__ import annotations

import logging
from functools import lru_cache
from typing import Any
import uuid
import httpx

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels
from openai import OpenAI

from app.config import get_settings

logger = logging.getLogger(__name__)


class Document:
  def __init__(self, page_content: str, metadata: dict | None = None):
    self.page_content = page_content
    self.metadata = metadata or {}


class QdrantVectorStoreWrapper:
  def __init__(self, client: QdrantClient, collection_name: str, settings: Any):
    self.client = client
    self.collection_name = collection_name
    self.settings = settings
    
    # Custom client to disable or specify SSL verification
    http_client = httpx.Client(verify=settings.verify_ssl)
    self.openai_client = OpenAI(
      api_key=settings.embedding_api_key,
      base_url=settings.embedding_base_url,
      http_client=http_client,
    )

  def similarity_search_with_score(self, query: str, k: int = 4) -> list[tuple[Document, float]]:
    response = self.openai_client.embeddings.create(
      input=query,
      model=self.settings.openai_embedding_model,
    )
    query_vector = response.data[0].embedding

    results = self.client.query_points(
      collection_name=self.collection_name,
      query=query_vector,
      limit=k,
    )

    docs = []
    for hit in results.points:
      payload = hit.payload or {}
      content = payload.get("page_content", "")
      metadata = payload.get("metadata", {})
      doc = Document(page_content=content, metadata=metadata)
      docs.append((doc, hit.score))
    return docs


  def add_documents(self, documents: list[Document]) -> None:
    if not documents:
      return

    texts = [doc.page_content for doc in documents]
    response = self.openai_client.embeddings.create(
      input=texts,
      model=self.settings.openai_embedding_model,
    )
    embeddings = [item.embedding for item in response.data]

    points = []
    for idx, doc in enumerate(documents):
      points.append(
        qmodels.PointStruct(
          id=str(uuid.uuid4()),
          vector=embeddings[idx],
          payload={
            "page_content": doc.page_content,
            "metadata": doc.metadata,
          }
        )
      )
    self.client.upsert(
      collection_name=self.collection_name,
      points=points,
    )

  def delete(self, ids: list[str]) -> None:
    if not ids:
      return
    self.client.delete(
      collection_name=self.collection_name,
      points_selector=qmodels.PointIdsList(points=ids),
    )


@lru_cache(maxsize=1)
def get_vectorstore() -> QdrantVectorStoreWrapper:
  settings = get_settings()
  if not settings.qdrant_url:
    client = QdrantClient(":memory:")
  else:
    client = QdrantClient(
      url=settings.qdrant_url,
      api_key=settings.qdrant_api_key,
      verify=settings.verify_ssl,
    )

  collection_name = settings.vectorstore_collection_name
  try:
    if not client.collection_exists(collection_name):
      http_client = httpx.Client(verify=settings.verify_ssl)
      openai_client = OpenAI(
        api_key=settings.embedding_api_key,
        base_url=settings.embedding_base_url,
        http_client=http_client,
      )
      sample_vector = openai_client.embeddings.create(
        input="test",
        model=settings.openai_embedding_model,
      ).data[0].embedding
      client.create_collection(
        collection_name=collection_name,
        vectors_config=qmodels.VectorParams(
          size=len(sample_vector),
          distance=qmodels.Distance.COSINE
        )
      )
  except Exception:
    logger.exception("Failed to check or create Qdrant collection")

  return QdrantVectorStoreWrapper(client, collection_name, settings)
