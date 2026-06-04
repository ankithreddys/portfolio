from __future__ import annotations

import json
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from livekit.api import AccessToken, RoomAgentDispatch, RoomConfiguration, VideoGrants

from app.config import get_settings


router = APIRouter()


class LiveKitTokenRequest(BaseModel):
  session_id: str = Field(..., min_length=8, max_length=128, pattern=r"^[A-Za-z0-9._:-]+$")
  identity: str | None = Field(default=None, min_length=1, max_length=128)
  name: str | None = Field(default=None, min_length=1, max_length=128)


class LiveKitTokenResponse(BaseModel):
  url: str
  token: str
  room: str
  identity: str


@router.post("/livekit/token", response_model=LiveKitTokenResponse)
def create_token(request: LiveKitTokenRequest) -> LiveKitTokenResponse:
  settings = get_settings()
  if not settings.livekit_url:
    raise HTTPException(status_code=500, detail="LIVEKIT_URL is not configured.")
  if not settings.livekit_api_key or not settings.livekit_api_secret:
    raise HTTPException(status_code=500, detail="LiveKit credentials are not configured.")

  identity = request.identity or f"voice-{uuid.uuid4().hex[:12]}"
  room = f"voice-{uuid.uuid4().hex}"
  token = (
    AccessToken(settings.livekit_api_key, settings.livekit_api_secret)
    .with_identity(identity)
    .with_name(request.name or "Portfolio visitor")
    .with_grants(
      VideoGrants(
        room_join=True,
        room=room,
        can_publish=True,
        can_subscribe=True,
        can_publish_data=True,
      )
    )
    .with_room_config(
      RoomConfiguration(
        agents=[
          RoomAgentDispatch(
            agent_name=settings.livekit_agent_name,
            metadata=json.dumps({"session_id": request.session_id}),
          )
        ]
      )
    )
    .to_jwt()
  )

  return LiveKitTokenResponse(
    url=settings.livekit_url,
    token=token,
    room=room,
    identity=identity,
  )
