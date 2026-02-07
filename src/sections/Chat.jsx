/*
  ================================
  CHAT SECTION
  ================================
*/

import Chat from '../components/Chat/Chat'
import './Chat.css'

function ChatSection() {
  return (
    <section className="chat section" id="chat">
      <div className="container">
        <div className="section-header chat-header">
          <span className="section-tag">// Portfolio Assistant</span>
          <h2 className="section-title">
            Ask The <span className="gradient-text">Chatbot</span>
          </h2>
          <p className="section-subtitle">
            This RAG assistant answers questions using the portfolio knowledge base.
          </p>
        </div>
        <Chat />
      </div>
    </section>
  )
}

export default ChatSection
