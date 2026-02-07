import { useState } from 'react'
import Chat from './Chat'
import './ChatWidget.css'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <div className="chat-widget-panel" role="dialog" aria-label="Chatbot">
          <div className="chat-widget-header">
            <div>
              <p className="chat-widget-title">Prompt-to-Ankith</p>
              <p className="chat-widget-subtitle">Ask about projects and skills</p>
            </div>
            <button
              type="button"
              className="chat-widget-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </div>
          <Chat />
        </div>
      ) : null}

      <button
        type="button"
        className="chat-widget-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        <span className="chat-widget-logo" aria-hidden="true">
          💬
        </span>
        <span className="chat-widget-label">Chat with me</span>
      </button>
    </div>
  )
}

export default ChatWidget
