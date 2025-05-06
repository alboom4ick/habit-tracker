import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { 
  MdDashboard, 
  MdAnalytics, 
  MdSettings,
  MdChevronLeft,
  MdHistory,
  MdPsychology,
  MdEmojiEmotions,
  MdChat
} from 'react-icons/md';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { text: 'Boards', icon: <MdDashboard />, path: '/boards' },
    { text: 'History', icon: <MdHistory />, path: '/history' },
    { text: 'Analytics', icon: <MdAnalytics />, path: '/analytics' },
    { text: 'Settings', icon: <MdSettings />, path: '/settings' }
  ];

  const aiAssistantItems = [
    { text: 'Motivational Advice & Habit Suggestions', icon: <MdPsychology />, path: '/ai/motivation' },
    { text: 'Mood Setting', icon: <MdEmojiEmotions />, path: '/ai/mood' },
    { text: 'AI Habit Coach Dialog', icon: <MdChat />, path: '/ai/coach' }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className={`logo-text ${!isOpen && 'hidden'}`}>Atomic Habits</span>
        </div>
        <button className="shrink-button" onClick={toggleSidebar}>
          <MdChevronLeft className={`shrink-icon ${!isOpen && 'rotate'}`} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path}
            className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className={`nav-text ${!isOpen && 'hidden'}`}>{item.text}</span>
          </Link>
        ))}
        <div className="sidebar-section-title">
          <span className={`nav-text ${!isOpen && 'hidden'}`}></span>
        </div>
        {aiAssistantItems.map((item, index) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className={`nav-text ${!isOpen && 'hidden'}`}>{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 