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
        <span className="chat-voice-halo" aria-hidden="true" />
        <svg className="chat-voice-wavefield" viewBox="0 0 260 260" aria-hidden="true">
          <defs>
            <linearGradient id="voice-wave-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7b5cff" />
              <stop offset="48%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#63f5c8" />
            </linearGradient>
            <filter id="voice-wave-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="chat-voice-wave-pair wave-pair-inner">
            <path d="M88 98 C72 112 72 148 88 162" />
            <path d="M172 98 C188 112 188 148 172 162" />
          </g>
          <g className="chat-voice-wave-pair wave-pair-middle">
            <path d="M69 80 C39 105 39 155 69 180" />
            <path d="M191 80 C221 105 221 155 191 180" />
          </g>
          <g className="chat-voice-wave-pair wave-pair-outer">
            <path d="M49 61 C5 97 5 163 49 199" />
            <path d="M211 61 C255 97 255 163 211 199" />
          </g>

          <path className="chat-voice-orbit orbit-top" d="M71 66 C103 34 157 34 189 66" />
          <path className="chat-voice-orbit orbit-bottom" d="M71 194 C103 226 157 226 189 194" />
          <circle className="chat-voice-signal signal-one" cx="49" cy="61" r="3" />
          <circle className="chat-voice-signal signal-two" cx="211" cy="199" r="3" />
        </svg>
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
