import React, { useState } from 'react';

const AIMotivation = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchMotivation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/ai-motivation', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to fetch AI advice');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <h2>Motivational Advice & Habit Suggestions</h2>
      <p>Get motivational quotes, advice, and AI-powered habit suggestions tailored to your choices.</p>
      <button onClick={fetchMotivation} disabled={loading} style={{marginBottom: '1rem'}}>
        {loading ? 'Thinking...' : 'Get Motivation & Habit Suggestion'}
      </button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {result && (
        <div className="ai-result" style={{marginTop: '1rem'}}>
          <strong>Motivational Quote:</strong>
          <div style={{marginBottom: '0.5rem'}}>{result.quote}</div>
          <strong>Habit Suggestion:</strong>
          <div>{result.habit}</div>
        </div>
      )}
    </div>
  );
};

export default AIMotivation; 