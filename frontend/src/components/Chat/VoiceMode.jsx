import { useEffect, useRef, useState } from 'react'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  TrackToggle,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import { fetchLiveKitToken } from '../../services/api'

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `voice-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const microphoneIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 1 0-7 0v6a3.5 3.5 0 0 0 3.5 3.5Z" />
    <path d="M5.5 11.5v.5a6.5 6.5 0 0 0 13 0v-.5M12 18.5V22M8.5 22h7" />
  </svg>
)

function VoiceMode({ sessionId, mode, onChooseVoice, onChooseChat, onBack }) {
  const [voiceError, setVoiceError] = useState('')
  const [voiceToken, setVoiceToken] = useState('')
  const [voiceUrl, setVoiceUrl] = useState('')
  const [roomConnected, setRoomConnected] = useState(false)
  const [voiceIdentity] = useState(() => createSessionId())
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const startVoice = async () => {
      setVoiceError('')

      try {
        const response = await fetchLiveKitToken({
          sessionId,
          identity: voiceIdentity,
          name: 'Portfolio visitor',
        })

        if (cancelled || !mountedRef.current) return

        setVoiceToken(response.token)
        setVoiceUrl(response.url)
      } catch (err) {
        if (cancelled || !mountedRef.current) return
        setVoiceError(err.message || 'Unable to start voice mode.')
      }
    }

    startVoice()

    return () => {
      cancelled = true
    }
  }, [sessionId, voiceIdentity])

  const handleBack = () => {
    onBack()
  }

  const renderVoiceStage = (microphoneControl = null) => (
    <div
      className={`chat-voice-stage ${roomConnected ? 'connected' : ''}`}
      aria-label={
        voiceError || (roomConnected ? 'Voice assistant connected' : 'Connecting voice assistant')
      }
    >
      <div className="chat-voice-orb">
        <span className="chat-voice-ring ring-one" aria-hidden="true" />
        <span className="chat-voice-ring ring-two" aria-hidden="true" />
        <span className="chat-voice-ring ring-three" aria-hidden="true" />
        {microphoneControl || (
          <span className="chat-voice-microphone chat-voice-microphone-placeholder">
            {microphoneIcon}
          </span>
        )}
      </div>
      <button type="button" className="chat-voice-link" onClick={handleBack}>
        Back to menu
      </button>
    </div>
  )

  const menuContent = (
    <div className="chat-mode-picker">
      <p className="chat-mode-picker-title">Hey, I'm Ankith's AI assistant.</p>
      <p className="chat-mode-picker-copy">
        Talk with me in voice mode, or switch to chat if you prefer typing.
      </p>
      <div className="chat-mode-actions">
        <button type="button" className="chat-mode-button" onClick={onChooseVoice}>
          Voice mode
        </button>
        <button type="button" className="chat-mode-button secondary" onClick={onChooseChat}>
          Chat mode
        </button>
      </div>
      {voiceError ? <p className="chat-error">{voiceError}</p> : null}
    </div>
  )

  if (!voiceToken || !voiceUrl) {
    return mode === 'menu' ? menuContent : renderVoiceStage()
  }

  return (
    <LiveKitRoom
      serverUrl={voiceUrl}
      token={voiceToken}
      connect
      audio={mode === 'voice'}
      video={false}
      onConnected={() => {
        setRoomConnected(true)
        setVoiceError('')
      }}
      onDisconnected={() => {
        setRoomConnected(false)
      }}
      onMediaDeviceFailure={(_, kind) => {
        setVoiceError(
          kind === 'audioinput'
            ? 'Microphone access failed. Allow microphone permission and try again.'
            : 'A media device could not be started.',
        )
      }}
      onError={(err) => {
        setVoiceError(err?.message || 'LiveKit connection failed.')
      }}
    >
      <StartAudio
        label=""
        className="chat-voice-audio-unlock"
        aria-label="Enable voice playback"
      />
      <RoomAudioRenderer />
      {mode === 'menu'
        ? menuContent
        : renderVoiceStage(
            <TrackToggle
              source={Track.Source.Microphone}
              initialState
              showIcon={false}
              className="chat-voice-microphone"
              aria-label="Toggle microphone"
              onDeviceError={(err) => {
                setVoiceError(err?.message || 'Microphone access failed.')
              }}
            >
              {microphoneIcon}
            </TrackToggle>,
          )}
    </LiveKitRoom>
  )
}

export default VoiceMode
