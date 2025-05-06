import React, { useState } from 'react';
import './CreateBoardForm.css';

const CreateBoardForm = ({ onSubmit, onCancel }) => {
  const [boardName, setBoardName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (boardName.trim()) {
      onSubmit(boardName);
    }
  };

  return (
    <div className="board-card create-form-card">
      <div className="board-header">
        <h3>Create New Board</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="Enter board name"
          autoFocus
        />
        <div className="form-buttons">
          <button type="submit" className="create-btn">Create Board</button>
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateBoardForm; 