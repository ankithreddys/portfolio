import { useEffect, useRef } from 'react'

function MessageInput({ value, onValueChange, onSend, isLoading, focusSignal }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [isLoading, focusSignal])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!value.trim()) return
    onSend(value)
    onValueChange('')
    inputRef.current?.focus()
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSubmit(event)
          }
        }}
        placeholder="Ask about the portfolio..."
        rows="2"
        disabled={isLoading}
      />
      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}

export default MessageInput
