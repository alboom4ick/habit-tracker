import React, { useState } from 'react';

const moods = [
  'Happy',
  'Sad',
  'Stressed',
  'Motivated',
  'Tired',
  'Excited',
  'Anxious',
  'Calm'
];

const AIMood = () => {
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchMoodAdvice = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/ai-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood })
      });
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
      <h2>Mood Setting</h2>
      <p>Select your mood for the day and get AI suggestions on how to proceed for the rest of the day.</p>
      <div style={{marginBottom: '1rem'}}>
        <select value={selectedMood} onChange={e => setSelectedMood(e.target.value)}>
          {moods.map(mood => (
            <option key={mood} value={mood}>{mood}</option>
          ))}
        </select>
        <button onClick={fetchMoodAdvice} disabled={loading} style={{marginLeft: '1rem'}}>
          {loading ? 'Thinking...' : 'Get AI Advice'}
        </button>
      </div>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {result && (
        <div className="ai-result" style={{marginTop: '1rem'}}>
          <strong>AI Advice:</strong>
          <div>{result.advice}</div>
        </div>
      )}
    </div>
  );
};

export default AIMood; 