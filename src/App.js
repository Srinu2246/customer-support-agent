import { useState, useRef, useEffect } from 'react';  // ✅ removed unused React import (React 17+)
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const API_BASE = 'http://localhost:5001';  // ✅ was 5000 — must match your server.js PORT

function App() {
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const messagesEndRef            = useRef(null);
  const conversationHistory       = useRef([]);   // ✅ tracks full history for multi-turn context

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message) => {
    const text = message.trim();
    if (!text || loading) return;   // ✅ also block if already loading

    setError('');
    setLoading(true);

    // Optimistically add user message to UI
    const userMessage = {
      id:        `msg-${Date.now()}`,          // ✅ unique id — don't use array index as key
      role:      'user',
      content:   text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    conversationHistory.current.push({ role: 'user', content: text });

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          message: text,
          history: conversationHistory.current.slice(0, -1),  // send previous turns
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Server error: ${res.status}`);  // ✅ use actual error from server
      }

      const reply = data.response;
      conversationHistory.current.push({ role: 'assistant', content: reply });

      const botMessage = {
        id:        `msg-${Date.now()}-ai`,
        role:      'assistant',   // ✅ was 'bot' — should match 'user'/'assistant' convention
        content:   reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      // ✅ rollback the optimistic user message on failure
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      conversationHistory.current.pop();
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Chat error:', err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        AI Customer Support Bot
      </div>

      <ChatWindow
        messages={messages}
        loading={loading}
        messagesEndRef={messagesEndRef}
      />

      {error && (
        <div className="error-message">
          {error}
          <button                                   // ✅ allow user to dismiss the error
            onClick={() => setError('')}
            style={{ marginLeft: 8, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
}

export default App;