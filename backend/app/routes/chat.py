import logging

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, Field

from app.services.emailer import send_contact_email
from app.services.conversation import generate_and_store_reply
from app.config import get_settings
from app.services.security import enforce_rate_limit, mask_email


router = APIRouter()
logger = logging.getLogger(__name__)


class ChatRequest(BaseModel):
  session_id: str = Field(
    ...,
    min_length=8,
    max_length=128,
    pattern=r"^[A-Za-z0-9._:-]+$",
  )
  message: str = Field(..., min_length=1, max_length=4000)
  response_mode: str = Field(default="text", max_length=10)


class ChatResponse(BaseModel):
  reply: str


class ContactRequest(BaseModel):
  name: str = Field(..., min_length=1, max_length=120)
  email: str = Field(..., min_length=3, max_length=200)
  message: str = Field(..., min_length=1, max_length=4000)


class ContactResponse(BaseModel):
  status: str


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, http_request: Request) -> ChatResponse:
  settings = get_settings()
  client_ip = http_request.client.host if http_request.client else "unknown"
  if client_ip not in {"127.0.0.1", "localhost"}:
    try:
      enforce_rate_limit(
        f"chat:{client_ip}",
        settings.chat_rate_limit_max,
        settings.chat_rate_limit_window_seconds,
      )
    except PermissionError as exc:
      raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(exc)) from exc

  response = generate_and_store_reply(
    request.session_id,
    request.message,
    response_mode=request.response_mode,
  )

  if response is None:
    raise HTTPException(
      status_code=500,
      detail="Unable to generate a response right now.",
    )

  return ChatResponse(reply=response["reply"])


@router.post("/contact", response_model=ContactResponse)
def contact(request: ContactRequest, http_request: Request) -> ContactResponse:
  settings = get_settings()
  client_ip = http_request.client.host if http_request.client else "unknown"
  try:
    enforce_rate_limit(
      f"contact:{client_ip}",
      settings.contact_rate_limit_max,
      settings.contact_rate_limit_window_seconds,
    )
  except PermissionError as exc:
    raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(exc)) from exc

  logger.info("Received contact request from email=%s", mask_email(request.email))
  try:
    send_contact_email(request.name, request.email, request.message)
  except Exception as exc:
    logger.exception("Contact email failed for email=%s", mask_email(request.email))
    raise HTTPException(status_code=500, detail="Unable to send contact email right now.") from exc

  logger.info("Contact email sent successfully for email=%s", mask_email(request.email))
  return ContactResponse(status="sent")
