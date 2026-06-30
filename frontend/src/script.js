// ============================================
// CONFIGURATION
// ============================================

// 🔥 BACKEND API URL - CHANGE THIS IF YOUR BACKEND IS ON A DIFFERENT PORT
const API_URL = 'http://localhost:3000/api/todos';

// ============================================
// DOM REFERENCES
// ============================================

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');

// ============================================
// API FUNCTIONS (FRONTEND-BACKEND COMMUNICATION)
// ============================================

// 🔥 GET - Fetch all todos
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch todos');
        const todos = await response.json();
        renderTodos(todos);
        updateStats(todos);
    } catch (error) {
        console.error('❌ Error fetching todos:', error);
        showError('Failed to load tasks. Is the backend running?');
    }
}

// 🔥 POST - Add new todo
async function addTodo() {
    const text = todoInput.value.trim();
    if (!text) {
        shakeElement(todoInput);
        return;
    }

    // Disable button while adding
    addBtn.disabled = true;
    addBtn.textContent = 'Adding...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error('Failed to add todo');
        
        todoInput.value = '';
        todoInput.focus();
        await fetchTodos(); // Refresh list
    } catch (error) {
        console.error('❌ Error adding todo:', error);
        showError('Failed to add task. Please try again.');
    } finally {
        addBtn.disabled = false;
        addBtn.textContent = 'Add Task';
    }
}

// 🔥 PUT - Toggle todo completion
async function toggleTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT'
        });

        if (!response.ok) throw new Error('Failed to toggle todo');
        await fetchTodos(); // Refresh list
    } catch (error) {
        console.error('❌ Error toggling todo:', error);
        showError('Failed to update task.');
    }
}

// 🔥 DELETE - Remove todo
async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete todo');
        await fetchTodos(); // Refresh list
    } catch (error) {
        console.error('❌ Error deleting todo:', error);
        showError('Failed to delete task.');
    }
}

// ============================================
// UI RENDER FUNCTIONS
// ============================================

function renderTodos(todos) {
    if (!todos || todos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <span class="icon">🎯</span>
                No tasks yet.<br>
                Add one above!
            </div>
        `;
        return;
    }

    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item" data-id="${todo.id}">
            <span class="todo-text ${todo.completed ? 'completed' : ''}" 
                  onclick="toggleTodo(${todo.id})"
                  title="Click to toggle completion">
                ${escapeHtml(todo.text)}
            </span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Delete task">
                ✕
            </button>
        </div>
    `).join('');
}

function updateStats(todos) {
    const total = todos ? todos.length : 0;
    const completed = todos ? todos.filter(t => t.completed).length : 0;
    totalTasks.textContent = `Total: ${total}`;
    completedTasks.textContent = `Completed: ${completed}`;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function shakeElement(element) {
    element.style.animation = 'shake 0.3s ease';
    element.style.borderColor = '#ff6b6b';
    setTimeout(() => {
        element.style.animation = '';
        element.style.borderColor = '';
    }, 300);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(255, 107, 107, 0.4);
        font-weight: 500;
        animation: slideUp 0.3s ease;
        z-index: 1000;
    `;
    errorDiv.textContent = '⚠️ ' + message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transition = 'opacity 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

todoInput.addEventListener('focus', () => {
    todoInput.select();
});

// ============================================
// ADD SHAKE ANIMATION
// ============================================

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(styleSheet);

// ============================================
// INITIALIZATION
// ============================================

// Load todos when page loads
fetchTodos();

// Check if backend is reachable
async function checkBackendHealth() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            console.log('✅ Backend is running!');
        }
    } catch (error) {
        console.warn('⚠️ Backend not reachable. Make sure it\'s running on port 3000');
        showError('Backend not running. Please start the server.');
    }
}

// Check backend connection after 1 second
setTimeout(checkBackendHealth, 1000);

// Auto-refresh every 30 seconds (in case of multiple users)
setInterval(fetchTodos, 30000);