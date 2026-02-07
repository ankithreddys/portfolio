from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes.chat import router as chat_router


def create_app() -> FastAPI:
  settings = get_settings()
  app = FastAPI(title="Portfolio RAG Chatbot", version="1.0.0")

  app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

  app.include_router(chat_router, prefix="/api")

  @app.get("/api/health")
  def health() -> dict:
    return {"status": "ok"}

  return app


app = create_app()
