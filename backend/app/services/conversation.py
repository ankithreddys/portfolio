from __future__ import annotations

import logging
import time

from app.services.rag import generate_reply
from app.services.sessions import append_messages, get_history


logger = logging.getLogger(__name__)


def generate_and_store_reply(session_id: str, user_message: str) -> dict | None:
  started_at = time.perf_counter()
  history = get_history(session_id)
  history_ms = (time.perf_counter() - started_at) * 1000

  generation_started_at = time.perf_counter()
  response = generate_reply(user_message, history)
  generation_ms = (time.perf_counter() - generation_started_at) * 1000
  if response is None:
    return None

  persistence_started_at = time.perf_counter()
  append_messages(
    session_id,
    [
      {"role": "user", "content": user_message},
      {"role": "assistant", "content": response["reply"]},
    ],
  )
  persistence_ms = (time.perf_counter() - persistence_started_at) * 1000
  logger.info(
    "Conversation latency history_ms=%.1f generation_ms=%.1f persistence_ms=%.1f total_ms=%.1f",
    history_ms,
    generation_ms,
    persistence_ms,
    (time.perf_counter() - started_at) * 1000,
  )
  return response
