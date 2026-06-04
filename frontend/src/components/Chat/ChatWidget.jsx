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

          {mode === 'menu' ? (
            <div className="chat-mode-picker">
              <p className="chat-mode-picker-title">Hey, I'm Ankith.</p>
              <p className="chat-mode-picker-copy">
                Talk with me in voice mode, or switch to chat if you prefer typing.
              </p>
              <div className="chat-mode-actions">
                <button
                  type="button"
                  className="chat-mode-button"
                  onClick={() => setMode('voice')}
                >
                  Voice mode
                </button>
                <button
                  type="button"
                  className="chat-mode-button secondary"
                  onClick={() => setMode('chat')}
                >
                  Chat mode
                </button>
              </div>
            </div>
          ) : null}

          {mode === 'voice' ? <VoiceMode sessionId={sessionId} onBack={() => setMode('menu')} /> : null}
          {mode === 'chat' ? <Chat sessionId={sessionId} /> : null}
        </div>
      ) : null}

      <button
        type="button"
        className="chat-widget-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
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
