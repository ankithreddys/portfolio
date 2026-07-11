from __future__ import annotations

import hashlib
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from qdrant_client.http import models as qmodels
from dotenv import load_dotenv

from app.config import get_settings
from app.services.vectorstore import get_vectorstore, Document

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


def _split_text(text: str, chunk_size: int = 900, chunk_overlap: int = 120) -> list[str]:
  if len(text) <= chunk_size:
    return [text]

  chunks = []
  start = 0
  while start < len(text):
    end = start + chunk_size
    if end >= len(text):
      chunks.append(text[start:])
      break

    # Try to split at a clean boundary in the overlap region
    overlap_area = text[end - chunk_overlap:end]
    split_idx = overlap_area.rfind('\n\n')
    if split_idx != -1:
      actual_end = end - chunk_overlap + split_idx + 2
    else:
      split_idx = overlap_area.rfind('\n')
      if split_idx != -1:
        actual_end = end - chunk_overlap + split_idx + 1
      else:
        split_idx = overlap_area.rfind(' ')
        if split_idx != -1:
          actual_end = end - chunk_overlap + split_idx + 1
        else:
          actual_end = end

    chunks.append(text[start:actual_end])
    start = actual_end - chunk_overlap
    if start < 0:
      start = 0
    if actual_end <= start:
      start = actual_end
  return chunks


def _split_documents(docs: list[tuple[str, str]]) -> list[Document]:
  chunks: list[Document] = []
  for source, content in docs:
    file_hash = _hash_text(content)
    split_chunks = _split_text(content, chunk_size=900, chunk_overlap=120)
    for chunk in split_chunks:
      chunks.append(
        Document(
          page_content=chunk,
          metadata={"source": source, "file_hash": file_hash},
        )
      )
  return chunks


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

  print(f"Indexed {len(to_add)} new chunks into Qdrant.")
  if deleted:
    print(f"Removed {deleted} stale chunks.")
  if skipped:
    print(f"Skipped {skipped} unchanged files.")


if __name__ == "__main__":
  os.environ.setdefault("PYTHONPATH", str(ROOT))
  main()
