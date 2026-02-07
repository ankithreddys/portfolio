from __future__ import annotations

from datetime import datetime, timedelta

from app.config import get_settings


_SESSIONS: dict[str, dict] = {}


def _now() -> datetime:
  return datetime.utcnow()


def _ttl_delta() -> timedelta:
  settings = get_settings()
  return timedelta(minutes=settings.session_ttl_minutes)


def _prune_expired() -> None:
  now = _now()
  expired = [sid for sid, session in _SESSIONS.items() if session["expires_at"] <= now]
  for sid in expired:
    _SESSIONS.pop(sid, None)


def get_history(session_id: str) -> list[dict]:
  _prune_expired()
  if session_id not in _SESSIONS:
    _SESSIONS[session_id] = {
      "messages": [],
      "expires_at": _now() + _ttl_delta(),
    }
  _SESSIONS[session_id]["expires_at"] = _now() + _ttl_delta()
  return _SESSIONS[session_id]["messages"]


def append_message(session_id: str, role: str, content: str) -> None:
  history = get_history(session_id)
  history.append({"role": role, "content": content})
  history[:] = history[-20:]
