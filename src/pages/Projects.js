import React, { useState, useEffect } from 'react';
import './Projects.css';

const Projects = () => {
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [boards, setBoards] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load boards from localStorage
    const savedBoards = localStorage.getItem('habit-tracker-boards');
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards);
      setBoards(parsedBoards);
      
      // Calculate progress based on completed habits
      const calculateProgress = () => {
        let totalHabits = 0;
        let completedHabits = 0;

        parsedBoards.forEach(board => {
          // Count habits in each column
          Object.values(board.columns).forEach(column => {
            totalHabits += column.length;
            // Count completed habits (in reinforced column)
            if (board.columns.reinforced) {
              completedHabits += board.columns.reinforced.length;
            }
          });
        });

        // Calculate percentage
        const progressPercentage = totalHabits > 0 
          ? Math.round((completedHabits / totalHabits) * 100)
          : 0;
        
        setProgress(progressPercentage);
      };

      calculateProgress();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      // Here you would typically save the project
      console.log('New project:', projectName);
      setShowForm(false);
      setProjectName('');
    }
  };

  return (
    <div className="projects">
      <h1>Projects</h1>
      <div className="projects-container">
        {showForm ? (
          <div className="project-form-container">
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-header">
                <h3>Create New Project</h3>
                <button 
                  type="button" 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="project-input"
                autoFocus
              />
              <div className="progress-section">
                <label>Current Progress</label>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="progress-value">
                  {progress}% Complete ({boards.length} boards)
                </span>
              </div>
              <div className="form-buttons">
                <button type="submit" className="create-btn">Create Project</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button 
            className="add-project-btn"
            onClick={() => setShowForm(true)}
          >
            + New Project
          </button>
        )}
      </div>
    </div>
  );
};

export default Projects; 