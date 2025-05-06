import React, { useState, useEffect } from 'react';
import './Settings.css';

const SETTINGS_CLICKS_KEY = 'settings_button_clicks';

const Settings = () => {
  const [devMode, setDevMode] = useState(false);
  const [clicks, setClicks] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_CLICKS_KEY);
    if (stored) {
      try {
        setClicks(JSON.parse(stored));
      } catch {
        setClicks({});
      }
    }
  }, [devMode]);

  // Helper to increment click count
  const handleButtonClick = (buttonName) => {
    setClicks(prev => {
      const newClicks = { ...prev, [buttonName]: (prev[buttonName] || 0) + 1 };
      localStorage.setItem(SETTINGS_CLICKS_KEY, JSON.stringify(newClicks));
      return newClicks;
    });
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="settings-container">
        <div className="settings-section">
          <h2>Profile Settings</h2>
          <div className="settings-card">
            <div className="setting-item">
              <label>Display Name</label>
              <input type="text" placeholder="Enter your name" />
            </div>
            <div className="setting-item">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            <div className="setting-item">
              <label>Time Zone</label>
              <select>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+1 (Central European Time)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notification Settings</h2>
          <div className="settings-card">
            <div className="setting-item">
              <label>Email Notifications</label>
              <label className="switch">
                <input type="checkbox" onClick={() => handleButtonClick('email_notifications')} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <label>Task Reminders</label>
              <label className="switch">
                <input type="checkbox" defaultChecked onClick={() => handleButtonClick('task_reminders')} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <label>Weekly Reports</label>
              <label className="switch">
                <input type="checkbox" onClick={() => handleButtonClick('weekly_reports')} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="settings-card">
            <div className="setting-item">
              <label>Theme</label>
              <select onClick={() => handleButtonClick('theme')}>
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Language</label>
              <select onClick={() => handleButtonClick('language')}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>

        <button className="save-settings-btn" onClick={() => handleButtonClick('save_settings')}>Save Changes</button>

        <div className="settings-section">
          <button
            className={"dev-mode-toggle-btn" + (devMode ? " active" : "")}
            style={{
              marginTop: '2rem',
              background: devMode ? '#FF8A65' : '#7AE2CF',
              color: devMode ? '#fff' : '#06202B',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1.2rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s'
            }}
            onClick={() => setDevMode((prev) => !prev)}
          >
            {devMode ? 'Hide Dev Mode' : 'Show Dev Mode'}
          </button>
          {devMode && (
            <div className="dev-mode-panel">
              <h3>Button Clicks (Dev Mode)</h3>
              <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {Object.entries(clicks).map(([btn, count]) => (
                  <li key={btn} style={{ fontSize: '0.95rem', color: '#077A7D', marginBottom: '0.25rem' }}>
                    <b>{btn.replace(/_/g, ' ')}</b>: {count}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 