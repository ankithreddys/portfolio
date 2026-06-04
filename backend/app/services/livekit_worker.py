from __future__ import annotations

import logging
import os
import subprocess
import sys
from pathlib import Path

from app.config import get_settings


logger = logging.getLogger(__name__)
_worker_process: subprocess.Popen | None = None


def livekit_worker_status() -> str:
  settings = get_settings()
  if not (settings.livekit_url and settings.livekit_api_key and settings.livekit_api_secret):
    return "not_configured"
  if _worker_process is None:
    return "not_started"

  exit_code = _worker_process.poll()
  if exit_code is None:
    return "running"
  return f"exited:{exit_code}"


def start_livekit_worker() -> None:
  global _worker_process
  settings = get_settings()
  if not (settings.livekit_url and settings.livekit_api_key and settings.livekit_api_secret):
    logger.warning("Skipping LiveKit worker startup because credentials are incomplete.")
    return
  if _worker_process and _worker_process.poll() is None:
    return

  script_path = Path(__file__).resolve().parents[2] / "scripts" / "livekit_agent.py"
  env = os.environ.copy()
  env.setdefault("PYTHONUNBUFFERED", "1")
  _worker_process = subprocess.Popen(
    [sys.executable, str(script_path), "start"],
    cwd=str(script_path.parent.parent),
    env=env,
  )
  logger.warning("Started LiveKit worker process pid=%s", _worker_process.pid)


def stop_livekit_worker() -> None:
  global _worker_process
  if not _worker_process or _worker_process.poll() is not None:
    _worker_process = None
    return

  _worker_process.terminate()
  try:
    _worker_process.wait(timeout=10)
  except subprocess.TimeoutExpired:
    _worker_process.kill()
  finally:
    _worker_process = None
