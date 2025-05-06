const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('OpenAI API Key:', process.env.REACT_APP_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

// 1. Motivational Advice & Habit Suggestions
app.post('/api/ai-motivation', async (req, res) => {
  try {
    const prompt = `Give me a short motivational quote and a beneficial habit suggestion for self-improvement. Format: "Quote: ... Habit: ..."`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 120,
    });
    const text = completion.choices[0].message.content;
    const [quoteLine, habitLine] = text.split('Habit:');
    res.json({
      quote: quoteLine.replace('Quote:', '').trim(),
      habit: habitLine ? habitLine.trim() : '',
    });
  } catch (err) {
    console.error('OpenAI error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Mood Setting
app.post('/api/ai-mood', async (req, res) => {
  try {
    const { mood } = req.body;
    const prompt = `My mood today is "${mood}". Suggest a positive way to proceed for the rest of the day, tailored to this mood.`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });
    res.json({ advice: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error('OpenAI error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. AI Habit Coach Dialog
app.post('/api/ai-coach', async (req, res) => {
  try {
    const { question } = req.body;
    const prompt = `You are an expert habit coach. Answer the following question in a helpful, concise way: ${question}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });
    res.json({ answer: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error('OpenAI error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AI backend running on port ${PORT}`));
