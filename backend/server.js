const express = require('express');     // Framework to create web server
const cors = require('cors');           // Allows frontend (React) to talk to backend
const fs = require('fs');               // File System — to read/write data.json
const path = require('path');           // Helps build file paths safely

const app = express();                  // Creates the server
const PORT = process.env.PORT || 3000;  // Port to listen on (3000 for local dev, or from environment variable)

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());                  // Allow cross-origin requests (frontend <-> backend)
app.use(express.json());          // Understand JSON data sent from frontend

// ============================================
// DATA FILE PATH
// ============================================
const DATA_FILE = path.join(__dirname, 'data.json');   // Defines where the data.json file is located

// ============================================
// DATA OPERATIONS
// ============================================
const readTodos = () => {
  try {
    const data = fs.readFileSync(DATA_FILE);     // Read the file
    return JSON.parse(data);                     // Convert JSON string to JavaScript array
  } catch (error) {
    return [];                                   // If file doesn't exist or is empty, return an empty array
  }
};

const writeTodos = (todos) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));     // Write the array back to the file as a JSON string
};

// ============================================
// API ROUTES
// ============================================

// GET all todos
app.get('/api/todos', (req, res) => {
  const todos = readTodos();        // Read the current list of todos from the file
  res.json(todos);                  // Send the list back to the frontend as JSON
});

// POST new todo
app.post('/api/todos', (req, res) => {
  const todos = readTodos();        // Read the current list of todos
  const newTodo = {                 // Create a new todo object
    id: Date.now(),                 // Unique ID based on timestamp
    text: req.body.text,            // Text of the todo from the request body
    completed: false                // New todos are not completed by default
  };
  todos.push(newTodo);              // Add the new todo to the list
  writeTodos(todos);                // Save the updated list back to the file
  res.status(201).json(newTodo);    // Send the new todo back to the frontend with a 201 Created status
});

// PUT toggle todo
app.put('/api/todos/:id', (req, res) => {       // Toggle the completion status of a todo by its ID
  const todos = readTodos();                    // Read the current list of todos
  const id = parseInt(req.params.id);           // Get the ID from the URL and convert it to an integer
  const todo = todos.find(t => t.id === id);    // Find the todo with the matching ID
  
  if (todo) {
    todo.completed = !todo.completed;           // Toggle the completed status
    writeTodos(todos);                          // Save the updated list back to the file
    res.json(todo);                             // Send the updated todo back to the frontend
  } else {
    res.status(404).json({ error: 'Todo not found' });   // If the todo with the given ID doesn't exist, send a 404 Not Found response
  }
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {    // Delete a todo by its ID
  let todos = readTodos();                      // Read the current list of todos
  const id = parseInt(req.params.id);           // Get the ID from the URL and convert it to an integer
  todos = todos.filter(t => t.id !== id);       // Remove the todo with the matching ID from the list
  writeTodos(todos);                            // Save the updated list back to the file
  res.json({ message: 'Todo deleted' });        // Send a confirmation message back to the frontend
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {                                                     // Start the server and listen on the specified port
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/todos`);
});