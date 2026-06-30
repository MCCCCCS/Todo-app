import { useState, useEffect } from 'react';
import './style.css';

const API_URL = 'http://localhost:3000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error('❌ Error fetching todos:', err);
      setError('Failed to load tasks. Is the backend running?');
    }
  };

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to add todo');

      setInputValue('');
      await fetchTodos();
    } catch (err) {
      console.error('❌ Error adding todo:', err);
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle completion
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to toggle');
      await fetchTodos();
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      await fetchTodos();
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  // Load todos on mount + auto-refresh
  useEffect(() => {
    fetchTodos();

    const interval = setInterval(fetchTodos, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;

  return (
    <div className="container">
      <div className="header">
        <h1>📝 My Todo List</h1>
        <p className="subtitle">Connected to backend API</p>
      </div>

      <form onSubmit={addTodo} className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What do you want to do?"
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      <div className="stats">
        <span>Total: {total}</span>
        <span>Completed: {completed}</span>
      </div>

      <div id="todoList">
        {todos.length === 0 ? (
          <div className="empty-state">
            <span className="icon">🎯</span>
            No tasks yet.<br />
            Add one above!
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <span
                className={`todo-text ${todo.completed ? 'completed' : ''}`}
                onClick={() => toggleTodo(todo.id)}
                title="Click to toggle completion"
              >
                {todo.text}
              </span>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                title="Delete task"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="error-toast" onClick={() => setError('')}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default App;