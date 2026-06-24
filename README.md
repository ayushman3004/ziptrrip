# Ziptrrip Todo App

A complete full-stack Todo application built for the Ziptrrip internship assignment. Features a RESTful Node.js/Express backend with SOLID architecture and a React+Vite frontend with multi-page routing.

---

## Features

### Backend
- Full CRUD REST API (`POST`, `GET`, `PUT`, `DELETE`)
- Filtering by status, priority, and search term
- Sorting by due date and priority (asc/desc)
- JSON file-based persistent storage (auto-created)
- SOLID architecture: clean layer separation
- Repository pattern — swappable storage backend
- Centralized error handling with proper HTTP status codes
- Input validation with descriptive error messages
- CORS configured for `http://localhost:3000`

### Frontend
- List page: display all todos with real-time search and filters
- Detail page: full todo view with all fields
- Add, edit, delete todos via modal form
- Toggle complete/incomplete per todo
- Filter by: status (all/active/completed), priority (all/low/medium/high)
- Sort by due date and priority (ascending/descending)
- Overdue indicator on cards and detail page
- Loading states (spinner), error states, empty states
- Light/dark mode toggle with system preference detection
- Fully responsive layout for mobile and desktop
- Multi-page navigation via `window.location.href` (full page reloads, no shared state)

---

## Setup & Run Instructions

### Prerequisites
- Node.js v18+ (ES Modules support required)
- npm v9+

### 1. Clone / Open Project
```bash
cd /path/to/project
```

### 2. Start the Backend
```bash
cd backend
npm install       # Install dependencies (only needed once)
node server.js    # Start the API server
```
The backend runs at: **http://localhost:3001**

### 3. Start the Frontend
Open a new terminal:
```bash
cd frontend
npm install       # Install dependencies (only needed once)
npm run dev       # Start Vite dev server
```
The frontend runs at: **http://localhost:3000**

### 4. Open the App
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** Both servers must be running simultaneously. The `backend/data/todos.json` file is auto-created on first run.

---

## Folder Structure

```
project-root/
├── backend/
│   ├── server.js                  ← Entry point: bootstraps Express
│   ├── routes/todos.js            ← HTTP route definitions only
│   ├── controllers/todoController.js ← req/res handling only
│   ├── services/todoService.js    ← Business logic & validation
│   ├── repositories/
│   │   ├── IRepository.js         ← Abstract interface (throws "Not implemented")
│   │   └── FileRepository.js      ← Concrete JSON file storage implementation
│   ├── models/Todo.js             ← createTodo() factory function
│   ├── middleware/errorHandler.js  ← Centralized error middleware
│   ├── data/todos.json            ← JSON data store (auto-created)
│   └── package.json
│
├── frontend/
│   ├── index.html
│   └── src/
│       ├── api/todoApi.js         ← All fetch calls
│       ├── hooks/
│       │   ├── useTodos.js        ← List page state hook
│       │   └── useTodo.js         ← Detail page state hook
│       ├── pages/
│       │   ├── TodoList.jsx       ← Route "/"
│       │   └── TodoDetail.jsx     ← Route "/todo?id=xxx"
│       ├── components/
│       │   ├── TodoCard.jsx
│       │   ├── AddEditModal.jsx
│       │   ├── FilterBar.jsx
│       │   ├── PriorityBadge.jsx
│       │   ├── EmptyState.jsx
│       │   └── ThemeToggle.jsx
│       ├── App.jsx                ← React Router v6 setup
│       ├── main.jsx
│       └── index.css              ← Full design system
│
├── README.md
├── FEATURES.md
├── API_DOCUMENTATION.md
└── ARCHITECTURE.md
```

---

## API Base URL

```
http://localhost:3001/api/todos
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full endpoint reference.
