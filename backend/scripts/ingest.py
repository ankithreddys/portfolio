from __future__ import annotations

import hashlib
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from qdrant_client.http import models as qmodels
from dotenv import load_dotenv

from app.config import get_settings
from app.services.vectorstore import get_vectorstore

load_dotenv(str(ROOT / ".env"))


def _hash_text(text: str) -> str:
  return hashlib.sha1(text.encode("utf-8")).hexdigest()


def _load_documents(docs_dir: Path) -> list[tuple[str, str]]:
  documents = []
  for path in docs_dir.rglob("*"):
    if path.is_dir():
      continue
    if path.suffix.lower() not in {".txt", ".md"}:
      continue
    content = path.read_text(encoding="utf-8")
    if not content.strip():
      continue
    source = str(path.relative_to(docs_dir))
    documents.append((source, content))
  return documents


def _split_documents(docs: list[tuple[str, str]]) -> list[Document]:
  splitter = RecursiveCharacterTextSplitter(chunk_size=900, chunk_overlap=120)
  chunks: list[Document] = []
  for source, content in docs:
    file_hash = _hash_text(content)
    for chunk in splitter.split_text(content):
      chunks.append(
        Document(
          page_content=chunk,
          metadata={"source": source, "file_hash": file_hash},
        )
      )
  return chunks


# Chroma collection helper removed since we now use Qdrant.


def main() -> None:
  settings = get_settings()
  docs_dir = Path(settings.resolved_docs_dir)
  docs_dir.mkdir(parents=True, exist_ok=True)

  docs = _load_documents(docs_dir)
  if not docs:
    print(f"No documents found in {docs_dir}. Add .txt or .md files first.")
    return

  vectorstore = get_vectorstore()

  chunks = _split_documents(docs)
  chunks_by_source: dict[str, list[Document]] = {}
  for chunk in chunks:
    chunks_by_source.setdefault(chunk.metadata["source"], []).append(chunk)

  to_add: list[Document] = []
  deleted = 0
  skipped = 0

  for source, source_chunks in chunks_by_source.items():
    file_hash = source_chunks[0].metadata["file_hash"]
    client = vectorstore.client
    collection_name = vectorstore.collection_name

    try:
      scroll_result = client.scroll(
        collection_name=collection_name,
        scroll_filter=qmodels.Filter(
          must=[
            qmodels.FieldCondition(
              key="metadata.source",
              match=qmodels.MatchValue(value=source)
            )
          ]
        ),
        with_payload=True,
        with_vectors=False,
      )
      records = scroll_result[0]
    except Exception:
      records = []

    existing_ids = [record.id for record in records]
    existing_hashes = {
      record.payload.get("metadata", {}).get("file_hash")
      for record in records
      if record.payload and "metadata" in record.payload
    }

    if existing_ids and existing_hashes == {file_hash}:
      skipped += 1
      continue

    if existing_ids:
      vectorstore.delete(ids=existing_ids)
      deleted += len(existing_ids)

    to_add.extend(source_chunks)

  if to_add:
    vectorstore.add_documents(to_add)

  print(f"Indexed {len(to_add)} new chunks into Chroma.")
  if deleted:
    print(f"Removed {deleted} stale chunks.")
  if skipped:
    print(f"Skipped {skipped} unchanged files.")


if __name__ == "__main__":
  os.environ.setdefault("PYTHONPATH", str(ROOT))
  main()
