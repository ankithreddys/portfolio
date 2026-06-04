from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from threading import Lock

from app.config import get_settings


_DB_LOCK = Lock()
_DB_PATH = Path(__file__).resolve().parents[2] / "data" / "sessions.sqlite3"


def _now_ts() -> float:
  from datetime import datetime, timezone

  return datetime.now(timezone.utc).timestamp()


def _ttl_seconds() -> int:
  settings = get_settings()
  return max(1, settings.session_ttl_minutes) * 60


def _ensure_db() -> None:
  _DB_PATH.parent.mkdir(parents=True, exist_ok=True)
  with sqlite3.connect(_DB_PATH, timeout=30) as conn:
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute("PRAGMA busy_timeout=30000;")
    conn.execute(
      """
      CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        messages TEXT NOT NULL,
        expires_at REAL NOT NULL
      )
      """
    )
    conn.execute("CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)")
    conn.commit()


def _connect() -> sqlite3.Connection:
  _ensure_db()
  conn = sqlite3.connect(_DB_PATH, timeout=30)
  conn.row_factory = sqlite3.Row
  conn.execute("PRAGMA busy_timeout=30000;")
  return conn


def _decode_messages(raw: str | None) -> list[dict]:
  if not raw:
    return []
  try:
    messages = json.loads(raw)
  except json.JSONDecodeError:
    return []
  if not isinstance(messages, list):
    return []
  return [message for message in messages if isinstance(message, dict)]


def _encode_messages(messages: list[dict]) -> str:
  return json.dumps(messages, ensure_ascii=False)


def _prune_expired(conn: sqlite3.Connection) -> None:
  now = _now_ts()
  conn.execute("DELETE FROM sessions WHERE expires_at <= ?", (now,))


def _enforce_capacity(conn: sqlite3.Connection) -> None:
  settings = get_settings()
  max_entries = max(1, settings.session_max_entries)
  count = conn.execute("SELECT COUNT(*) AS count FROM sessions").fetchone()["count"]
  excess = int(count) - max_entries
  if excess <= 0:
    return

  conn.execute(
    """
    DELETE FROM sessions
    WHERE session_id IN (
      SELECT session_id
      FROM sessions
      ORDER BY expires_at ASC
      LIMIT ?
    )
    """,
    (excess,),
  )


def _load_session(conn: sqlite3.Connection, session_id: str) -> list[dict]:
  row = conn.execute(
    "SELECT messages, expires_at FROM sessions WHERE session_id = ?",
    (session_id,),
  ).fetchone()
  if row is None:
    messages: list[dict] = []
    conn.execute(
      "INSERT OR REPLACE INTO sessions(session_id, messages, expires_at) VALUES (?, ?, ?)",
      (session_id, _encode_messages(messages), _now_ts() + _ttl_seconds()),
    )
    return messages

  expires_at = float(row["expires_at"])
  if expires_at <= _now_ts():
    messages = []
    conn.execute(
      "UPDATE sessions SET messages = ?, expires_at = ? WHERE session_id = ?",
      (_encode_messages(messages), _now_ts() + _ttl_seconds(), session_id),
    )
    return messages

  return _decode_messages(row["messages"])


def get_history(session_id: str) -> list[dict]:
  with _DB_LOCK:
    with _connect() as conn:
      _prune_expired(conn)
      _enforce_capacity(conn)
      messages = _load_session(conn, session_id)
      conn.execute(
        "UPDATE sessions SET expires_at = ? WHERE session_id = ?",
        (_now_ts() + _ttl_seconds(), session_id),
      )
      conn.commit()
      return messages


def append_message(session_id: str, role: str, content: str) -> None:
  with _DB_LOCK:
    with _connect() as conn:
      _prune_expired(conn)
      _enforce_capacity(conn)
      history = _load_session(conn, session_id)
      history.append({"role": role, "content": content})
      history = history[-20:]
      conn.execute(
        """
        INSERT OR REPLACE INTO sessions(session_id, messages, expires_at)
        VALUES (?, ?, ?)
        """,
        (session_id, _encode_messages(history), _now_ts() + _ttl_seconds()),
      )
      conn.commit()
