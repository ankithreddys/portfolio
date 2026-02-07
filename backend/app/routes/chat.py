from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.emailer import send_contact_email
from app.services.rag import generate_reply
from app.services.sessions import append_message, get_history


router = APIRouter()


class ChatRequest(BaseModel):
  session_id: str = Field(..., min_length=8)
  message: str = Field(..., min_length=1, max_length=4000)


class ChatResponse(BaseModel):
  reply: str


class ContactRequest(BaseModel):
  name: str = Field(..., min_length=1, max_length=120)
  email: str = Field(..., min_length=3, max_length=200)
  message: str = Field(..., min_length=1, max_length=4000)


class ContactResponse(BaseModel):
  status: str


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
  history = get_history(request.session_id)
  response = generate_reply(request.message, history)

  if response is None:
    raise HTTPException(
      status_code=500,
      detail="Unable to generate a response. Check your API key and index.",
    )

  append_message(request.session_id, "user", request.message)
  append_message(request.session_id, "assistant", response["reply"])

  return ChatResponse(reply=response["reply"])


@router.post("/contact", response_model=ContactResponse)
def contact(request: ContactRequest) -> ContactResponse:
  try:
    send_contact_email(request.name, request.email, request.message)
  except Exception as exc:
    raise HTTPException(status_code=500, detail=str(exc)) from exc

  return ContactResponse(status="sent")
