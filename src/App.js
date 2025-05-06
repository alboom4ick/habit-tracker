import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';
import Boards from './pages/Boards';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import History from './pages/History';
import AIMotivation from './pages/AIMotivation';
import AIMood from './pages/AIMood';
import AIHabitCoach from './pages/AIHabitCoach';

function App() {
  return (
    <Router>
      <div className="app">
        <AppBar />
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Boards />} />
            <Route path="/boards" element={<Boards />} />
            <Route path="/boards/:boardId" element={<Boards />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai/motivation" element={<AIMotivation />} />
            <Route path="/ai/mood" element={<AIMood />} />
            <Route path="/ai/coach" element={<AIHabitCoach />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
