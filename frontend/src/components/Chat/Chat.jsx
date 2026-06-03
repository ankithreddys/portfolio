import { useEffect, useRef, useState } from 'react'
import { LiveKitRoom, RoomAudioRenderer, TrackToggle } from '@livekit/components-react'
import { Track } from 'livekit-client'
import { fetchLiveKitToken, sendChatMessage } from '../../services/api'
import MessageInput from './MessageInput'
import MessageList from './MessageList'
import './Chat.css'

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const getSessionId = () => {
  const key = 'ragChatSessionId'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const sessionId = createSessionId()
  localStorage.setItem(key, sessionId)
  return sessionId
}

function Chat() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [voiceError, setVoiceError] = useState('')
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceToken, setVoiceToken] = useState('')
  const [voiceUrl, setVoiceUrl] = useState('')
  const [voiceRoom, setVoiceRoom] = useState('')
  const [focusSignal, setFocusSignal] = useState(0)
  const sessionIdRef = useRef('')
  const voiceIdentityRef = useRef('')
  const chatWindowRef = useRef(null)

  useEffect(() => {
    sessionIdRef.current = getSessionId()
    voiceIdentityRef.current = createSessionId()
  }, [])

  useEffect(() => {
    if (!chatWindowRef.current) return
    const userMessages = chatWindowRef.current.querySelectorAll('.chat-message.user')
    if (userMessages.length === 0) return
    const lastQuestion = userMessages[userMessages.length - 1]
    lastQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [messages, isLoading])

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError('')

    try {
      const response = await sendChatMessage({
        sessionId: sessionIdRef.current,
        message: text,
      })
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
        },
      ])
    } catch (err) {
      setError('Unable to reach the chatbot. Check the backend server.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptSelect = (prompt) => {
    setInputValue(prompt)
    setFocusSignal((prev) => prev + 1)
    handleSend(prompt)
    setInputValue('')
  }

  const startVoiceMode = async () => {
    if (voiceLoading || voiceEnabled) return

    setVoiceLoading(true)
    setVoiceError('')

    try {
      const response = await fetchLiveKitToken({
        sessionId: sessionIdRef.current,
        identity: voiceIdentityRef.current,
        name: 'Portfolio visitor',
      })

      setVoiceToken(response.token)
      setVoiceUrl(response.url)
      setVoiceRoom(response.room)
      setVoiceEnabled(true)
    } catch (err) {
      setVoiceError(err.message || 'Unable to start voice mode.')
    } finally {
      setVoiceLoading(false)
    }
  }

  const stopVoiceMode = () => {
    setVoiceEnabled(false)
    setVoiceToken('')
    setVoiceUrl('')
    setVoiceRoom('')
    setVoiceError('')
    voiceIdentityRef.current = createSessionId()
  }

  return (
    <div className="chat-card">
      <div className="chat-voice-panel">
        <div className="chat-voice-copy">
          <p className="chat-voice-title">Voice mode</p>
          <p className="chat-voice-subtitle">
            Talk to the same portfolio brain through LiveKit, while text chat stays available.
          </p>
        </div>
        <div className="chat-voice-actions">
          {!voiceEnabled ? (
            <button
              type="button"
              className="chat-voice-button"
              onClick={startVoiceMode}
              disabled={voiceLoading}
            >
              {voiceLoading ? 'Starting voice...' : 'Start voice'}
            </button>
          ) : (
            <button type="button" className="chat-voice-button secondary" onClick={stopVoiceMode}>
              Stop voice
            </button>
          )}
        </div>
        {voiceError ? <p className="chat-error">{voiceError}</p> : null}
        {voiceEnabled && voiceToken && voiceUrl ? (
          <LiveKitRoom
            serverUrl={voiceUrl}
            token={voiceToken}
            connect={voiceEnabled}
            audio={true}
            video={false}
            onDisconnected={stopVoiceMode}
            onError={(err) => {
              setVoiceEnabled(false)
              setVoiceError(err?.message || 'LiveKit connection failed.')
            }}
          >
            <RoomAudioRenderer />
            <div className="chat-voice-room">
              <span className={`chat-voice-status ${voiceRoom ? 'active' : ''}`}>
                {voiceRoom ? `Connected to ${voiceRoom}` : 'Connecting...'}
              </span>
              <TrackToggle source={Track.Source.Microphone} />
            </div>
          </LiveKitRoom>
        ) : null}
      </div>
      <div className="chat-window" ref={chatWindowRef}>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onPromptSelect={handlePromptSelect}
        />
      </div>
      {error ? <p className="chat-error">{error}</p> : null}
      <MessageInput
        value={inputValue}
        onValueChange={setInputValue}
        onSend={handleSend}
        isLoading={isLoading}
        focusSignal={focusSignal}
      />
    </div>
  )
}

export default Chat
