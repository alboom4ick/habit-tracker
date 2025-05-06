import React from 'react';
import './Analytics.css';

const Analytics = () => {
  return (
    <div className="analytics">
      <h1>Analytics</h1>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Task Completion Rate</h3>
          <div className="stat-value">85%</div>
          <div className="stat-description">Tasks completed on time</div>
        </div>
        <div className="analytics-card">
          <h3>Active Projects</h3>
          <div className="stat-value">4</div>
          <div className="stat-description">Currently in progress</div>
        </div>
        <div className="analytics-card">
          <h3>Habit Streak</h3>
          <div className="stat-value">12 days</div>
          <div className="stat-description">Current longest streak</div>
        </div>
      </div>
      <div className="analytics-charts">
        <div className="chart-card">
          <h3>Weekly Progress</h3>
          <div className="chart-placeholder">
            <p>Chart visualization will be displayed here</p>
          </div>
        </div>
        <div className="chart-card">
          <h3>Task Distribution</h3>
          <div className="chart-placeholder">
            <p>Chart visualization will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 