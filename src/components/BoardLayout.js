import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdCheck, MdDoneAll, MdRateReview, MdSave } from 'react-icons/md';
import './BoardLayout.css';

const GOALS_STORAGE_KEY = 'habit-tracker-goals';

const BoardLayout = ({ board, onReturn }) => {
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [reflectionEditId, setReflectionEditId] = useState(null);
  const [reflectionText, setReflectionText] = useState('');

  // Load all goals from localStorage and filter for this board
  useEffect(() => {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    if (stored) {
      try {
        setGoals(JSON.parse(stored).filter(g => g.boardId === board.id));
      } catch {
        setGoals([]);
      }
    } else {
      setGoals([]);
    }
  }, [board.id]);

  // Save all goals for all boards to localStorage
  const saveAllGoals = (updatedGoalsForThisBoard) => {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    let allGoals = [];
    if (stored) {
      try {
        allGoals = JSON.parse(stored).filter(g => g.boardId !== board.id);
      } catch {
        allGoals = [];
      }
    }
    const newAllGoals = [...allGoals, ...updatedGoalsForThisBoard];
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(newAllGoals));
  };

  // Add or update goal
  const handleSubmitGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    let updatedGoals;
    if (editingGoal) {
      updatedGoals = goals.map(g => g.id === editingGoal.id ? { ...g, title: goalTitle } : g);
      setEditingGoal(null);
    } else {
      updatedGoals = [...goals, { id: Date.now(), boardId: board.id, title: goalTitle, createdAt: new Date().toISOString(), status: 'cue' }];
    }
    setGoals(updatedGoals);
    saveAllGoals(updatedGoals);
    setGoalTitle('');
    setShowGoalForm(false);
  };

  // Edit goal
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setShowGoalForm(false);
  };

  // Delete goal
  const handleDeleteGoal = (goalId) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    saveAllGoals(updatedGoals);
  };

  // Move to In Progress
  const handleMoveToInProgress = (goal) => {
    const updatedGoals = goals.map(g => g.id === goal.id ? { ...g, status: 'in-progress', movedAt: new Date().toISOString() } : g);
    setGoals(updatedGoals);
    saveAllGoals(updatedGoals);
  };

  // Move to Reinforced (Completed)
  const handleMoveToReinforced = (goal) => {
    const updatedGoals = goals.map(g => g.id === goal.id ? { ...g, status: 'reinforced', reinforcedAt: new Date().toISOString() } : g);
    setGoals(updatedGoals);
    saveAllGoals(updatedGoals);
  };

  // Move to Reflections (Review)
  const handleMoveToReflections = (goal) => {
    const updatedGoals = goals.map(g => g.id === goal.id ? { ...g, status: 'reflections', reflectedAt: new Date().toISOString() } : g);
    setGoals(updatedGoals);
    saveAllGoals(updatedGoals);
  };

  // Reflection editing
  const handleStartReflection = (goal) => {
    setReflectionEditId(goal.id);
    setReflectionText(goal.reflection || '');
  };

  const handleSaveReflection = (goalId) => {
    const updatedGoals = goals.map(g => g.id === goalId ? { ...g, reflection: reflectionText } : g);
    setGoals(updatedGoals);
    saveAllGoals(updatedGoals);
    setReflectionEditId(null);
    setReflectionText('');
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setShowGoalForm(false);
  };

  // Cancel reflection
  const handleCancelReflection = () => {
    setReflectionEditId(null);
    setReflectionText('');
  };

  // Filter goals by status
  const cueGoals = goals.filter(g => g.status === 'cue');
  const inProgressGoals = goals.filter(g => g.status === 'in-progress');
  const reinforcedGoals = goals.filter(g => g.status === 'reinforced');
  const reflectionGoals = goals.filter(g => g.status === 'reflections');

  // Progress bar calculation
  const totalGoals = goals.length;
  const completedAndReflected = reinforcedGoals.length + reflectionGoals.length;
  const progressPercent = totalGoals > 0 ? Math.round((completedAndReflected / totalGoals) * 100) : 0;

  return (
    <div className="board-layout">
      <div className="board-container">
        <div className="board-header">
          <button className="return-btn" onClick={onReturn}>← Back to Boards</button>
          <h2>{board.name}</h2>
        </div>
        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar-label">
            Completed or Reflected: {completedAndReflected} / {totalGoals} ({progressPercent}%)
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="board-columns">
          {/* Cue (Goal) Column */}
          <div className="board-column">
            <div className="column-header"><h3>Cue (Goal)</h3></div>
            <div className="add-item">
              {showGoalForm ? (
                <form onSubmit={handleSubmitGoal} className="goal-form">
                  <input
                    type="text"
                    value={goalTitle}
                    onChange={e => setGoalTitle(e.target.value)}
                    placeholder="Enter goal title"
                    className="goal-input"
                    autoFocus
                  />
                  <div className="goal-form-buttons">
                    <button type="submit" className="submit-btn">{editingGoal ? 'Update' : 'Add'} Goal</button>
                    <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </form>
              ) : (
                <button className="add-item-btn" onClick={() => { setShowGoalForm(true); setEditingGoal(null); setGoalTitle(''); }}>+ Add Goal</button>
              )}
            </div>
            <div className="column-content">
              {cueGoals.map(goal => (
                <div key={goal.id} className="goal-card">
                  {editingGoal?.id === goal.id ? (
                    <form onSubmit={handleSubmitGoal} className="goal-form">
                      <input
                        type="text"
                        value={goalTitle}
                        onChange={e => setGoalTitle(e.target.value)}
                        placeholder="Enter goal title"
                        className="goal-input"
                        autoFocus
                      />
                      <div className="goal-form-buttons">
                        <button type="submit" className="submit-btn">Update</button>
                        <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="goal-header">
                        <h4>{goal.title}</h4>
                        <div className="goal-actions">
                          <button className="tick-btn" onClick={() => handleMoveToInProgress(goal)} title="Move to In Progress"><MdCheck size={18} /></button>
                          <button className="edit-btn" onClick={() => handleEditGoal(goal)} title="Edit goal"><MdEdit size={18} /></button>
                          <button className="delete-btn" onClick={() => handleDeleteGoal(goal.id)} title="Delete goal"><MdDelete size={18} /></button>
                        </div>
                      </div>
                      <div className="goal-date">Created: {new Date(goal.createdAt).toLocaleDateString()}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* In Progress Column */}
          <div className="board-column">
            <div className="column-header"><h3>In Progress (Action)</h3></div>
            <div className="column-content">
              {inProgressGoals.map(goal => (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h4>{goal.title}</h4>
                    <div className="goal-actions">
                      <button className="tick-btn" onClick={() => handleMoveToReinforced(goal)} title="Move to Reinforced"><MdDoneAll size={18} /></button>
                      <button className="delete-btn" onClick={() => handleDeleteGoal(goal.id)} title="Delete goal"><MdDelete size={18} /></button>
                    </div>
                  </div>
                  <div className="goal-date">Started: {new Date(goal.movedAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Reinforced (Completed) Column */}
          <div className="board-column">
            <div className="column-header"><h3>Reinforced (Completed)</h3></div>
            <div className="column-content">
              {reinforcedGoals.map(goal => (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h4>{goal.title}</h4>
                    <div className="goal-actions">
                      <button className="tick-btn" onClick={() => handleMoveToReflections(goal)} title="Move to Reflections"><MdRateReview size={18} /></button>
                      <button className="delete-btn" onClick={() => handleDeleteGoal(goal.id)} title="Delete goal"><MdDelete size={18} /></button>
                    </div>
                  </div>
                  <div className="goal-date">Completed: {new Date(goal.reinforcedAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Reflections (Review) Column */}
          <div className="board-column">
            <div className="column-header"><h3>Reflections (Review)</h3></div>
            <div className="column-content">
              {reflectionGoals.map(goal => (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h4>{goal.title}</h4>
                    <div className="goal-actions">
                      {reflectionEditId === goal.id ? null : (
                        <button className="edit-btn" onClick={() => handleStartReflection(goal)} title="Write Reflection"><MdEdit size={18} /></button>
                      )}
                      <button className="delete-btn" onClick={() => handleDeleteGoal(goal.id)} title="Delete goal"><MdDelete size={18} /></button>
                    </div>
                  </div>
                  <div className="goal-date">Reflected: {new Date(goal.reflectedAt).toLocaleDateString()}</div>
                  {reflectionEditId === goal.id ? (
                    <form onSubmit={e => { e.preventDefault(); handleSaveReflection(goal.id); }} className="reflection-form">
                      <textarea
                        className="reflection-input"
                        value={reflectionText}
                        onChange={e => setReflectionText(e.target.value)}
                        placeholder="Write your reflection here..."
                        autoFocus
                      />
                      <div className="goal-form-buttons">
                        <button type="submit" className="submit-btn" title="Save Reflection"><MdSave size={18} /> Save</button>
                        <button type="button" className="cancel-btn" onClick={handleCancelReflection}>Cancel</button>
                      </div>
                    </form>
                  ) : goal.reflection ? (
                    <div className="reflection-text">{goal.reflection}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardLayout; 