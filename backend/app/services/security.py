from __future__ import annotations

import threading
import time


_RATE_LIMITS: dict[str, list[float]] = {}
_RATE_LIMIT_LOCK = threading.Lock()


def _prune_timestamps(timestamps: list[float], window_seconds: int, now: float) -> list[float]:
  cutoff = now - window_seconds
  return [timestamp for timestamp in timestamps if timestamp > cutoff]


def enforce_rate_limit(key: str, limit: int, window_seconds: int) -> None:
  if limit <= 0 or window_seconds <= 0:
    return

  now = time.time()
  with _RATE_LIMIT_LOCK:
    timestamps = _RATE_LIMITS.get(key, [])
    timestamps = _prune_timestamps(timestamps, window_seconds, now)
    if len(timestamps) >= limit:
      raise PermissionError("Rate limit exceeded.")

    timestamps.append(now)
    _RATE_LIMITS[key] = timestamps


def mask_email(value: str) -> str:
  if "@" not in value:
    return value

  local, domain = value.split("@", 1)
  if len(local) <= 2:
    masked_local = "*" * len(local)
  else:
    masked_local = f"{local[0]}***{local[-1]}"
  return f"{masked_local}@{domain}"

