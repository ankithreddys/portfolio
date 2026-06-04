from __future__ import annotations

import logging
import os
import subprocess
import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes.chat import router as chat_router
from app.routes.livekit import router as livekit_router


logger = logging.getLogger(__name__)
_livekit_worker_process: subprocess.Popen | None = None


def _start_livekit_worker() -> None:
  global _livekit_worker_process
  settings = get_settings()
  if not settings.livekit_enable_agent:
    logger.info("LiveKit worker autostart is disabled.")
    return
  if not (settings.livekit_url and settings.livekit_api_key and settings.livekit_api_secret):
    logger.info("Skipping LiveKit worker autostart because credentials are incomplete.")
    return
  if _livekit_worker_process and _livekit_worker_process.poll() is None:
    return

  script_path = Path(__file__).resolve().parents[1] / "scripts" / "livekit_agent.py"
  env = os.environ.copy()
  env.setdefault("PYTHONUNBUFFERED", "1")
  _livekit_worker_process = subprocess.Popen(
    [sys.executable, str(script_path)],
    cwd=str(script_path.parent.parent),
    env=env,
  )
  logger.info("Started LiveKit worker process pid=%s", _livekit_worker_process.pid)


def _stop_livekit_worker() -> None:
  global _livekit_worker_process
  if not _livekit_worker_process or _livekit_worker_process.poll() is not None:
    _livekit_worker_process = None
    return

  _livekit_worker_process.terminate()
  try:
    _livekit_worker_process.wait(timeout=10)
  except subprocess.TimeoutExpired:
    _livekit_worker_process.kill()
  finally:
    _livekit_worker_process = None


def create_app() -> FastAPI:
  settings = get_settings()
  app = FastAPI(title="Portfolio RAG Chatbot", version="1.0.0")

  app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
  )

  @app.middleware("http")
  async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    )
    return response

  app.include_router(chat_router, prefix="/api")
  app.include_router(livekit_router, prefix="/api")

  @app.on_event("startup")
  def start_livekit_worker() -> None:
    _start_livekit_worker()

  @app.on_event("shutdown")
  def stop_livekit_worker() -> None:
    _stop_livekit_worker()

  @app.get("/api/health")
  def health() -> dict:
    return {"status": "ok"}

  return app


app = create_app()
