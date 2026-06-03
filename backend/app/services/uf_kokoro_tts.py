from __future__ import annotations

import uuid

import httpx

from livekit.agents import tts
from livekit.agents.types import APIConnectOptions, DEFAULT_API_CONNECT_OPTIONS


class UFKokoroTTS(tts.TTS):
  def __init__(
    self,
    *,
    api_key: str,
    base_url: str,
    model: str = "kokoro",
    voice: str = "af_heart",
    sample_rate: int = 24000,
    num_channels: int = 1,
  ) -> None:
    super().__init__(
      capabilities=tts.TTSCapabilities(
        streaming=False,
        aligned_transcript=False,
      ),
      sample_rate=sample_rate,
      num_channels=num_channels,
    )

    self.api_key = api_key
    self.base_url = base_url.rstrip("/")
    self._model = model
    self.voice = voice

  @property
  def model(self) -> str:
    return self._model

  @property
  def provider(self) -> str:
    return "uf-navigator-kokoro"

  def synthesize(
    self,
    text: str,
    *,
    conn_options: APIConnectOptions = DEFAULT_API_CONNECT_OPTIONS,
  ) -> tts.ChunkedStream:
    return _UFKokoroChunkedStream(
      tts=self,
      input_text=text,
      conn_options=conn_options,
    )


class _UFKokoroChunkedStream(tts.ChunkedStream):
  def __init__(
    self,
    *,
    tts: UFKokoroTTS,
    input_text: str,
    conn_options: APIConnectOptions,
  ) -> None:
    super().__init__(
      tts=tts,
      input_text=input_text,
      conn_options=conn_options,
    )
    self._tts: UFKokoroTTS = tts

  async def _run(self, output_emitter: tts.AudioEmitter) -> None:
    request_id = str(uuid.uuid4())
    output_emitter.initialize(
      request_id=request_id,
      sample_rate=self._tts.sample_rate,
      num_channels=self._tts.num_channels,
      mime_type="audio/pcm",
      stream=False,
    )

    url = f"{self._tts.base_url}/audio/speech"
    payload = {
      "model": self._tts.model,
      "voice": self._tts.voice,
      "input": self.input_text,
      "response_format": "pcm",
    }

    timeout = httpx.Timeout(
      timeout=self._conn_options.timeout,
      connect=self._conn_options.timeout,
      read=self._conn_options.timeout,
      write=self._conn_options.timeout,
    )

    async with httpx.AsyncClient(timeout=timeout) as client:
      response = await client.post(
        url,
        headers={
          "Authorization": f"Bearer {self._tts.api_key}",
          "Content-Type": "application/json",
        },
        json=payload,
      )
      response.raise_for_status()
      audio_bytes = response.content

    if not audio_bytes:
      raise RuntimeError("UF Kokoro TTS returned zero audio bytes.")

    output_emitter.push(audio_bytes)
    output_emitter.flush()
