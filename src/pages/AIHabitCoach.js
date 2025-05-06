import React, { useState } from 'react';

const AIHabitCoach = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your AI Habit Coach. Ask me anything about habits or self-improvement.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });
      if (!response.ok) throw new Error('Failed to get AI response');
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="ai-page">
      <h2>AI Habit Coach Dialog</h2>
      <p>Chat with your AI habit coach and get answers to your questions about habits and self-improvement.</p>
      <div className="ai-chat-window" style={{border: '1px solid #eee', borderRadius: 8, padding: 16, minHeight: 180, maxWidth: 500, marginBottom: 16}}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{textAlign: msg.sender === 'ai' ? 'left' : 'right', margin: '8px 0'}}>
            <span style={{background: msg.sender === 'ai' ? '#F5EEDD' : '#7AE2CF', borderRadius: 6, padding: '6px 12px', display: 'inline-block'}}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{color: '#999'}}>AI is typing...</div>}
      </div>
      <div style={{display: 'flex', gap: 8, maxWidth: 500}}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          style={{flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc'}}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{padding: '8px 16px'}}>
          Send
        </button>
      </div>
      {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
    </div>
  );
};

export default AIHabitCoach; 