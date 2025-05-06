import React from 'react';
import './AppBar.css';

const AppBar = () => {
  return (
    <div className="app-bar">
      <div className="app-bar-content">
        <h1></h1>
        <button className="add-task-button">
          + Add task
        </button>
      </div>
    </div>
  );
};

export default AppBar; 