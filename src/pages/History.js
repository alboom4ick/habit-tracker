import React, { useState, useEffect, useRef } from 'react';
import './History.css';

const GOALS_STORAGE_KEY = 'habit-tracker-goals';
const HISTORY_TICKS_KEY = 'habit-tracker-history-ticks';
const STREAKS_KEY = 'habit-tracker-streaks';

// Helper to get date string (YYYY-MM-DD)
const getDateString = (date) => date.toISOString().split('T')[0];

// Calculate streak for a goal up to a given date, including previous months
function calculateStreak(goalId, boardId, ticks, selectedMonth) {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === selectedMonth.getFullYear() && today.getMonth() === selectedMonth.getMonth();
  let streak = 0;
  // Start from today if current month, else last day of selected month
  let date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), isCurrentMonth ? today.getDate() : new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate());
  while (true) {
    const dateStr = getDateString(date);
    const checked = ticks[boardId] && ticks[boardId][dateStr] && ticks[boardId][dateStr][goalId];
    if (checked) {
      streak++;
      // Move to previous day
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

const History = () => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [allGoals, setAllGoals] = useState([]);
  const [ticks, setTicks] = useState({});
  const [streaks, setStreaks] = useState({});
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedBoards = localStorage.getItem('habit-tracker-boards');
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards);
      setBoards(parsedBoards);
      if (parsedBoards.length > 0 && isInitialMount.current) {
        setSelectedBoard(parsedBoards[0]);
        isInitialMount.current = false;
      }
    }
    // Load all goals
    const storedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
    if (storedGoals) {
      try {
        setAllGoals(JSON.parse(storedGoals));
      } catch {
        setAllGoals([]);
      }
    } else {
      setAllGoals([]);
    }
    // Load ticks
    const storedTicks = localStorage.getItem(HISTORY_TICKS_KEY);
    if (storedTicks) {
      try {
        setTicks(JSON.parse(storedTicks));
      } catch {
        setTicks({});
      }
    } else {
      setTicks({});
    }
    // Load streaks
    const storedStreaks = localStorage.getItem(STREAKS_KEY);
    if (storedStreaks) {
      try {
        setStreaks(JSON.parse(storedStreaks));
      } catch {
        setStreaks({});
      }
    } else {
      setStreaks({});
    }
  }, []);

  // Save ticks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(HISTORY_TICKS_KEY, JSON.stringify(ticks));
  }, [ticks]);

  // Save streaks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STREAKS_KEY, JSON.stringify(streaks));
  }, [streaks]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Filter goals for the selected board
  const boardGoals = selectedBoard ? allGoals.filter(g => g.boardId === selectedBoard.id) : [];

  // Handle tick/untick and update streaks
  const handleTick = (dateStr, goalId) => {
    setTicks(prev => {
      const boardId = selectedBoard.id;
      const boardTicks = prev[boardId] ? { ...prev[boardId] } : {};
      const dayTicks = boardTicks[dateStr] ? { ...boardTicks[dateStr] } : {};
      dayTicks[goalId] = !dayTicks[goalId];
      boardTicks[dateStr] = dayTicks;
      const newTicks = { ...prev, [boardId]: boardTicks };

      // After updating ticks, recalculate streak for this goal
      setTimeout(() => {
        const streak = calculateStreak(goalId, boardId, newTicks, selectedMonth);
        setStreaks(prevStreaks => {
          const boardStreaks = prevStreaks[boardId] ? { ...prevStreaks[boardId] } : {};
          boardStreaks[goalId] = streak;
          return { ...prevStreaks, [boardId]: boardStreaks };
        });
      }, 0);

      return newTicks;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const days = [];
    const boardId = selectedBoard?.id;

    // Precompute streaks for all goals in this month, up to today
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === selectedMonth.getFullYear() && today.getMonth() === selectedMonth.getMonth();
    // Use streaks from state (persisted)
    // If not available, fallback to calculated streak
    const streaksForBoard = streaks[boardId] || {};
    boardGoals.forEach(goal => {
      if (typeof streaksForBoard[goal.id] === 'undefined') {
        streaksForBoard[goal.id] = calculateStreak(goal.id, boardId, ticks, selectedMonth);
      }
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const dateStr = getDateString(date);
      const dayTicks = (ticks[boardId] && ticks[boardId][dateStr]) || {};
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''}`}
        >
          <span className="day-number">{day}</span>
          <div className="calendar-goals-list">
            {boardGoals.length === 0 && <div className="calendar-goal-empty">No goals</div>}
            {boardGoals.map(goal => (
              <label key={goal.id} className="calendar-goal-item">
                <input
                  type="checkbox"
                  checked={!!dayTicks[goal.id]}
                  onChange={() => handleTick(dateStr, goal.id)}
                />
                <span className={dayTicks[goal.id] ? 'calendar-goal-checked' : ''}>{goal.title}</span>
                {isToday && streaksForBoard[goal.id] >= 2 && (
                  <span className="calendar-goal-streak">🔥 {streaksForBoard[goal.id]}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const handleBoardChange = (e) => {
    const boardId = parseInt(e.target.value);
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setSelectedBoard(board);
    }
  };

  return (
    <div className="history">
      <h1>History</h1>
      <div className="history-container">
        <div className="board-selector">
          <h2>Select Board</h2>
          <select 
            value={selectedBoard?.id || ''} 
            onChange={handleBoardChange}
          >
            {boards.map(board => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>
        </div>

        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>&lt;</button>
            <h2>{selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
          
          <div className="calendar-grid">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
            {renderCalendar()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
