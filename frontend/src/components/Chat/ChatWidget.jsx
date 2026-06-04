import { useState } from 'react'
import Chat from './Chat'
import VoiceMode from './VoiceMode'
import './ChatWidget.css'

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState('menu')
  const [sessionId] = useState(() => {
    const key = 'ragChatSessionId'
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const next = createSessionId()
    localStorage.setItem(key, next)
    return next
  })

  const closeWidget = () => {
    setIsOpen(false)
    setMode('menu')
  }

  const toggleWidget = () => {
    if (isOpen) {
      closeWidget()
      return
    }

    setMode('menu')
    setIsOpen(true)
  }

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <div className="chat-widget-panel" role="dialog" aria-label="Chatbot">
          <div className="chat-widget-header">
            <div>
              <p className="chat-widget-title">Prompt-to-Ankith</p>
              <p className="chat-widget-subtitle">
                {mode === 'menu'
                  ? 'Choose voice or chat'
                  : mode === 'voice'
                    ? 'Voice mode'
                    : 'Chat mode'}
              </p>
            </div>
            <button
              type="button"
              className="chat-widget-close"
              onClick={closeWidget}
              aria-label="Close chatbot"
            >
              x
            </button>
          </div>

          {mode === 'chat' ? <Chat sessionId={sessionId} /> : null}
          {mode !== 'chat' ? (
            <VoiceMode
              sessionId={sessionId}
              mode={mode}
              onChooseVoice={() => setMode('voice')}
              onChooseChat={() => setMode('chat')}
              onBack={() => setMode('menu')}
            />
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className="chat-widget-toggle"
        onClick={toggleWidget}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        <span className="chat-widget-logo" aria-hidden="true">
          chat
        </span>
        <span className="chat-widget-label">Chat with me</span>
      </button>
    </div>
  )
}

export default ChatWidget
