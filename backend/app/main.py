from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes.chat import router as chat_router
from app.routes.livekit import router as livekit_router
from app.services.livekit_worker import (
  livekit_worker_status,
  start_livekit_worker as start_livekit_worker_process,
  stop_livekit_worker as stop_livekit_worker_process,
)


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
  def start_livekit_worker_on_startup() -> None:
    start_livekit_worker_process()

  @app.on_event("shutdown")
  def stop_livekit_worker_on_shutdown() -> None:
    stop_livekit_worker_process()

  @app.get("/api/health")
  def health() -> dict:
    return {
      "status": "ok",
      "livekit_worker": livekit_worker_status(),
    }

  return app


app = create_app()
