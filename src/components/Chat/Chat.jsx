import { useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../../services/api'
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
  const [focusSignal, setFocusSignal] = useState(0)
  const sessionIdRef = useRef('')
  const chatWindowRef = useRef(null)

  useEffect(() => {
    sessionIdRef.current = getSessionId()
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

  return (
    <div className="chat-card">
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
