from __future__ import annotations

import asyncio
from pathlib import Path

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import Agent, AgentServer, AgentSession, TurnHandlingOptions, room_io
from livekit.plugins import openai, silero

from app.config import get_settings
from app.services.conversation import generate_and_store_reply
from app.services.uf_kokoro_tts import UFKokoroTTS


BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(str(BASE_DIR / ".env"))
load_dotenv(str(BASE_DIR / ".env.local"))

settings = get_settings()
AGENT_NAME = settings.livekit_agent_name


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
  response = await asyncio.to_thread(generate_and_store_reply, room_name, message)
  if not response:
    await session.say(
      "I'm having trouble answering that right now. Please try again.",
      allow_interruptions=True,
    )
    return

  await session.say(
    response["reply"],
    allow_interruptions=True,
    add_to_chat_ctx=False,
  )


def _handle_text_input(session: AgentSession, room_name: str, event: room_io.TextInputEvent) -> None:
  message = (event.text or "").strip()
  if not message:
    return

  session.interrupt()
  asyncio.get_running_loop().create_task(_speak_reply(session, room_name, message))


server = AgentServer()


@server.rtc_session(agent_name=AGENT_NAME)
async def entrypoint(ctx: agents.JobContext):
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
  agent = Agent(
    instructions=(
      "You are the voice interface for Ankith's portfolio assistant. "
      "Keep replies concise, warm, and focused on portfolio facts. "
      "Let the shared backend RAG service determine the answer."
    )
  )

  await session.start(
    room=ctx.room,
    agent=agent,
    room_options=room_io.RoomOptions(
      text_input=room_io.TextInputOptions(
        text_input_cb=lambda sess, event: _handle_text_input(sess, room_name, event)
      )
    ),
  )

  await session.say(
    "Hi, I'm connected and ready. You can speak now, and interrupt me anytime.",
    allow_interruptions=True,
  )


if __name__ == "__main__":
  agents.cli.run_app(server)
