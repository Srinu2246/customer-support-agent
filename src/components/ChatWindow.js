import React from 'react';

function ChatWindow({ messages, loading, messagesEndRef }) {
  return (
    <div className="messages-container">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <h4>Welcome to AI Customer Support!</h4>
          <p>Ask me anything about our products and services.</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-bubble">
              {msg.content}
            </div>
          </div>
        ))
      )}
      {loading && (
        <div className="message bot">
          <div className="message-bubble">
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;
