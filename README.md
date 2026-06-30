# 📝 Todo App - Frontend + Backend Connection

A simple but complete Todo application demonstrating frontend-backend communication using JavaScript, Node.js, Express, and REST API.

## 🚀 Features

- ✅ Create new tasks
- ✅ Read/View all tasks
- ✅ Update task completion status (toggle)
- ✅ Delete tasks
- ✅ Persistent storage (JSON file)
- ✅ Beautiful responsive UI
- ✅ Error handling
- ✅ Auto-refresh

## 🏗️ Technology Stack

### Backend
- Node.js
- Express.js
- CORS for cross-origin requests
- File system (fs) for data persistence

### Frontend
- HTML5
- CSS3 (with animations)
- Vanilla JavaScript
- Fetch API for HTTP requests

## 📁 Project Structure
todo-app/
├── backend/
│ ├── server.js # Express server with REST API
│ ├── package.json # Backend dependencies
│ └── data.json # Database (JSON storage)
├── frontend/
│ ├── index.html # Main HTML page
│ ├── style.css # Styling
│ └── script.js # Frontend logic + API calls
└── README.md # This file


## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- A modern web browser

### Step 1: Clone or Download
Download the project files or clone the repository.

### Step 2: Install Backend Dependencies
```bash
cd todo-app/backend
npm install

# steps in command

# 1. Create project structure
mkdir todo-app
cd todo-app
mkdir backend, frontend

# 2. Setup backend
cd backend
npm init -y
npm install express cors
npm install --save-dev nodemon
echo '[]' > data.json
New-Item -Path "server.js" -ItemType File

# 3. Setup frontend
cd ../frontend
New-Item -Path "index.html" -ItemType File
New-Item -Path "style.css" -ItemType File
New-Item -Path "script.js" -ItemType File

# 4. Now copy the code into files (use your editor)

# 5. Start backend
cd ../backend
npm start

# 6. Open frontend (in new terminal)
cd ../frontend
start index.html  # Windows
# OR
python -m http.server 8000  # Then open http://localhost:8000

# Running the Project (Every Time)

1. start backend

cd todo-app/backend
npm start

2. start frontend 

cd todo-app/frontend
# Either double-click index.html OR
python -m http.server 8000

3. Open Browser
If using Live Server: VS Code will open automatically

If using Python server: Go to http://localhost:8000

If double-clicking: File opens in default browser


 Stopping the Servers
Stop Backend:
Press Ctrl + C in the terminal where the backend is running

Stop Frontend (if using Python server):
Press Ctrl + C in the terminal where the frontend server is running

# flow chart 
Frontend                 Backend                 Database
   |                        |                        |
   | 1. fetch(API_URL)      |                        |
   |----------------------->|                        |
   |                        | 2. readTodos()         |
   |                        |----------------------->|
   |                        |                        |
   |                        | 3. Return data         |
   |                        |<-----------------------|
   | 4. Response (JSON)     |                        |
   |<-----------------------|                        |
   |                        |                        |

for frontend

# Create Vite React project
npm create vite@latest frontend

cd todo-react-app
npm install
npm run dev
