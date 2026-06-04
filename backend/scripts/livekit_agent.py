from __future__ import annotations

import asyncio
import json
import logging
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import (
  Agent,
  AgentServer,
  AgentSession,
  TurnHandlingOptions,
)
from livekit.plugins import openai, silero

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
  sys.path.insert(0, str(BACKEND_ROOT))

from app.config import get_settings
from app.services.conversation import generate_and_store_reply
from app.services.uf_kokoro_tts import UFKokoroTTS


load_dotenv(str(BACKEND_ROOT / ".env"))
load_dotenv(str(BACKEND_ROOT / ".env.local"))

settings = get_settings()
logger = logging.getLogger(__name__)
VOICE_GREETING_VERSION = "assistant-v3"
VOICE_GREETING = (
  "Hi! I'm the AI assistant for Ankith's portfolio. It's great to meet you. "
  "Select Voice mode to continue talking with me."
)


def _build_tts() -> UFKokoroTTS:
  return UFKokoroTTS(
    api_key=settings.chat_api_key or settings.navigator_api_key,
    base_url=settings.chat_base_url or settings.navigator_base_url,
    model=settings.navigator_tts_model,
    voice=settings.navigator_tts_voice,
    sample_rate=settings.navigator_tts_sample_rate,
    num_channels=1,
  )


async def _speak_reply(session: AgentSession, room_name: str, message: str) -> None:
  started_at = time.perf_counter()
  try:
    await session.interrupt()
  except RuntimeError:
    pass

  response = await asyncio.to_thread(
    generate_and_store_reply,
    room_name,
    message,
    "voice",
  )
  rag_ms = (time.perf_counter() - started_at) * 1000
  if not response:
    await session.say(
      "I'm having trouble answering that right now. Please try again.",
      allow_interruptions=True,
      add_to_chat_ctx=False,
    )
    return

  logger.info("Voice reply ready rag_ms=%.1f", rag_ms)
  await session.say(
    response["reply"],
    allow_interruptions=True,
    add_to_chat_ctx=False,
  )
  logger.info(
    "Voice reply playback completed rag_ms=%.1f total_ms=%.1f",
    rag_ms,
    (time.perf_counter() - started_at) * 1000,
  )


def _queue_response(session: AgentSession, room_name: str, message: str) -> None:
  message = message.strip()
  if not message:
    return

  asyncio.get_running_loop().create_task(_speak_reply(session, room_name, message))


server = AgentServer()


@server.rtc_session(agent_name=settings.livekit_agent_name)
async def entrypoint(ctx: agents.JobContext):
  started_at = time.perf_counter()
  if not settings.livekit_url:
    raise RuntimeError("LIVEKIT_URL is not configured.")
  if not settings.livekit_api_key or not settings.livekit_api_secret:
    raise RuntimeError("LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be configured.")
  if not settings.chat_api_key or not settings.chat_base_url:
    raise RuntimeError("Navigator/OpenAI chat credentials are not configured.")

  session = AgentSession(
    stt=openai.STT(
      model=settings.navigator_stt_model,
      api_key=settings.chat_api_key or settings.navigator_api_key,
      base_url=settings.chat_base_url or settings.navigator_base_url,
      language="en",
    ),
    tts=_build_tts(),
    vad=silero.VAD.load(),
    turn_handling=TurnHandlingOptions(
      interruption={
        "enabled": True,
        "mode": "adaptive",
        "min_duration": 0.4,
        "min_words": 0,
        "discard_audio_if_uninterruptible": True,
        "false_interruption_timeout": 2.0,
        "resume_false_interruption": True,
      }
    ),
  )

  room_name = getattr(ctx.room, "name", "") or "portfolio-voice"
  session_id = room_name
  try:
    metadata = json.loads(getattr(ctx.job, "metadata", "") or "{}")
    session_id = metadata.get("session_id") or room_name
  except json.JSONDecodeError:
    pass

  agent = Agent(
    instructions=(
      "You are Ankith's AI assistant, not Ankith. "
      "Be a friendly, natural voice host focused on his portfolio facts. "
      "Let the shared backend RAG service determine the answer."
    )
  )

  @session.on("user_input_transcribed")
  def on_user_input_transcribed(event):
    if not getattr(event, "is_final", False):
      return
    transcript = getattr(event, "transcript", "") or ""
    _queue_response(session, session_id, transcript)

  await session.start(
    room=ctx.room,
    agent=agent,
  )
  logger.info("LiveKit voice session ready in %.1fms", (time.perf_counter() - started_at) * 1000)

  logger.info("Speaking initial greeting version=%s", VOICE_GREETING_VERSION)
  await session.say(
    VOICE_GREETING,
    allow_interruptions=True,
    add_to_chat_ctx=False,
  )
  logger.info("Initial greeting completed in %.1fms", (time.perf_counter() - started_at) * 1000)


if __name__ == "__main__":
  agents.cli.run_app(server)
