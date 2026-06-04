import { useEffect, useRef, useState } from 'react'
import {
  ConnectionState,
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  TrackToggle,
  useRemoteParticipants,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import { fetchLiveKitToken } from '../../services/api'

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `voice-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function VoiceConnectionStatus() {
  const remoteParticipants = useRemoteParticipants()
  const agentConnected = remoteParticipants.length > 0

  return (
    <div className="chat-voice-diagnostics" aria-live="polite">
      <span>
        Room: <ConnectionState />
      </span>
      <span>{agentConnected ? 'Agent connected' : 'Waiting for voice agent...'}</span>
    </div>
  )
}

function VoiceMode({ sessionId, onBack }) {
  const [voiceError, setVoiceError] = useState('')
  const [voiceLoading, setVoiceLoading] = useState(true)
  const [voiceToken, setVoiceToken] = useState('')
  const [voiceUrl, setVoiceUrl] = useState('')
  const [voiceRoom, setVoiceRoom] = useState('')
  const [roomConnected, setRoomConnected] = useState(false)
  const [voiceIdentity, setVoiceIdentity] = useState(() => createSessionId())
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
      setVoiceLoading(true)
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
        setVoiceRoom(response.room)
      } catch (err) {
        if (cancelled || !mountedRef.current) return
        setVoiceError(err.message || 'Unable to start voice mode.')
      } finally {
        if (!cancelled && mountedRef.current) {
          setVoiceLoading(false)
        }
      }
    }

    startVoice()

    return () => {
      cancelled = true
    }
  }, [sessionId, voiceIdentity])

  const resetIdentity = () => {
    setVoiceIdentity(createSessionId())
    setVoiceToken('')
    setVoiceUrl('')
    setVoiceRoom('')
    setRoomConnected(false)
    setVoiceError('')
  }

  const handleDisconnected = () => {
    resetIdentity()
    onBack()
  }

  return (
    <div className="chat-voice-panel">
      <div className="chat-voice-copy">
        <p className="chat-voice-title">Hey, I'm Ankith.</p>
        <p className="chat-voice-subtitle">
          Let's keep talking in voice mode. I'll answer using the same portfolio brain as chat.
        </p>
      </div>

      <div className="chat-voice-room">
        <span className={`chat-voice-status ${roomConnected ? 'active' : ''}`}>
          {voiceLoading
            ? 'Getting secure room access...'
            : roomConnected
              ? 'Voice room connected'
              : voiceRoom
                ? 'Joining voice room...'
                : 'Ready'}
        </span>
        <button type="button" className="chat-voice-link" onClick={handleDisconnected}>
          Back to menu
        </button>
      </div>

      {voiceError ? <p className="chat-error">{voiceError}</p> : null}

      {voiceToken && voiceUrl ? (
        <LiveKitRoom
          serverUrl={voiceUrl}
          token={voiceToken}
          connect
          audio
          video={false}
          onConnected={() => {
            setRoomConnected(true)
            setVoiceError('')
          }}
          onDisconnected={handleDisconnected}
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
          <StartAudio label="Click to allow audio playback" />
          <RoomAudioRenderer />
          <VoiceConnectionStatus />
          <div className="chat-voice-room">
            <TrackToggle
              source={Track.Source.Microphone}
              initialState
              onDeviceError={(err) => {
                setVoiceError(err?.message || 'Microphone access failed.')
              }}
            >
              Microphone
            </TrackToggle>
          </div>
        </LiveKitRoom>
      ) : null}
    </div>
  )
}

export default VoiceMode
