import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Boards.css';
import BoardLayout from '../components/BoardLayout';
import CreateBoardForm from '../components/CreateBoardForm';

const STORAGE_KEY = 'habit-tracker-boards';

const Boards = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [boards, setBoards] = useState(() => {
    try {
      const savedBoards = localStorage.getItem(STORAGE_KEY);
      return savedBoards ? JSON.parse(savedBoards) : [];
    } catch (error) {
      console.error('Error loading boards:', error);
      return [];
    }
  });
  const navigate = useNavigate();
  const { boardId } = useParams(); // Get boardId from URL

  // Find the current board based on the boardId from the URL
  const currentBoard = boards.find(board => board.id === parseInt(boardId, 10));

  // Debounced save function
  const saveBoards = useCallback((boardsToSave) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(boardsToSave));
    } catch (error) {
      console.error('Error saving boards:', error);
    }
  }, []);

  // Save boards only when they actually change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveBoards(boards);
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [boards, saveBoards]);

  const handleCreateBoard = () => {
    setShowCreateForm(true);
  };

  const handleSubmitBoard = (boardName) => {
    const newBoard = {
      id: Date.now(),
      name: boardName,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setBoards(prevBoards => [...prevBoards, newBoard]);
    setShowCreateForm(false);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  const handleDeleteBoard = (idToDelete) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      setBoards(prevBoards => prevBoards.filter(board => board.id !== idToDelete));
      // If deleting the current board, navigate back to the main boards page
      if (currentBoard && currentBoard.id === idToDelete) {
        navigate('/boards');
      }
      // Also delete the goals associated with this board
      try {
        localStorage.removeItem(`board_${idToDelete}_goals`);
      } catch (error) {
        console.error('Error removing board goals from localStorage:', error);
      }
    }
  };

  const handleReturnToBoards = () => {
    navigate('/boards'); // Navigate back to the main boards view
  };

  // If a boardId is present in the URL and the board exists, show BoardLayout
  if (boardId && currentBoard) {
    return <BoardLayout board={currentBoard} onReturn={handleReturnToBoards} />;
  }

  // Otherwise, show the list of boards
  return (
    <div className="boards">
      <h1>Boards</h1>
      <div className="boards-grid">
        {boards.map((board) => (
          <div key={board.id} className="board-card">
            <div className="board-header">
              <h3>{board.name}</h3>
              <button
                className="delete-board-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering navigation
                  handleDeleteBoard(board.id);
                }}
              >
                ×
              </button>
            </div>
            <div className="board-info">
              <span className="board-date">
                Created: {new Date(board.createdAt).toLocaleDateString()}
              </span>
            </div>
            <button
              className="view-board-btn"
              onClick={() => navigate(`/boards/${board.id}`)} // Navigate to the specific board URL
            >
              View Board
            </button>
          </div>
        ))}
        {showCreateForm ? (
          <CreateBoardForm
            onSubmit={handleSubmitBoard}
            onCancel={handleCancelCreate}
          />
        ) : (
          <div className="add-board-card">
            <button className="add-board-btn" onClick={handleCreateBoard}>
              + Create New Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Boards; 