from __future__ import annotations

import hashlib
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import get_settings
from app.services.vectorstore import get_vectorstore


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


def main() -> None:
  settings = get_settings()
  docs_dir = Path(settings.resolved_docs_dir)
  docs_dir.mkdir(parents=True, exist_ok=True)

  docs = _load_documents(docs_dir)
  if not docs:
    print(f"No documents found in {docs_dir}. Add .txt or .md files first.")
    return

  vectorstore = get_vectorstore()
  collection = vectorstore._collection

  chunks = _split_documents(docs)
  chunks_by_source: dict[str, list[Document]] = {}
  for chunk in chunks:
    chunks_by_source.setdefault(chunk.metadata["source"], []).append(chunk)

  to_add: list[Document] = []
  deleted = 0
  skipped = 0

  for source, source_chunks in chunks_by_source.items():
    file_hash = source_chunks[0].metadata["file_hash"]
    existing = collection.get(where={"source": source})
    existing_ids = existing.get("ids", [])
    existing_hashes = {
      meta.get("file_hash")
      for meta in existing.get("metadatas", [])
      if meta
    }

    if existing_ids and existing_hashes == {file_hash}:
      skipped += 1
      continue

    if existing_ids:
      collection.delete(ids=existing_ids)
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
