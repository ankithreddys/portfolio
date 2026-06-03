from __future__ import annotations

from app.services.rag import generate_reply
from app.services.sessions import append_message, get_history


def generate_and_store_reply(session_id: str, user_message: str) -> dict | None:
  history = get_history(session_id)
  response = generate_reply(user_message, history)
  if response is None:
    return None

  append_message(session_id, "user", user_message)
  append_message(session_id, "assistant", response["reply"])
  return response
