function MessageList({ messages, isLoading, onPromptSelect }) {
  if (!messages.length) {
    return (
      <div className="chat-empty">
        <p className="chat-empty-title">Ask me anything</p>
        <p className="chat-empty-subtitle">
          Try questions about projects, skills, or research interests.
        </p>
        <button
          type="button"
          className="chat-suggestion"
          onClick={() => onPromptSelect('What is the significance of your logo?')}
        >
          What is the significance of your logo?
        </button>
      </div>
    )
  }

  return (
    <div className="chat-messages">
      {messages.map((message, index) => (
        <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
          <div className="chat-bubble">
            <p>{message.content}</p>
          </div>
        </div>
      ))}
      {isLoading ? (
        <div className="chat-message assistant">
          <div className="chat-bubble">
            <p className="chat-typing">Thinking...</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default MessageList
